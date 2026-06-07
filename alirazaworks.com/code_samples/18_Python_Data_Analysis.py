"""
Python Data Analysis — Sales Performance Notebook (Script Form)
Author: Ali Raza
Description:
    End-to-end exploratory analysis of a quarterly sales dataset.
    Demonstrates: cleaning, EDA, cohort analysis, statistical testing,
    and chart generation. Outputs a PDF report-ready figures folder.

Usage:
    python 18_Python_Data_Analysis.py --input sales.csv --outdir figures/
"""

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from scipy import stats

sns.set_theme(style="whitegrid", palette="muted")
pd.options.display.float_format = "{:,.2f}".format


def load_and_clean(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["order_date"])

    # Basic cleaning
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    df = df.dropna(subset=["order_id", "customer_id", "amount"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df = df[df["amount"] > 0]

    # Feature engineering
    df["order_month"] = df["order_date"].dt.to_period("M")
    df["order_year"] = df["order_date"].dt.year
    df["weekday"] = df["order_date"].dt.day_name()

    return df


def descriptive_stats(df: pd.DataFrame) -> None:
    print("\n=== Descriptive Statistics ===")
    print(df["amount"].describe())
    print(f"\nUnique customers: {df['customer_id'].nunique():,}")
    print(f"Date range: {df['order_date'].min():%Y-%m-%d} → {df['order_date'].max():%Y-%m-%d}")


def monthly_trend_chart(df: pd.DataFrame, outdir: Path) -> None:
    monthly = df.groupby("order_month")["amount"].sum().reset_index()
    monthly["order_month"] = monthly["order_month"].dt.to_timestamp()

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(monthly["order_month"], monthly["amount"], marker="o", linewidth=2)
    ax.set_title("Monthly Revenue Trend", fontsize=14, fontweight="bold")
    ax.set_ylabel("Revenue ($)")
    ax.set_xlabel("")
    ax.yaxis.set_major_formatter(lambda x, _: f"${x/1e3:,.0f}K")
    fig.tight_layout()
    fig.savefig(outdir / "monthly_trend.png", dpi=150)
    plt.close(fig)


def cohort_retention(df: pd.DataFrame, outdir: Path) -> pd.DataFrame:
    df = df.copy()
    first_purchase = df.groupby("customer_id")["order_date"].min().rename("cohort_date")
    df = df.merge(first_purchase, on="customer_id")
    df["cohort_month"] = df["cohort_date"].dt.to_period("M")
    df["period_number"] = (
        (df["order_date"].dt.year - df["cohort_date"].dt.year) * 12
        + (df["order_date"].dt.month - df["cohort_date"].dt.month)
    )

    cohort_data = (
        df.groupby(["cohort_month", "period_number"])["customer_id"]
        .nunique()
        .reset_index()
    )
    cohort_pivot = cohort_data.pivot(
        index="cohort_month", columns="period_number", values="customer_id"
    )
    cohort_size = cohort_pivot.iloc[:, 0]
    retention = cohort_pivot.divide(cohort_size, axis=0)

    fig, ax = plt.subplots(figsize=(12, 6))
    sns.heatmap(retention, annot=True, fmt=".0%", cmap="YlGnBu", ax=ax)
    ax.set_title("Cohort Retention", fontsize=14, fontweight="bold")
    fig.tight_layout()
    fig.savefig(outdir / "cohort_retention.png", dpi=150)
    plt.close(fig)
    return retention


def weekday_anova(df: pd.DataFrame) -> None:
    print("\n=== One-Way ANOVA: Order Amount by Weekday ===")
    groups = [g["amount"].values for _, g in df.groupby("weekday")]
    f, p = stats.f_oneway(*groups)
    print(f"F = {f:.3f}, p = {p:.4f}")
    if p < 0.05:
        print("→ Reject H0: weekday matters for order amount.")
    else:
        print("→ No significant difference across weekdays.")


def top_customers(df: pd.DataFrame, n: int = 10) -> pd.DataFrame:
    return (
        df.groupby("customer_id")["amount"]
        .agg(["sum", "count", "mean"])
        .sort_values("sum", ascending=False)
        .head(n)
    )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", type=Path, required=True)
    ap.add_argument("--outdir", type=Path, default=Path("figures"))
    args = ap.parse_args()
    args.outdir.mkdir(parents=True, exist_ok=True)

    df = load_and_clean(args.input)
    descriptive_stats(df)
    monthly_trend_chart(df, args.outdir)
    cohort_retention(df, args.outdir)
    weekday_anova(df)

    print("\n=== Top 10 Customers ===")
    print(top_customers(df))

    print(f"\nFigures saved to {args.outdir.resolve()}")


if __name__ == "__main__":
    main()
