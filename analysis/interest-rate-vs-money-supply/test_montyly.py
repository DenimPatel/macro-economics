import pandas as pd
import yfinance as yf
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt

# Load the dataset
file_path = "us_money_market_monthly_2000_2025.csv"
data = pd.read_csv(file_path)

# Fetch S&P 500 historical data from Yahoo Finance
print("Fetching S&P 500 data from Yahoo Finance...")
sp500 = yf.download('^GSPC', start='2000-01-01', end='2025-12-31', progress=False)

# Handle the MultiIndex columns from yfinance
if isinstance(sp500.columns, pd.MultiIndex):
    # Get Close prices (first level is 'Close', second is '^GSPC')
    sp500_data = sp500['Close', '^GSPC']
else:
    # Fallback for different yfinance versions
    if 'Adj Close' in sp500.columns:
        sp500_data = sp500['Adj Close']
    elif 'Close' in sp500.columns:
        sp500_data = sp500['Close']
    else:
        sp500_data = sp500.iloc[:, 0]

sp500_monthly = sp500_data.resample('ME').last()
sp500_returns = sp500_monthly.pct_change() * 100
sp500_returns_df = pd.DataFrame({'SP500_Return': sp500_returns})
sp500_returns_df.index.name = 'Date'

# Convert the 'Date' column to datetime and set it as the index
data['Date'] = pd.to_datetime(data['Date'], format='%b %Y')
data.set_index('Date', inplace=True)

# Rename columns for clarity
data.rename(columns={
    'M2_Money_Supply_Trillions': 'M2',
    'Federal_Funds_Rate_Percent': 'Rate'
}, inplace=True)

# Merge S&P 500 returns with the main data
data = data.join(sp500_returns_df, how='inner')

print(f"Data loaded successfully!")
print(f"Date range: {data.index.min()} to {data.index.max()}")
print(f"Number of records: {len(data)}")
print(f"Columns: {data.columns.tolist()}")
print(f"\nSample data:")
print(data.head())
print(f"\nSummary statistics:")
print(data.describe())
print(f"\nS&P 500 Returns - Min: {data['SP500_Return'].min():.2f}%, Max: {data['SP500_Return'].max():.2f}%")
