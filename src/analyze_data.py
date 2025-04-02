import os
import json
import numpy as np
import pandas as pd


def count_profitable_trades(arr):
    i, j = 0, 1
    profitable_trades = 0
    budjet = 10_000 # dollars
    arr = arr[:-1] if len(arr) % 2 != 0 else arr

    while (i < len(arr)) and (j < len(arr)):
        amount_shares = budjet // float(arr[i]['price'])
        free_budjet = budjet % (float(arr[i]['price']) * amount_shares)
        price_delta = float(arr[j]['price']) - float(arr[i]['price'])
        if price_delta >= 0:
            profitable_trades += 1
        new_budjet = float(arr[j]['price']) * amount_shares + free_budjet
        i += 2
        j += 2
        budjet = new_budjet

    result = round(new_budjet - 10_000, 2)
    cumulative_return = round(result * 100 / 10_000, 2)

    return budjet, profitable_trades, result, cumulative_return

def analyze_stock_data(ticker):
    file_name = f'../data/{ticker}_data.csv'
    data = pd.read_csv(file_name, parse_dates=False)
    data['Datetime'] = pd.to_datetime(data['Datetime'], utc=True)
    # data['Datetime'] = data['Datetime'].dt.tz_convert(None)

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
        if (data['MA_5'].iloc[i] >= data['MA_30'].iloc[i]) and position == 0:
            position = 1
            data.at[data.index[i], 'Signal'] = position
            holding_start = data.at[data.index[i], 'Datetime']
        elif (data['MA_5'].iloc[i] < data['MA_30'].iloc[i]) and position == 1:
            position = 0
            data.at[data.index[i], 'Signal'] = -1
            if holding_start is not None:
                data.at[data.index[i], 'Hold'] = holding_start.strftime('%Y-%m-%d %H:%M:%S')
                holding_start = None
        elif (data['MA_5'].iloc[i] >= data['MA_30'].iloc[i]) and position == 1:
            data.at[data.index[i], 'Signal'] = 2
        elif (data['MA_5'].iloc[i] < data['MA_30'].iloc[i]) and position == 0:
            pass

    # Track performance
    total_trades = 0
    deals = []
    hold_periods = []

    for i in range(1, len(data)):
        if data['Signal'].iloc[i] == 1:
            deals.append({
                "date": data['Datetime'].iloc[i].strftime('%Y-%m-%d %H:%M:%S'),
                "action": "Buy",
                "price": data['Open'].iloc[i]
            })
        elif data['Signal'].iloc[i] == -1:
            deals.append({
                "date": data['Datetime'].iloc[i].strftime('%Y-%m-%d %H:%M:%S'),
                "action": "Sell",
                "price": data['Close'].iloc[i]
            })
            total_trades += 1
            if 'Hold' in data.columns and pd.notna(data['Hold'].iloc[i]):
                hold_periods.append({
                    "start": data['Hold'].iloc[i],
                    "end": data['Datetime'].iloc[i].strftime('%Y-%m-%d %H:%M:%S')
                })

    # Calculate deal statistics
    profit, profitable_trades, outcome, cumulative_return = count_profitable_trades(deals)
    win_rate = round(profitable_trades / total_trades, 2)
    data = data.replace({np.nan: None})

    # Save analysis results to JSON
    result = {
        "ticker": ticker,
        "latest_close": round(data['Close'].iloc[-1], 2),
        "timestamps": data['Datetime'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist(),
        "prices": data['Close'].tolist(),
        "MA_5": data['MA_5'].tolist(),
        "MA_30": data['MA_30'].tolist(),
        "MA_60": data['MA_60'].tolist(),
        "RSI": data['RSI'].tolist(),
        "Signals": data['Signal'].tolist(),
        "Profit": profit,
        "Deals": deals,
        "HoldPeriods": hold_periods,
        "TotalTrades": total_trades,
        "WinRate": win_rate,
        "CumulativeReturn": cumulative_return,
        "Outcome": outcome
    }

    with open(f'../data/{ticker}_data.json', 'w') as f:
        json.dump(result, f)

    if(os.path.exists(file_name) and os.path.isfile(file_name)): 
        os.remove(file_name)
        print(f"{file_name} deleted") 

    print(f"Analysis complete for {ticker}")

if __name__ == "__main__":
    stocks = ["AAPL", "GOOGL", "TSLA"] # List of stock tickers to analyze
    for stock in stocks:
        analyze_stock_data(stock)
