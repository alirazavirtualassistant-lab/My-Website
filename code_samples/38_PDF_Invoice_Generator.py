"""
PDF Invoice Generator — Portfolio Sample
Author: Ali Raza
Description:
    Generates branded PDF invoices from a CSV of orders. Each row in the CSV
    becomes one PDF, named with the invoice number. Useful for any small
    business that wants to skip manual invoice creation in Word.

Usage:
    python 38_PDF_Invoice_Generator.py --input orders.csv --outdir invoices/

Required CSV columns:
    invoice_no, date, client_name, client_address, item, qty, unit_price, tax_rate

Dependencies:
    pip install pandas reportlab
"""

import argparse
import logging
from datetime import datetime
from pathlib import Path

import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)


logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
log = logging.getLogger("invoice")

NAVY = colors.HexColor("#1f3a68")
GOLD = colors.HexColor("#c9a227")
LIGHT = colors.HexColor("#f0f4fa")
GREY = colors.HexColor("#666666")


COMPANY = {
    "name": "Acme Studio",
    "address": "12 Market Street, Lahore, Pakistan",
    "phone": "+92 345 4371509",
    "email": "billing@acme.example",
    "logo_text": "ACME",
}


def build_invoice(row: pd.Series, out_dir: Path) -> Path:
    out_path = out_dir / f"invoice_{row.invoice_no}.pdf"

    doc = SimpleDocTemplate(
        str(out_path), pagesize=letter,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        topMargin=0.5 * inch, bottomMargin=0.5 * inch,
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=styles["Heading1"], textColor=NAVY,
                        fontSize=22, leading=26)
    h2 = ParagraphStyle("h2", parent=styles["Heading2"], textColor=NAVY,
                        fontSize=12, leading=15)
    body = ParagraphStyle("b", parent=styles["BodyText"], fontSize=10, leading=13)
    small = ParagraphStyle("s", parent=styles["BodyText"], fontSize=9,
                           textColor=GREY, leading=11)

    story = []

    # Header table — logo block + invoice meta
    header_left = [
        [Paragraph(f"<b>{COMPANY['logo_text']}</b>", h1)],
        [Paragraph(COMPANY["name"], body)],
        [Paragraph(COMPANY["address"], small)],
        [Paragraph(f"{COMPANY['phone']}  ·  {COMPANY['email']}", small)],
    ]
    header_right = [
        [Paragraph("INVOICE", h1)],
        [Paragraph(f"Invoice #: <b>{row.invoice_no}</b>", body)],
        [Paragraph(f"Date: {row.date}", body)],
    ]
    header_table = Table(
        [[Table(header_left, colWidths=[3.5 * inch]),
          Table(header_right, colWidths=[3.5 * inch])]],
        colWidths=[3.5 * inch, 3.5 * inch],
    )
    story.append(header_table)
    story.append(Spacer(1, 0.2 * inch))
    story.append(Table([[""]], colWidths=[7 * inch],
                 style=[("LINEBELOW", (0, 0), (-1, -1), 2, GOLD)]))

    # Bill To
    story.append(Spacer(1, 0.18 * inch))
    story.append(Paragraph("BILL TO", h2))
    story.append(Paragraph(f"<b>{row.client_name}</b>", body))
    story.append(Paragraph(row.client_address, body))

    # Line items table
    story.append(Spacer(1, 0.25 * inch))
    items = [
        ["Description", "Qty", "Unit Price", "Total"],
        [row.item, str(row.qty), f"${row.unit_price:.2f}", f"${row.qty * row.unit_price:.2f}"],
    ]
    items_table = Table(items, colWidths=[3.4 * inch, 0.8 * inch, 1.2 * inch, 1.2 * inch])
    items_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cccccc")),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(items_table)

    # Totals
    subtotal = row.qty * row.unit_price
    tax = subtotal * row.tax_rate
    total = subtotal + tax
    totals = [
        ["", "Subtotal", f"${subtotal:.2f}"],
        ["", f"Tax ({row.tax_rate * 100:.0f}%)", f"${tax:.2f}"],
        ["", "Total Due", f"${total:.2f}"],
    ]
    totals_table = Table(totals, colWidths=[4.6 * inch, 1.2 * inch, 1.2 * inch])
    totals_table.setStyle(TableStyle([
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("FONTNAME", (1, -1), (-1, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (1, -1), (-1, -1), NAVY),
        ("FONTSIZE", (1, -1), (-1, -1), 13),
        ("LINEABOVE", (1, -1), (-1, -1), 1.5, NAVY),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(totals_table)

    # Footer
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("Thank you for your business.", body))
    story.append(Paragraph(
        "Payment due within 14 days. Bank wire details on request.",
        small,
    ))

    doc.build(story)
    return out_path


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", type=Path, required=True)
    ap.add_argument("--outdir", type=Path, default=Path("invoices"))
    args = ap.parse_args()

    df = pd.read_csv(args.input)
    args.outdir.mkdir(parents=True, exist_ok=True)

    log.info("Generating %d invoices...", len(df))
    for _, row in df.iterrows():
        path = build_invoice(row, args.outdir)
        log.info("  → %s", path.name)
    log.info("Done. PDFs in %s", args.outdir.resolve())


if __name__ == "__main__":
    main()
