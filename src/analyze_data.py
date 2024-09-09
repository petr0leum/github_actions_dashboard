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

    # Implement a simple moving average crossover strategy with buy/sell constraints
    data['Signal'] = 0
    position = 0
    holding_start = None

    for i in range(1, len(data)):
        if data['MA_5'].iloc[i] > data['MA_30'].iloc[i] and position == 0:
            data.at[data.index[i], 'Signal'] = 1
            position = 1
            holding_start = data.index[i]
        elif data['MA_5'].iloc[i] < data['MA_30'].iloc[i] and position == 1:
            data.at[data.index[i], 'Signal'] = -1
            position = 0
            if holding_start is not None:
                data.at[data.index[i], 'Hold'] = holding_start.strftime('%Y-%m-%d %H:%M:%S')
                holding_start = None
        else:
            data.at[data.index[i], 'Signal'] = 0

    # Track performance
    data['Position'] = data['Signal'].shift()
    data['Returns'] = data['Close'].pct_change()
    data['Strategy'] = data['Returns'] * data['Position']

    # Calculate cumulative returns
    data['Cumulative Returns'] = (1 + data['Strategy']).cumprod()

    # Track deals (buy/sell actions)
    deals = []
    hold_periods = []
    for i in range(1, len(data)):
        if data['Signal'].iloc[i] == 1:
            deals.append({
                "date": data.index[i].strftime('%Y-%m-%d %H:%M:%S'),
                "action": "Buy",
                "price": data['Close'].iloc[i]
            })
        elif data['Signal'].iloc[i] == -1:
            deals.append({
                "date": data.index[i].strftime('%Y-%m-%d %H:%M:%S'),
                "action": "Sell",
                "price": data['Close'].iloc[i]
            })
            if 'Hold' in data.columns and pd.notna(data['Hold'].iloc[i]):
                hold_periods.append({
                    "start": data['Hold'].iloc[i],
                    "end": data.index[i].strftime('%Y-%m-%d %H:%M:%S')
                })


    # Calculate deal statistics
    total_trades = len(deals)
    profitable_trades = sum(1 for deal in deals if deal['action'] == 'Sell' and deal['price'] > 0)
    win_rate = profitable_trades / total_trades if total_trades > 0 else 0
    cumulative_return = data['Cumulative Returns'].iloc[-1] if not data['Cumulative Returns'].empty else 1

    data = data.replace({np.nan: None})

    # Save analysis results to JSON
    result = {
        "ticker": ticker,
        "latest_close": data['Close'].iloc[-1],
        "timestamps": data.index.strftime('%Y-%m-%d %H:%M:%S').tolist(),
        "prices": data['Close'].tolist(),
        "MA_5": data['MA_5'].tolist(),
        "MA_30": data['MA_30'].tolist(),
        "MA_60": data['MA_60'].tolist(),
        "RSI": data['RSI'].tolist(),
        "Signals": data['Signal'].tolist(),
        "CumulativeReturns": data['Cumulative Returns'].tolist(),
        "Deals": deals,
        "HoldPeriods": hold_periods,
        "TotalTrades": total_trades,
        "WinRate": win_rate,
        "CumulativeReturn": cumulative_return
    }

    with open(f'data/{ticker}_data.json', 'w') as f:
        json.dump(result, f)

    if(os.path.exists(file_name) and os.path.isfile(file_name)): 
        os.remove(file_name)
        print(f"{file_name} deleted") 

    print(f"Analysis complete for {ticker}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"] # List of stock tickers to analyze
    for stock in stocks:
        analyze_stock_data(stock)
