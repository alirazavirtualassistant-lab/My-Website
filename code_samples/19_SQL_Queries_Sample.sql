-- ==================================================================
-- SQL Queries Portfolio — Ali Raza
-- Database: SQL Server / PostgreSQL compatible (T-SQL where noted)
-- Topic: Sales Analytics on a typical retail schema
-- ==================================================================
-- Tables assumed:
--   customers(customer_id, name, country, signup_date)
--   orders(order_id, customer_id, order_date, status, amount)
--   order_items(order_id, product_id, qty, unit_price)
--   products(product_id, name, category, cost)

-- ------------------------------------------------------------------
-- 1. TOP 10 CUSTOMERS BY LIFETIME VALUE (LTV)
-- ------------------------------------------------------------------
SELECT TOP 10
    c.customer_id,
    c.name,
    c.country,
    COUNT(o.order_id)                AS order_count,
    SUM(o.amount)                    AS lifetime_value,
    AVG(o.amount)                    AS avg_order_value,
    DATEDIFF(day, MIN(o.order_date), MAX(o.order_date)) AS days_active
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.name, c.country
ORDER BY lifetime_value DESC;

-- ------------------------------------------------------------------
-- 2. MONTHLY REVENUE WITH RUNNING TOTAL & YOY GROWTH
-- ------------------------------------------------------------------
WITH monthly AS (
    SELECT
        DATEFROMPARTS(YEAR(order_date), MONTH(order_date), 1) AS month_start,
        SUM(amount) AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATEFROMPARTS(YEAR(order_date), MONTH(order_date), 1)
)
SELECT
    month_start,
    revenue,
    SUM(revenue) OVER (ORDER BY month_start) AS running_total,
    LAG(revenue, 12) OVER (ORDER BY month_start) AS revenue_py,
    ( revenue - LAG(revenue, 12) OVER (ORDER BY month_start) )
        / NULLIF(LAG(revenue, 12) OVER (ORDER BY month_start), 0) AS yoy_growth
FROM monthly
ORDER BY month_start;

-- ------------------------------------------------------------------
-- 3. CUSTOMER COHORT ANALYSIS (FIRST-PURCHASE MONTH)
-- ------------------------------------------------------------------
WITH first_order AS (
    SELECT
        customer_id,
        DATEFROMPARTS(YEAR(MIN(order_date)), MONTH(MIN(order_date)), 1) AS cohort_month
    FROM orders
    WHERE status = 'completed'
    GROUP BY customer_id
),
cohort_data AS (
    SELECT
        f.cohort_month,
        DATEDIFF(month, f.cohort_month, o.order_date) AS period_number,
        COUNT(DISTINCT o.customer_id) AS active_customers
    FROM first_order f
    JOIN orders o ON o.customer_id = f.customer_id
    WHERE o.status = 'completed'
    GROUP BY f.cohort_month, DATEDIFF(month, f.cohort_month, o.order_date)
)
SELECT
    cohort_month,
    period_number,
    active_customers,
    1.0 * active_customers
        / FIRST_VALUE(active_customers) OVER (PARTITION BY cohort_month ORDER BY period_number)
        AS retention_rate
FROM cohort_data
ORDER BY cohort_month, period_number;

-- ------------------------------------------------------------------
-- 4. PRODUCT-CATEGORY MARGIN ANALYSIS
-- ------------------------------------------------------------------
SELECT
    p.category,
    COUNT(DISTINCT oi.order_id) AS orders,
    SUM(oi.qty * oi.unit_price)              AS revenue,
    SUM(oi.qty * p.cost)                     AS cogs,
    SUM(oi.qty * (oi.unit_price - p.cost))   AS gross_profit,
    SUM(oi.qty * (oi.unit_price - p.cost))
        / NULLIF(SUM(oi.qty * oi.unit_price), 0) AS gross_margin
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
JOIN orders   o ON o.order_id   = oi.order_id
WHERE o.status = 'completed'
  AND o.order_date >= DATEADD(year, -1, GETDATE())
GROUP BY p.category
ORDER BY gross_profit DESC;

-- ------------------------------------------------------------------
-- 5. RFM SEGMENTATION (Recency / Frequency / Monetary) — quintile bins
-- ------------------------------------------------------------------
WITH rfm AS (
    SELECT
        customer_id,
        DATEDIFF(day, MAX(order_date), GETDATE()) AS recency,
        COUNT(*)                                  AS frequency,
        SUM(amount)                               AS monetary
    FROM orders
    WHERE status = 'completed'
      AND order_date >= DATEADD(year, -2, GETDATE())
    GROUP BY customer_id
),
scored AS (
    SELECT
        customer_id, recency, frequency, monetary,
        NTILE(5) OVER (ORDER BY recency ASC)   AS r_score, -- recent = 5
        NTILE(5) OVER (ORDER BY frequency DESC) AS f_score,
        NTILE(5) OVER (ORDER BY monetary DESC)  AS m_score
    FROM rfm
)
SELECT
    customer_id,
    recency, frequency, monetary,
    r_score, f_score, m_score,
    CASE
        WHEN r_score = 5 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
        WHEN r_score >= 4 AND f_score >= 3 AND m_score >= 3 THEN 'Loyal'
        WHEN r_score >= 4 AND f_score <= 2                 THEN 'Promising'
        WHEN r_score <= 2 AND f_score >= 4 AND m_score >= 4 THEN 'At Risk - High Value'
        WHEN r_score <= 2 AND f_score <= 2                 THEN 'Lost'
        ELSE 'Standard'
    END AS rfm_segment
FROM scored
ORDER BY monetary DESC;

-- ------------------------------------------------------------------
-- 6. ORDER FUNNEL (placed → paid → shipped → delivered)
-- ------------------------------------------------------------------
SELECT
    SUM(CASE WHEN status IN ('placed','paid','shipped','delivered','completed') THEN 1 ELSE 0 END) AS placed,
    SUM(CASE WHEN status IN ('paid','shipped','delivered','completed')          THEN 1 ELSE 0 END) AS paid,
    SUM(CASE WHEN status IN ('shipped','delivered','completed')                 THEN 1 ELSE 0 END) AS shipped,
    SUM(CASE WHEN status IN ('delivered','completed')                           THEN 1 ELSE 0 END) AS delivered,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)                                          AS completed
FROM orders
WHERE order_date >= DATEADD(month, -3, GETDATE());
