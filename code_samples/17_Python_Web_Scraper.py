"""
Python Web Scraper — Portfolio Sample
Author: Ali Raza  (alirazavirtualassistant@gmail.com)
Description:
    Scrapes product data (title, price, rating) from a paginated e-commerce
    site, normalizes the price field, deduplicates by SKU, and writes a
    timestamped CSV. Polite scraping: random delays + custom User-Agent.

Usage:
    python 17_Python_Web_Scraper.py --pages 5 --out products.csv

Dependencies:
    pip install requests beautifulsoup4 pandas tqdm
"""

import argparse
import csv
import logging
import random
import re
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("scraper")

BASE_URL = "https://example-shop.test/products"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def polite_get(url: str, retries: int = 3) -> requests.Response | None:
    """Perform a GET with retries, exponential backoff and jitter."""
    for attempt in range(1, retries + 1):
        try:
            time.sleep(random.uniform(1.0, 2.5))
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            log.warning("Attempt %d failed for %s: %s", attempt, url, e)
            time.sleep(2 ** attempt + random.random())
    log.error("All retries exhausted for %s", url)
    return None


PRICE_RE = re.compile(r"[\d,]+\.\d{2}")


def parse_price(raw: str) -> float | None:
    if not raw:
        return None
    m = PRICE_RE.search(raw.replace(",", ""))
    return float(m.group()) if m else None


def parse_product_card(card) -> dict:
    return {
        "sku": card.get("data-sku", "").strip(),
        "title": (card.select_one("h2.product-title") or {}).get_text(strip=True)
                 if card.select_one("h2.product-title") else None,
        "price": parse_price(
            card.select_one("span.price").get_text() if card.select_one("span.price") else ""
        ),
        "rating": float(card.get("data-rating", 0) or 0),
        "in_stock": "in-stock" in card.get("class", []),
        "url": urljoin(BASE_URL, card.select_one("a")["href"]) if card.select_one("a") else None,
    }


def scrape_page(page: int) -> list[dict]:
    url = f"{BASE_URL}?page={page}"
    resp = polite_get(url)
    if resp is None:
        return []
    soup = BeautifulSoup(resp.text, "html.parser")
    cards = soup.select("article.product-card")
    log.info("Page %d → %d products", page, len(cards))
    return [parse_product_card(c) for c in cards]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pages", type=int, default=5)
    ap.add_argument("--out", type=Path, default=Path("products.csv"))
    args = ap.parse_args()

    rows: list[dict] = []
    for p in tqdm(range(1, args.pages + 1), desc="Scraping pages"):
        rows.extend(scrape_page(p))

    df = (
        pd.DataFrame(rows)
        .dropna(subset=["sku", "title"])
        .drop_duplicates(subset=["sku"])
        .reset_index(drop=True)
    )

    log.info("Final dataset: %d unique products", len(df))
    df["scraped_at"] = datetime.utcnow().isoformat(timespec="seconds")
    df.to_csv(args.out, index=False, quoting=csv.QUOTE_MINIMAL)
    log.info("Wrote %s", args.out)


if __name__ == "__main__":
    main()
