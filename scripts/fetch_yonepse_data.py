import requests
from scripts.prepare_market_data import (
    OUTPUT_FILE,
    clean_stocks,
    write_json_file
)


YONEPSE_URL = "https://shubhamnpk.github.io/yonepse/data/nepse_data.json"

SECTOR_URL = "https://shubhamnpk.github.io/yonepse/data/other/sector_codes.json"

def fetch_market_data():
    response = requests.get(
        YONEPSE_URL,
        timeout=10
    )
    
    response.raise_for_status()
    stocks = response.json()
    return stocks

def fetch_sector_data():
    response = requests.get(
        SECTOR_URL,
        timeout=10
    )
    response.raise_for_status()
    sectors = response.json()
    return sectors

def build_sector_lookup(sectors):
    sector_lookup = {}
    
    for sector_name, securities in sectors.items():
        for security in securities:
            symbol = security["symbol"]
            sector_lookup[symbol] = sector_name

    return sector_lookup

def transform_stock(stock, sector_lookup):
    symbol = stock.get("symbol", "").strip().upper()
    updated_at = stock.get("last_updated", "")
    
    return {
        "symbol": symbol,
        "companyName": stock.get("name", ""),
        "sector": sector_lookup.get(symbol, ""),
        "currentPrice": stock.get("ltp"),
        "previousClose": stock.get("previous_close"),
        "updatedAt": updated_at[:10]
    }  

def transform_stocks(stocks, sector_lookup):
    
    transformed_stocks = []
    for stock in stocks:
        transformed_stock = transform_stock(stock, sector_lookup)
        transformed_stocks.append(transformed_stock) 
    
    return transformed_stocks

def main():
    stocks = fetch_market_data()
    sectors = fetch_sector_data()
    sector_lookup = build_sector_lookup(sectors)
    
    print(f"Fetched {len(stocks)} stock records.")
    print(f"Fetched {len(sectors)} sectors.")
    transformed_stocks = transform_stocks(stocks, sector_lookup)
    cleaned_stocks = clean_stocks(transformed_stocks)
    write_json_file(
        cleaned_stocks,
        OUTPUT_FILE
    )
    print(
    f"Transformed {len(transformed_stocks)} "
    "stock records."
	)
    print(
    f"Validated {len(cleaned_stocks)} "
    "company stock records."
    )
    
if __name__ == "__main__":
    try:
        main()
    
    except requests.exceptions.RequestException as error:
        print(
            "Market data update failed: ",
            error
        )
        raise SystemExit(1)
        



 