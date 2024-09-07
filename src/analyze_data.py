import json
import pandas as pd

def analyze_stock_data(ticker):
    data = pd.read_csv(f'data/{ticker}_data.csv', index_col=0, parse_dates=True)

    if data.empty:
        print(f"No data available for {ticker}. Skipping analysis.")
        return

    if 'Close' not in data.columns:
        print(f"'Close' column is missing for {ticker}. Skipping analysis.")
        return

    latest_close = data['Close'].iloc[-1]

    timestamps = data.index.strftime('%Y-%m-%d %H:%M:%S').tolist()
    prices = data['Close'].tolist()

    result = {
        "ticker": ticker,
        "latest_close": latest_close,
        "timestamps": timestamps,
        "prices": prices
    }

    with open(f'data/{ticker}_data.json', 'w') as f:
        json.dump(result, f)

    print(f"Analysis complete for {ticker}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"]
    for stock in stocks:
        analyze_stock_data(stock)
