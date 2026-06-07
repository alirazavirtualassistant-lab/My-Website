# =====================================================================
# R Statistical Analysis — Portfolio Sample
# Author: Ali Raza
# Topic:  Linear and logistic regression on a marketing campaign dataset
# Output: Tidy results table + diagnostic plots
# Dependencies: tidyverse, broom, performance, ggplot2, car
# =====================================================================

suppressPackageStartupMessages({
  library(tidyverse)
  library(broom)
  library(performance)
  library(car)
  library(ggplot2)
})

set.seed(42)

# --- 1. Load and explore --------------------------------------------
data_path <- "marketing_campaign.csv"
df <- read_csv(data_path, show_col_types = FALSE)
glimpse(df)
summary(df)

# --- 2. Basic cleaning ----------------------------------------------
df <- df %>%
  mutate(
    converted   = as.factor(converted),
    channel     = factor(channel, levels = c("email", "social", "search", "display")),
    income_k    = income / 1000,
    log_spend   = log1p(ad_spend)
  ) %>%
  drop_na(converted, channel, age, income_k, ad_spend)

cat("Rows after cleaning:", nrow(df), "\n")

# --- 3. Descriptive statistics by channel ---------------------------
desc_by_channel <- df %>%
  group_by(channel) %>%
  summarise(
    n         = n(),
    cvr       = mean(converted == "1"),
    avg_spend = mean(ad_spend),
    avg_ctr   = mean(ctr, na.rm = TRUE),
    .groups   = "drop"
  )
print(desc_by_channel)

# --- 4. Linear regression: ad_spend → revenue -----------------------
# Continuous outcome model — useful where dependent variable is revenue
lm_model <- lm(revenue ~ log_spend + age + income_k + channel, data = df)

cat("\n--- Linear regression summary ---\n")
print(summary(lm_model))

# Tidy table
tidy_lm <- tidy(lm_model, conf.int = TRUE) %>%
  mutate(across(where(is.numeric), \(x) round(x, 4)))
print(tidy_lm)

# Multicollinearity check
cat("\n--- VIF (multicollinearity) ---\n")
print(vif(lm_model))

# --- 5. Logistic regression: probability of conversion --------------
glm_model <- glm(
  converted ~ log_spend + age + income_k + channel,
  data   = df,
  family = binomial(link = "logit")
)

cat("\n--- Logistic regression summary ---\n")
print(summary(glm_model))

# Odds ratios with 95% CI
or_table <- tidy(glm_model, conf.int = TRUE, exponentiate = TRUE) %>%
  rename(odds_ratio = estimate) %>%
  mutate(across(where(is.numeric), \(x) round(x, 4)))

cat("\n--- Odds Ratios ---\n")
print(or_table)

# Model performance
cat("\n--- Model performance ---\n")
print(performance(glm_model))

# --- 6. Diagnostic plots --------------------------------------------
ggplot(df, aes(x = log_spend, y = revenue, colour = channel)) +
  geom_point(alpha = 0.4) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(
    title    = "Revenue vs. log Ad Spend, by channel",
    subtitle = "Linear fit per channel, OLS",
    x        = "log(1 + ad_spend)",
    y        = "Revenue"
  ) +
  theme_minimal(base_size = 12)
ggsave("revenue_vs_spend.png", width = 9, height = 5, dpi = 150)

# Residual diagnostics
par(mfrow = c(2, 2))
plot(lm_model)
par(mfrow = c(1, 1))

cat("\nAnalysis complete. Tables and plots written to working directory.\n")
