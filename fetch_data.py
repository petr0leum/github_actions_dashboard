import yfinance as yf
import pandas as pd

def fetch_stock_data(ticker):
    stock = yf.Ticker(ticker)
    data = stock.history(period="1d", interval="1h")  # Fetch daily data
    data.to_csv(f'data/{ticker}_data.csv')
    print(f"Fetched data for {ticker}")

if __name__ == "__main__":
    fetch_stock_data("AAPL")  # Example with Apple stock
