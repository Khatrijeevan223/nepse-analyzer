import unittest

from scripts.fetch_yonepse_data import (
    build_sector_lookup,
    transform_stock,
    transform_stocks
)


class TestBuildSectorLookup(unittest.TestCase):
    def test_maps_symbols_to_sector_names(self):
        sectors = {
            "Commercial Banks": [
                {"symbol": "NABIL"},
                {"symbol": "ADBL"}
            ],
            "Hydro Power": [
                {"symbol": "CHCL"}
            ]
        }
        sector_lookup = build_sector_lookup(sectors)
        self.assertEqual(
            sector_lookup["NABIL"],
            "Commercial Banks"
        )
        self.assertEqual(
            sector_lookup["CHCL"],
            "Hydro Power"
        )


class TestTransformStock(unittest.TestCase):
    def test_transforms_yonepse_stock_fields(self):
        raw_stock = {
            "symbol": " nabil ",
            "name": "Nabil Bank Limited",
            "ltp": 520,
            "previous_close": 500,
            "last_updated": "2026-08-26T14:30:00"
        }
        sector_lookup = {
            "NABIL": "Commercial Banks"
        }
        
        transformed_stock = transform_stock(
            raw_stock,
            sector_lookup
        )
        expected_stock = {
            "symbol": "NABIL",
            "companyName": "Nabil Bank Limited",
            "sector": "Commercial Banks",
            "currentPrice": 520,
            "previousClose": 500,
            "updatedAt": "2026-08-26"
        }

        self.assertEqual(
            transformed_stock,
            expected_stock
        )
    	

class TestTransformStocks(unittest.TestCase):
    def test_transforms_every_stock_in_list(self):
        raw_stocks = [
            {
                "symbol":"NABIL",
                "name": "Nabil Bank Limited",
                "ltp":520,
                "previous_close": 500,
                "last_updated": "2026-08-26T14:30:00"
            },
            {
                "symbol":"CHCL",
                "name":"Chilime Hydropower",
                "ltp": 480,
                "previous_close": 475,
                "last_updated": "2026-08-26T14:30:00"
            }
        ]
        
        sector_lookup = {
            "NABIL": "Commercial Banks",
            "CHCL": "Hydro Power"
        }
        
        transformed_stocks = transform_stocks(raw_stocks, sector_lookup)
        
        self.assertEqual(
            len(transformed_stocks),
            2
        )

        self.assertEqual(
            transformed_stocks[0]["symbol"],
            "NABIL"
        )

        self.assertEqual(
            transformed_stocks[1]["symbol"],
            "CHCL"
        )


class TestMissingSector(unittest.TestCase):
    def test_missing_sector_returns_empty_string(self):
        raw_stock = {
            "symbol": "NMBSBF",
            "name": "NMB Saral Bachat Fund",
            "ltp": 10.03,
            "previous_close": 10.04,
            "last_updated": "2026-08-26T14:30:00"
        }
        
        transformed_stock = transform_stock(
            raw_stock,
            {}
        )
        
        self.assertEqual(
            transformed_stock["sector"],
            ""
        )