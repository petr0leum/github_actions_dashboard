import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def fetch_stock_data(ticker):
    stock = yf.Ticker(ticker)
    try:
        data = stock.history(period="1mo", interval="30m")

        if data.empty:
            print(f"No data available for the last month for {ticker}.")
            return

        data.to_csv(f'data/{ticker}_data.csv')
        print(f"Fetched data for {ticker}")

    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"]
    for stock in stocks:
        fetch_stock_data(stock)
