import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


def fetch_stock_data(ticker):
    stock = yf.Ticker(ticker)
    try:
        data = stock.history(period="1mo", interval="30m")
        data = data.reset_index(drop=False)

        if data.empty:
            print(f"No data available for the last month for {ticker}.")
            return
        else:
            print(f"Fetched data for {ticker}")
        
        file_name = os.path.join(os.path.dirname(__file__), '..', 'data', f'{ticker}_data.csv')
        data.to_csv(file_name, index=False)

    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"]
    for stock in stocks:
        fetch_stock_data(stock)
