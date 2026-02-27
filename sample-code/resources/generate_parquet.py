#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "polars"
# ]
# ///
#
# """
# This script generates a parquet file containing product data.
# The parquet file is saved to 'sample-code/src/product_data.parquet'.
# The generated files has cells with '[PREDICT]'-placeholders for prediction with SAP RPT.
# """

from pathlib import Path

import polars as pl

# Define the data with proper string keys
data = [
    {
        "PRODUCT": "Laptop",
        "PRICE": 999.99,
        "PRODUCTION_DATE": "2025-01-15",
        "__row_idx__": "35",
        "SALESGROUP": "[PREDICT]",
    },
    {
        "PRODUCT": "Office chair",
        "PRICE": 142.99,
        "PRODUCTION_DATE": "2025-07-13",
        "__row_idx__": "571",
        "SALESGROUP": "[PREDICT]",
    },
    {
        "PRODUCT": "Desktop Computer",
        "PRICE": 750.5,
        "PRODUCTION_DATE": "2024-12-02",
        "__row_idx__": "42",
        "SALESGROUP": "Enterprise Solutions",
    },
    {
        "PRODUCT": "Macbook",
        "PRICE": 750.5,
        "PRODUCTION_DATE": "2026-01-31",
        "__row_idx__": "99",
        "SALESGROUP": "Enterprise Solutions",
    },
    {
        "PRODUCT": "Chromebook",
        "PRICE": 750.5,
        "PRODUCTION_DATE": "2024-12-05",
        "__row_idx__": "689",
        "SALESGROUP": "Enterprise Solutions",
    },
]

# Create Polars DataFrame
df = pl.DataFrame(data)

# Define output path
output_path = Path(__file__).parent.parent / "src" / "product_data.parquet"

# Export to parquet
df.write_parquet(output_path)

print(f"Successfully exported {len(df)} rows to {output_path}")
