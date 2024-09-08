import os
import json
import numpy as np
import pandas as pd

def analyze_stock_data(ticker):
    file_name = f'data/{ticker}_data.csv'
    data = pd.read_csv(file_name, index_col=0, parse_dates=True)

    if data.empty:
        print(f"No data available for {ticker}. Skipping analysis.")
        return

    if 'Close' not in data.columns:
        print(f"'Close' column is missing for {ticker}. Skipping analysis.")
        return

    # Calculate various moving averages
    data['MA_5'] = data['Close'].rolling(window=5).mean()
    data['MA_30'] = data['Close'].rolling(window=30).mean()
    data['MA_60'] = data['Close'].rolling(window=60).mean()
    
    # Calculate RSI (Relative Strength Index)
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    data['RSI'] = 100 - (100 / (1 + rs))

    result = {
        "ticker": ticker,
        "latest_close": data['Close'].iloc[-1],
        "timestamps": data.index.strftime('%Y-%m-%d %H:%M:%S').tolist(),
        "prices": data['Close'].tolist(),
        "MA_5": data['MA_5'].replace({np.nan: None}).tolist(),
        "MA_30": data['MA_30'].replace({np.nan: None}).tolist(),
        "MA_60": data['MA_60'].replace({np.nan: None}).tolist(),
        "RSI": data['RSI'].replace({np.nan: None}).tolist()
    }

    with open(f'data/{ticker}_data.json', 'w') as f:
        json.dump(result, f)

    if(os.path.exists(file_name) and os.path.isfile(file_name)): 
        os.remove(file_name)
        print(f"{file_name} deleted") 

    print(f"Analysis complete for {ticker}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"]
    for stock in stocks:
        analyze_stock_data(stock)
