"""Export analysis data into the web app.

Reads the canonical datasets in ``data/`` and writes normalized copies to
``web/public/data/`` so the site can fetch them at runtime. Charts are written
to ``assets/charts/`` when matplotlib is available; the export still succeeds
without it.

Run from the repository root:

    npm run data:export
    # or: python3 analysis/export.py
"""

from __future__ import annotations

import csv
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
WEB_DATA_DIR = ROOT / "web" / "public" / "data"
CHARTS_DIR = ROOT / "assets" / "charts"

MONEY_CSV = "us_money_market_monthly_2000_2025.csv"


def copy_dataset(name: str) -> Path:
    source = DATA_DIR / name
    if not source.exists():
        raise FileNotFoundError(f"Missing dataset: {source}")
    WEB_DATA_DIR.mkdir(parents=True, exist_ok=True)
    target = WEB_DATA_DIR / name
    shutil.copyfile(source, target)
    return target


def read_money_series(path: Path) -> list[dict[str, str]]:
    with path.open(newline="") as handle:
        return [row for row in csv.DictReader(handle)]


def write_money_chart(rows: list[dict[str, str]], target: Path) -> bool:
    """Write a static M2 / fed funds chart. Returns False if matplotlib is absent."""
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except Exception:
        return False

    labels = [row.get("Date", "") for row in rows]
    m2 = [float(row["M2_Money_Supply_Trillions"]) for row in rows]
    rate = [float(row["Federal_Funds_Rate_Percent"]) for row in rows]

    fig, ax = plt.subplots(figsize=(11, 5))
    ax.plot(labels, m2, color="#2563eb", linewidth=2, label="M2 money supply ($T)")
    ax.set_ylabel("M2 money supply ($T)", color="#2563eb")
    ax.tick_params(axis="x", labelrotation=45, labelsize=7)
    ax.set_xticks(range(0, len(labels), 12))
    ax.set_xticklabels(labels[::12])

    ax2 = ax.twinx()
    ax2.plot(labels, rate, color="#dc2626", linewidth=2, label="Federal funds rate (%)")
    ax2.set_ylabel("Federal funds rate (%)", color="#dc2626")

    ax.set_title("US M2 money supply and the federal funds rate, 2000-2025")
    fig.tight_layout()
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)
    fig.savefig(target, dpi=150)
    plt.close(fig)
    return True


def main() -> None:
    target = copy_dataset(MONEY_CSV)
    rows = read_money_series(target)
    print(f"Exported {len(rows)} rows to {target.relative_to(ROOT)}")

    chart = CHARTS_DIR / "money-supply-vs-fed-funds.png"
    if write_money_chart(rows, chart):
        print(f"Wrote chart {chart.relative_to(ROOT)}")
    else:
        print("matplotlib not available: skipped chart (CSV export still complete)")


if __name__ == "__main__":
    main()
