import json
import pandas as pd

def analyze_stock_data(ticker):
    data = pd.read_csv(f'data/{ticker}_data.csv', index_col=0, parse_dates=True)
    latest_close = data['Close'].iloc[-1]

    result = {
        "ticker": ticker,
        "latest_close": latest_close,
        # __Add more fields here__
    }

    with open(f'data/{ticker}_data.json', 'w') as f:
        json.dump(result, f)

    print(f"Analysis complete for {ticker}")

if __name__ == "__main__":
    analyze_stock_data("AAPL") # Example
