"""
Customer Review Sentiment Analyzer — Portfolio Sample
Author: Ali Raza
Description:
    Reads CSV of customer reviews, classifies each as Positive / Neutral / Negative
    using VADER, surfaces themes via TF-IDF keyword extraction, and produces an
    HTML report with charts and the top 5 reviews per category.

    Real-world use case: monthly customer-feedback digest for support team.

Usage:
    python 35_Sentiment_Analyzer.py --input reviews.csv --out report.html

Dependencies:
    pip install pandas vaderSentiment scikit-learn matplotlib jinja2
"""

import argparse
import base64
from io import BytesIO
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from jinja2 import Template
from sklearn.feature_extraction.text import TfidfVectorizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


REPORT_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Customer Sentiment Report — {{ month }}</title>
<style>
  body{font-family:'Segoe UI',Arial;background:#f6f8fc;color:#222;margin:0;padding:30px}
  h1{color:#1f3a68}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:25px 0}
  .kpi{background:#fff;border-left:5px solid #c9a227;padding:18px;border-radius:8px}
  .kpi .num{font-size:2.2rem;color:#1f3a68;font-weight:700}
  .kpi .lbl{color:#666;text-transform:uppercase;letter-spacing:1px;font-size:.85rem}
  .reviews{background:#fff;padding:20px;border-radius:8px;margin:18px 0}
  .review{border-left:3px solid #ddd;padding:8px 14px;margin:10px 0;font-size:.92rem}
  .review.pos{border-color:#2e7d32}
  .review.neg{border-color:#c62828}
  .review.neu{border-color:#888}
  img{max-width:100%;border-radius:8px}
</style>
</head>
<body>
<h1>Customer Sentiment Report — {{ month }}</h1>
<div class="grid">
  <div class="kpi"><div class="num">{{ total }}</div><div class="lbl">Reviews analyzed</div></div>
  <div class="kpi"><div class="num">{{ pos_pct }}%</div><div class="lbl">Positive</div></div>
  <div class="kpi"><div class="num">{{ neg_pct }}%</div><div class="lbl">Negative</div></div>
</div>

<h2>Sentiment trend</h2>
<img src="data:image/png;base64,{{ trend_img }}" />

<h2>Top themes</h2>
<ul>{% for t, w in themes %}<li><strong>{{ t }}</strong> — score {{ "%.2f"|format(w) }}</li>{% endfor %}</ul>

<h2>Sample reviews</h2>
<div class="reviews">
  <h3 style="color:#2e7d32">Top positive</h3>
  {% for r in pos_reviews %}<div class="review pos">{{ r }}</div>{% endfor %}
  <h3 style="color:#c62828">Top negative</h3>
  {% for r in neg_reviews %}<div class="review neg">{{ r }}</div>{% endfor %}
</div>
</body>
</html>
"""


def classify(score: float) -> str:
    if score >= 0.05:
        return "positive"
    if score <= -0.05:
        return "negative"
    return "neutral"


def fig_to_b64(fig) -> str:
    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=140, bbox_inches="tight")
    return base64.b64encode(buf.getvalue()).decode()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", type=Path, required=True)
    ap.add_argument("--out", type=Path, default=Path("sentiment_report.html"))
    ap.add_argument("--month", default="Latest period")
    args = ap.parse_args()

    df = pd.read_csv(args.input)
    if "review" not in df.columns:
        raise SystemExit("CSV must have a 'review' column")
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

    analyzer = SentimentIntensityAnalyzer()
    df["score"] = df["review"].astype(str).apply(lambda t: analyzer.polarity_scores(t)["compound"])
    df["label"] = df["score"].apply(classify)

    counts = df["label"].value_counts()
    total = len(df)
    pos_pct = round(counts.get("positive", 0) / total * 100, 1)
    neg_pct = round(counts.get("negative", 0) / total * 100, 1)

    # Themes via TF-IDF
    vec = TfidfVectorizer(max_features=20, stop_words="english", ngram_range=(1, 2))
    X = vec.fit_transform(df["review"].astype(str))
    weights = X.sum(axis=0).A1
    themes = sorted(zip(vec.get_feature_names_out(), weights), key=lambda x: -x[1])[:10]

    # Trend chart
    fig, ax = plt.subplots(figsize=(10, 4))
    if "date" in df.columns and df["date"].notna().any():
        daily = df.groupby([df["date"].dt.date, "label"]).size().unstack(fill_value=0)
        daily.plot(ax=ax, color={"positive": "#2e7d32", "negative": "#c62828", "neutral": "#888"})
        ax.set_xlabel("Date")
    else:
        df["label"].value_counts().plot.bar(ax=ax, color="#1f3a68")
    ax.set_title("Sentiment over time" if "date" in df.columns else "Sentiment counts")
    ax.set_ylabel("Reviews")
    trend_img = fig_to_b64(fig)
    plt.close(fig)

    # Sample reviews
    pos_reviews = df.nlargest(5, "score")["review"].astype(str).tolist()
    neg_reviews = df.nsmallest(5, "score")["review"].astype(str).tolist()

    html = Template(REPORT_TEMPLATE).render(
        month=args.month, total=total, pos_pct=pos_pct, neg_pct=neg_pct,
        themes=themes, trend_img=trend_img,
        pos_reviews=pos_reviews, neg_reviews=neg_reviews,
    )
    args.out.write_text(html, encoding="utf-8")
    print(f"Report written → {args.out.resolve()}")
    print(f"Positive: {pos_pct}% ({counts.get('positive',0)})")
    print(f"Negative: {neg_pct}% ({counts.get('negative',0)})")


if __name__ == "__main__":
    main()
