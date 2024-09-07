import pandas as pd
import json

def analyze_stock_data(ticker):
    data = pd.read_csv(f'data/{ticker}_data.csv', index_col=0, parse_dates=True)
    latest_close = data['Close'].iloc[-1]

    # Save as JSON
    result = {
        "ticker": ticker,
        "latest_close": latest_close,
        # Add more fields as needed
    }

    with open(f'data/{ticker}_data.json', 'w') as f:
        json.dump(result, f)

    print(f"Analysis complete for {ticker}")

if __name__ == "__main__":
    analyze_stock_data("AAPL")
