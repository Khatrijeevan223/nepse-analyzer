import unittest 

from scripts.prepare_market_data import clean_stocks

class TestCleanStocks(unittest.TestCase):
    def test_valid_stock_is_cleaned_(self):
        raw_stocks = [
            {
                "symbol": " nabil ",
                "companyName": " Nabil Bank Limited ",
                "sector": " Commercial Bank ",
                "currentPrice": "520",
                "previousClose": "500",
                "updatedAt": "2026-08-05"
            }
        ]
        
        cleaned_stocks = clean_stocks(raw_stocks)
        
        self.assertEqual(len(cleaned_stocks), 1)
        self.assertEqual(
            cleaned_stocks[0]["symbol"],
            "NABIL"
        )
        self.assertEqual(
            cleaned_stocks[0]["currentPrice"],
            520.0
        )
    
    def test_missing_symbol_is_skipped(self):
        raw_stocks = [
            {
                "symbol": "",
                "companyName": "Missing Symbol Company",
                "sector": "Others",
                "currentPrice": "100",
                "previousClose": "90",
                "updatedAt": "2026-08-05"
            },
            {
                "symbol": "NTC",
                "companyName": "Nepal Doorsanchar Company Limited",
                "sector": "Others",
                "currentPrice": "873",
                "previousClose": "900",
                "updatedAt": "2026-08-05"
            }
        ]

        cleaned_stocks = clean_stocks(raw_stocks)

        self.assertEqual(len(cleaned_stocks), 1)
        self.assertEqual(
            cleaned_stocks[0]["symbol"],
            "NTC"
        )
    def test_invalid_price_is_skipped(self):
        raw_stocks = [
            {
                "symbol": "NABIL",
                "companyName": "Nabil Bank Limited",
                "sector": "Commercial Bank",
                "currentPrice": "not-a-number",
                "previousClose": "500",
                "updatedAt": "2026-08-05"
            },
            {
                "symbol": "CHCL",
                "companyName": "Chilime Hydropower Company Limited",
                "sector": "Hydropower",
                "currentPrice": "480",
                "previousClose": "480",
                "updatedAt": "2026-08-05"
            }
        ]

        cleaned_stocks = clean_stocks(raw_stocks)

        self.assertEqual(len(cleaned_stocks), 1)
        self.assertEqual(
            cleaned_stocks[0]["symbol"],
            "CHCL"
        )       
    def test_negative_price_is_skipped(self):
        raw_stocks = [
            {
                "symbol": "NABIL",
                "companyName": "Nabil Bank Limited",
                "sector": "Commercial Bank",
                "currentPrice": "-20",
                "previousClose": "500",
                "updatedAt": "2026-08-05"
            },
            {
                "symbol": "NTC",
                "companyName": "Nepal Doorsanchar Company Limited",
                "sector": "Others",
                "currentPrice": "873",
                "previousClose": "900",
                "updatedAt": "2026-08-05"
            }
        ]

        cleaned_stocks = clean_stocks(raw_stocks)

        self.assertEqual(len(cleaned_stocks), 1)

        self.assertEqual(
            cleaned_stocks[0]["symbol"],
            "NTC"
        )
        
    def test_invalid_date_is_skipped(self):
        raw_stocks = [
            {
                "symbol": "NABIL",
                "companyName": "Nabil Bank Limited",
                "sector": "Commercial Bank",
                "currentPrice": "520",
                "previousClose": "500",
                "updatedAt": "08/05/2026"
            },
            {
                "symbol": "CHCL",
                "companyName": "Chilime Hydropower Company Limited",
                "sector": "Hydropower",
                "currentPrice": "480",
                "previousClose": "480",
                "updatedAt": "2026-08-05"
            }
        ]
        cleaned_stocks = clean_stocks(raw_stocks) 
        
        self.assertEqual(len(cleaned_stocks),1)
        self.assertEqual(
            cleaned_stocks[0]["symbol"],
            "CHCL"
        )
    def test_duplicate_symbol_is_skipped(self):
        raw_stocks = [
            {
                "symbol": "NABIL",
                "companyName": "Nabil Bank Limited",
                "sector": "Commercial Bank",
                "currentPrice": "520",
                "previousClose": "500",
                "updatedAt": "2026-08-05"
            },
            {
                "symbol": "nabil",
                "companyName": "Duplicate Nabil",
                "sector": "Commercial Bank",
                "currentPrice": "525",
                "previousClose": "520",
                "updatedAt": "2026-08-05"
            }
        ]

        cleaned_stocks = clean_stocks(raw_stocks)

        self.assertEqual(len(cleaned_stocks), 1)

        self.assertEqual(
            cleaned_stocks[0]["companyName"],
            "Nabil Bank Limited"
        )

    def test_no_valid_stocks_stops_pipeline(self):
        raw_stocks = [
            {
                "symbol": "",
                "companyName": "",
                "sector": "",
                "currentPrice": "invalid",
                "previousClose": "invalid",
                "updatedAt": "invalid"
            }
        ]

        with self.assertRaises(SystemExit) as error:
            clean_stocks(raw_stocks)

        self.assertIn(
            "No valid stocks were found",
            str(error.exception)
        )
          
if __name__ == "__main__":
    unittest.main()
    