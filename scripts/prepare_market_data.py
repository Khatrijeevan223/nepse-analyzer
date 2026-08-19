import csv
import json
from datetime import date
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "sample-market.csv"
)

OUTPUT_FILE = (
    PROJECT_ROOT
    / "data"
    / "generated-stocks.json"
)


def read_csv_file(input_file):
    with input_file.open(
        mode="r",
        encoding="utf-8",
        newline=""
    ) as csv_file:
        reader = csv.DictReader(csv_file)
        return list(reader)


def clean_stocks(raw_stocks):
    cleaned_stocks = []
    seen_symbols = set()

    for row_number, stock in enumerate(
        raw_stocks,
        start=2
    ):
        symbol = stock.get(
            "symbol",
            ""
        ).strip()

        company_name = stock.get(
            "companyName",
            ""
        ).strip()

        sector = stock.get(
            "sector",
            ""
        ).strip()

        if not symbol or not company_name or not sector:
            print(
                f"Skipping row {row_number}: "
                "missing required text"
            )
            continue

        stock["symbol"] = symbol.upper()
        stock["companyName"] = company_name
        stock["sector"] = sector

        try:
            stock["currentPrice"] = float(
                stock["currentPrice"]
            )

            stock["previousClose"] = float(
                stock["previousClose"]
            )
        except (ValueError, TypeError, KeyError):
            print(
                f"Skipping row {row_number}: "
                "invalid price"
            )
            continue

        if (
            stock["currentPrice"] < 0
            or stock["previousClose"] < 0
        ):
            print(
                f"Skipping row {row_number}: "
                "price cannot be negative"
            )
            continue

        updated_at = stock.get(
            "updatedAt",
            ""
        ).strip()

        try:
            date.fromisoformat(updated_at)
        except (ValueError, TypeError):
            print(
                f"Skipping row {row_number}: "
                "invalid update date"
            )
            continue

        stock["updatedAt"] = updated_at

        if stock["symbol"] in seen_symbols:
            print(
                f"Skipping row {row_number}: "
                f"duplicate symbol {stock['symbol']}"
            )
            continue

        seen_symbols.add(stock["symbol"])
        cleaned_stocks.append(stock)

    if not cleaned_stocks:
        raise SystemExit(
            "No valid stocks were found. "
            "The JSON file was not updated."
        )

    return cleaned_stocks


def write_json_file(stocks, output_file):
    with output_file.open(
        mode="w",
        encoding="utf-8"
    ) as json_file:
        json.dump(
            stocks,
            json_file,
            indent=2,
            ensure_ascii=False
        )

def main():
	raw_stocks = read_csv_file(INPUT_FILE)
	stocks = clean_stocks(raw_stocks)
	write_json_file(stocks, OUTPUT_FILE)
	
	print(
	    f"Created {OUTPUT_FILE} "
	    f"with {len(stocks)} stocks."
	)

if __name__ == "__main__":
    main()