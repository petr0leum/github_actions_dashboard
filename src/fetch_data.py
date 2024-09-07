import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def fetch_stock_data(ticker):
    stock = yf.Ticker(ticker)
    data = stock.history(period="2d", interval="1h")
    
    # Filter the data to keep only the last 24 hours
    last_24_hours = datetime.now() - timedelta(hours=24)
    data = data[data.index >= last_24_hours]

    data.to_csv(f'data/{ticker}_data.csv')
    print(f"Fetched data for {ticker}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"]
    for stock in stocks:
        fetch_stock_data(stock)
