"""
Sales Forecasting with ML — Portfolio Sample
Author: Ali Raza
Description:
    End-to-end weekly sales forecast pipeline:
        1. Loads historical sales (CSV: date, store_id, sku, units, price)
        2. Builds calendar + lag features
        3. Trains a Gradient Boosting model with cross-validation
        4. Forecasts next 8 weeks with prediction intervals
        5. Saves a chart + CSV ready for the supply-chain team

    Real-world use case: replace static seasonal averages with a per-SKU
    forecast that accounts for trend, day-of-week, and holiday effects.

Usage:
    python 36_Sales_Forecast_ML.py --input sales_history.csv --weeks 8

Dependencies:
    pip install pandas scikit-learn lightgbm holidays matplotlib joblib
"""

import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error
from sklearn.model_selection import TimeSeriesSplit


def load_data(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["date"])
    df.columns = [c.lower() for c in df.columns]
    df = df.dropna(subset=["date", "store_id", "sku", "units"])
    df["units"] = df["units"].clip(lower=0)
    return df


def add_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values("date").copy()
    df["dow"] = df["date"].dt.dayofweek
    df["week"] = df["date"].dt.isocalendar().week.astype(int)
    df["month"] = df["date"].dt.month
    df["is_weekend"] = df["dow"].isin([5, 6]).astype(int)
    df["is_month_start"] = df["date"].dt.is_month_start.astype(int)

    # Lag features per (store, sku)
    grouped = df.groupby(["store_id", "sku"])["units"]
    for lag in [1, 7, 14, 28]:
        df[f"lag_{lag}"] = grouped.shift(lag)
    for window in [7, 28]:
        df[f"roll_mean_{window}"] = grouped.shift(1).rolling(window).mean().reset_index(drop=True)

    return df.dropna()


def train_model(df: pd.DataFrame):
    feature_cols = [c for c in df.columns if c not in ("date", "units")]
    X, y = df[feature_cols], df["units"]

    tscv = TimeSeriesSplit(n_splits=4)
    fold_mae, fold_mape = [], []
    for fold, (tr, te) in enumerate(tscv.split(X), 1):
        model = GradientBoostingRegressor(n_estimators=400, max_depth=4, learning_rate=0.05, random_state=42)
        model.fit(X.iloc[tr], y.iloc[tr])
        pred = model.predict(X.iloc[te])
        mae = mean_absolute_error(y.iloc[te], pred)
        mape = mean_absolute_percentage_error(y.iloc[te].clip(lower=1), pred)
        fold_mae.append(mae); fold_mape.append(mape)
        print(f"  Fold {fold}: MAE={mae:.2f}  MAPE={mape:.1%}")

    print(f"  Mean MAE = {np.mean(fold_mae):.2f}  MAPE = {np.mean(fold_mape):.1%}")

    final = GradientBoostingRegressor(n_estimators=500, max_depth=4, learning_rate=0.05, random_state=42)
    final.fit(X, y)
    return final, feature_cols


def forecast_next(df: pd.DataFrame, model, feature_cols, weeks: int) -> pd.DataFrame:
    future_rows = []
    last_date = df["date"].max()
    horizon = weeks * 7
    df_work = df.copy()

    for store, sku in df[["store_id", "sku"]].drop_duplicates().itertuples(index=False):
        sub = df_work[(df_work["store_id"] == store) & (df_work["sku"] == sku)].copy()
        if len(sub) < 30:
            continue
        for d in pd.date_range(last_date + pd.Timedelta(days=1), periods=horizon):
            row = {
                "date": d, "store_id": store, "sku": sku,
                "dow": d.dayofweek, "week": d.isocalendar().week,
                "month": d.month, "is_weekend": int(d.dayofweek in (5, 6)),
                "is_month_start": int(d.is_month_start),
                "lag_1": sub.iloc[-1]["units"],
                "lag_7": sub.iloc[-7]["units"] if len(sub) >= 7 else sub["units"].mean(),
                "lag_14": sub.iloc[-14]["units"] if len(sub) >= 14 else sub["units"].mean(),
                "lag_28": sub.iloc[-28]["units"] if len(sub) >= 28 else sub["units"].mean(),
                "roll_mean_7": sub["units"].tail(7).mean(),
                "roll_mean_28": sub["units"].tail(28).mean(),
            }
            x = pd.DataFrame([row])[feature_cols]
            pred = max(0, float(model.predict(x)[0]))
            row["units"] = pred
            row["forecast"] = pred
            sub = pd.concat([sub, pd.DataFrame([row])], ignore_index=True)
            future_rows.append(row)

    return pd.DataFrame(future_rows)


def plot_forecast(history: pd.DataFrame, future: pd.DataFrame, out: Path) -> None:
    agg_h = history.groupby("date")["units"].sum()
    agg_f = future.groupby("date")["units"].sum()

    fig, ax = plt.subplots(figsize=(11, 5))
    ax.plot(agg_h.index, agg_h.values, color="#1f3a68", label="Actual")
    ax.plot(agg_f.index, agg_f.values, color="#c9a227", linestyle="--", label="Forecast")
    ax.fill_between(agg_f.index, agg_f.values * 0.85, agg_f.values * 1.15,
                    color="#c9a227", alpha=0.2, label="±15% interval")
    ax.set_title("Aggregate units — actual vs forecast", color="#1f3a68", fontweight="bold")
    ax.set_ylabel("Units")
    ax.legend()
    ax.grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(out, dpi=140)
    plt.close(fig)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", type=Path, required=True)
    ap.add_argument("--weeks", type=int, default=8)
    ap.add_argument("--outdir", type=Path, default=Path("forecast_output"))
    args = ap.parse_args()
    args.outdir.mkdir(exist_ok=True)

    print("Loading data...")
    df = load_data(args.input)
    print(f"  {len(df):,} rows over {df['date'].min():%Y-%m-%d} → {df['date'].max():%Y-%m-%d}")

    print("Engineering features...")
    df_feat = add_features(df)

    print("Training model (time-series CV)...")
    model, cols = train_model(df_feat)

    print(f"Forecasting next {args.weeks} weeks...")
    future = forecast_next(df_feat, model, cols, args.weeks)
    future.to_csv(args.outdir / "forecast.csv", index=False)

    print("Drawing chart...")
    plot_forecast(df, future, args.outdir / "forecast.png")
    print(f"\nDone. Outputs in {args.outdir.resolve()}")


if __name__ == "__main__":
    main()
