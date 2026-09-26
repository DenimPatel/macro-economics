import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from datetime import datetime
import yfinance as yf
import os
import pickle
from pandas_datareader import data as web

# Load the dataset
file_path = "us_money_market_monthly_2000_2025.csv"
data = pd.read_csv(file_path)

# Cache file for S&P 500 data
cache_file = "sp500_cache.pkl"
cache_date_file = "sp500_cache_date.txt"

def get_cpi_data():
    """Fetch CPI data from FRED (Federal Reserve Economic Data)"""
    try:
        # CPIAUCSL is the Consumer Price Index for All Urban Consumers (CPI-U)
        cpi = web.DataReader('CPIAUCSL', 'fred', start='2000-01-01', end='2025-12-31')
        cpi.index = cpi.index - pd.offsets.MonthEnd(0) + pd.offsets.MonthBegin(0)
        return cpi
    except Exception as e:
        print(f"Warning: Could not fetch CPI data from FRED: {e}")
        print("Using nominal S&P 500 values instead of inflation-adjusted.")
        return None

def adjust_to_constant_dollars(sp500_df, cpi_df, base_year_month='2000-01-01'):
    """
    Adjust S&P 500 values to constant 2000 dollars using CPI.
    
    Parameters:
    -----------
    sp500_df : DataFrame with SP500_Index column
    cpi_df : DataFrame with CPI values
    base_year_month : str, the base month for inflation adjustment (default: 2000-01-01)
    
    Returns:
    --------
    DataFrame with SP500_Index adjusted to constant 2000 dollars
    """
    if cpi_df is None:
        return sp500_df
    
    # Get the base CPI value (January 2000)
    base_date = pd.to_datetime(base_year_month)
    if base_date in cpi_df.index:
        base_cpi = cpi_df.loc[base_date, 'CPIAUCSL']
    else:
        # If exact date not available, use the first available CPI
        base_cpi = cpi_df.iloc[0, 0]
        print(f"Base CPI (Jan 2000): {base_cpi:.2f}")
    
    # Create a copy and adjust
    sp500_adjusted = sp500_df.copy()
    
    # For each date, find the corresponding CPI and adjust
    for date in sp500_adjusted.index:
        if date in cpi_df.index:
            current_cpi = cpi_df.loc[date, 'CPIAUCSL']
            # Adjust: (Current Value) * (Base CPI / Current CPI)
            sp500_adjusted.loc[date, 'SP500_Index'] = sp500_df.loc[date, 'SP500_Index'] * (base_cpi / current_cpi)
    
    return sp500_adjusted

def load_sp500_data():
    """Load S&P 500 data from cache if available and not older than 1 month, otherwise fetch from Yahoo Finance"""
    
    # Check if cache exists and is fresh (not older than 30 days)
    if os.path.exists(cache_file) and os.path.exists(cache_date_file):
        with open(cache_date_file, 'r') as f:
            cache_date_str = f.read().strip()
        
        cache_date = datetime.strptime(cache_date_str, '%Y-%m-%d')
        days_old = (datetime.now() - cache_date).days
        
        if days_old < 30:
            print(f"Loading S&P 500 data from cache (cached {days_old} days ago)...")
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
    
    # Fetch fresh data from Yahoo Finance
    print("Fetching S&P 500 data from Yahoo Finance...")
    sp500 = yf.download('^GSPC', start='2000-01-01', end='2025-12-31', progress=False)
    
    # Cache the data
    with open(cache_file, 'wb') as f:
        pickle.dump(sp500, f)
    
    with open(cache_date_file, 'w') as f:
        f.write(datetime.now().strftime('%Y-%m-%d'))
    
    print("S&P 500 data cached successfully.")
    return sp500

# Load S&P 500 data (from cache or fresh)
sp500 = load_sp500_data()

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
        sp500_data = sp500.iloc[:, 0]  # Use first column if available

sp500_monthly = sp500_data.resample('ME').last()

# Convert the month-end dates to month-start to match CSV format
sp500_monthly.index = sp500_monthly.index - pd.offsets.MonthEnd(0) + pd.offsets.MonthBegin(0)

sp500_monthly_df = pd.DataFrame({'SP500_Index': sp500_monthly})
sp500_monthly_df.index.name = 'Date'

# Fetch CPI data and adjust S&P 500 to constant 2000 dollars
print("Fetching CPI data for inflation adjustment...")
cpi_df = get_cpi_data()
sp500_monthly_df = adjust_to_constant_dollars(sp500_monthly_df, cpi_df, base_year_month='2000-01-01')

# Convert the 'Date' column to datetime and set it as the index
data['Date'] = pd.to_datetime(data['Date'], format='%b %Y')
data.set_index('Date', inplace=True)

# Rename columns for clarity
data.rename(columns={
    'M2_Money_Supply_Trillions': 'M2',
    'Federal_Funds_Rate_Percent': 'Rate'
}, inplace=True)

# Merge S&P 500 index values with the main data
data = data.join(sp500_monthly_df, how='inner')

print(f"Data loaded successfully! Records: {len(data)}")

# Define monetary phases based on historical periods
phase_ranges = [
    ("1. Pre-9/11 (2000-02)", "2000-01-01", "2001-12-01"),
    ("2. Low Rate Regime (2003-04)", "2003-01-01", "2003-12-01"),
    ("3. Normalization (2004-06)", "2004-01-01", "2006-06-01"),
    ("4. Financial Crisis (2007-09)", "2007-01-01", "2008-12-01"),
    ("5. ZIRP & QE (2009-15)", "2009-01-01", "2015-12-01"),
    ("6. Normalization (2015-19)", "2015-12-01", "2019-12-01"),
    ("7. COVID-19 (2020-21)", "2020-02-01", "2021-12-01"),
    ("8. Inflation Fight (2022-23)", "2022-03-01", "2023-12-01"),
    ("9. Easing Cycle (2024-25)", "2024-01-01", "2025-12-01"),
]

# Assign phases to data
def get_phase(date):
    for phase_name, start_date, end_date in phase_ranges:
        if pd.to_datetime(start_date) <= date <= pd.to_datetime(end_date):
            return phase_name
    return None

data['phase'] = data.index.map(get_phase)

# Define colors for phases
phase_colors = {
    "1. Pre-9/11 (2000-02)": "#1f77b4",   # Blue
    "2. Low Rate Regime (2003-04)": "#aec7e8", # Light Blue
    "3. Normalization (2004-06)": "#ff7f0e",   # Orange
    "4. Financial Crisis (2007-09)": "#d62728", # Red
    "5. ZIRP & QE (2009-15)": "#2ca02c",   # Green
    "6. Normalization (2015-19)": "#98df8a", # Light Green
    "7. COVID-19 (2020-21)": "#9467bd",    # Purple
    "8. Inflation Fight (2022-23)": "#8c564b", # Brown
    "9. Easing Cycle (2024-25)": "#e377c2"     # Pink
}

# Create figure with three subplots
fig, (ax1, ax1_sp500, ax_cpi, ax2) = plt.subplots(4, 1, figsize=(14, 18), gridspec_kw={'height_ratios': [1, 0.8, 0.8, 1.5]})
plt.style.use('bmh')

# ========== TOP PANEL: M2 MONEY SUPPLY OVER TIME ==========
phases = data['phase'].dropna().unique()

for phase in sorted(phases):
    phase_subset = data[data['phase'] == phase]
    ax1.plot(phase_subset.index, phase_subset['M2'], 
             label=phase, 
             color=phase_colors.get(phase, 'black'), 
             linewidth=2.5, 
             alpha=0.85)
    
    # Calculate and annotate % change for this phase
    if len(phase_subset) > 1:
        first_m2 = phase_subset['M2'].iloc[0]
        last_m2 = phase_subset['M2'].iloc[-1]
        pct_change = ((last_m2 - first_m2) / first_m2) * 100
        
        # Place annotation at the end of the phase
        mid_date = phase_subset.index[-1]
        mid_m2 = phase_subset['M2'].iloc[-1]
        
        ax1.annotate(f'{pct_change:.1f}%', 
                    xy=(mid_date, mid_m2), 
                    xytext=(10, 10), 
                    textcoords='offset points',
                    fontsize=8, 
                    fontweight='bold',
                    bbox=dict(boxstyle='round,pad=0.5', facecolor=phase_colors.get(phase, 'gray'), alpha=0.7, edgecolor='black'),
                    color='white')

ax1.set_ylabel('M2 Money Supply ($ Trillions)', fontsize=12, fontweight='bold')
ax1.set_title('US Financial Markets & Monetary Policy (2000-2025)', fontsize=16, pad=20, fontweight='bold')
ax1.grid(True, linestyle='--', alpha=0.5)

# ========== MIDDLE PANEL: S&P 500 INDEX VALUES ==========
# Plot S&P 500 index values with phase coloring
for phase in sorted(phases):
    phase_subset = data[data['phase'] == phase]
    ax1_sp500.plot(phase_subset.index, phase_subset['SP500_Index'], 
                   label=phase,
                   color=phase_colors.get(phase, 'black'),
                   linewidth=2.5,
                   alpha=0.85)
    
    # Calculate and annotate % change for this phase
    if len(phase_subset) > 1:
        first_sp500 = phase_subset['SP500_Index'].iloc[0]
        last_sp500 = phase_subset['SP500_Index'].iloc[-1]
        pct_change = ((last_sp500 - first_sp500) / first_sp500) * 100
        
        # Place annotation at the end of the phase
        mid_date = phase_subset.index[-1]
        mid_sp500 = phase_subset['SP500_Index'].iloc[-1]
        
        ax1_sp500.annotate(f'{pct_change:.1f}%', 
                          xy=(mid_date, mid_sp500), 
                          xytext=(10, 10), 
                          textcoords='offset points',
                          fontsize=8, 
                          fontweight='bold',
                          bbox=dict(boxstyle='round,pad=0.5', facecolor=phase_colors.get(phase, 'gray'), alpha=0.7, edgecolor='black'),
                          color='white')

ax1_sp500.set_ylabel('S&P 500 Index Value (Constant 2000 Dollars)', fontsize=12, fontweight='bold')
ax1_sp500.grid(True, linestyle='--', alpha=0.5)
ax1_sp500.set_ylim(bottom=0)

recession_periods = [
    ('2001-03-01', '2001-11-01'),  # 2001 recession
    ('2007-12-01', '2009-06-01'),  # 2008 Financial Crisis
    ('2020-02-01', '2020-04-01'),  # COVID-19
]

# ========== CPI PANEL ==========
# Plot CPI values with phase coloring
if cpi_df is not None:
    # Ensure cpi_df index is datetime
    if not isinstance(cpi_df.index, pd.DatetimeIndex):
        cpi_df.index = pd.to_datetime(cpi_df.index)
        
    data = data.join(cpi_df.rename(columns={'CPIAUCSL': 'CPI'}), how='outer')
    
    for phase in sorted(phases):
        phase_subset = data[data['phase'] == phase]
        if not phase_subset.empty:
            ax_cpi.plot(phase_subset.index, phase_subset['CPI'],
                       label=phase,
                       color=phase_colors.get(phase, 'black'),
                       linewidth=2.5,
                       alpha=0.85)

    ax_cpi.set_ylabel('CPI (AUCSL)', fontsize=12, fontweight='bold')
    ax_cpi.grid(True, linestyle='--', alpha=0.5)
    handles = [mpatches.Patch(color=color, label=label) for label, color in phase_colors.items()]
    ax_cpi.legend(handles=handles, title="Monetary Phases", loc='upper left', frameon=True, fontsize='x-small', ncol=2)
    for start, end in recession_periods:
        ax_cpi.axvspan(pd.to_datetime(start), pd.to_datetime(end), alpha=0.15, color='red')

for start, end in recession_periods:
    ax1.axvspan(pd.to_datetime(start), pd.to_datetime(end), alpha=0.15, color='red')
    ax1_sp500.axvspan(pd.to_datetime(start), pd.to_datetime(end), alpha=0.15, color='red')

# Add legend for phases
handles = [mpatches.Patch(color=color, label=label) for label, color in phase_colors.items()]
ax1.legend(handles=handles, title="Monetary Phases", loc='upper left', frameon=True, fontsize='small')
ax1_sp500.legend(handles=handles, title="Monetary Phases", loc='upper left', frameon=True, fontsize='x-small', ncol=2)

# ========== BOTTOM PANEL: M2 vs INTEREST RATE (PHASE PLOT) ==========
# Plot each phase as a segment showing the trajectory in M2-Rate space
for phase in sorted(phases):
    subset = data[data['phase'] == phase]
    
    ax2.plot(subset['M2'], subset['Rate'], 
             label=phase, 
             color=phase_colors.get(phase, 'black'), 
             linewidth=2.5, 
             marker='', 
             alpha=0.85)

    # Add arrow at the end of the phase to show direction
    if len(subset) > 1:
        end_m2 = subset['M2'].iloc[-1]
        end_rate = subset['Rate'].iloc[-1]
        prev_m2 = subset['M2'].iloc[-2]
        prev_rate = subset['Rate'].iloc[-2]
        
        # Only add arrows for distinct movements
        if abs(end_m2 - prev_m2) > 0.05 or abs(end_rate - prev_rate) > 0.05:
            ax2.annotate('', xy=(end_m2, end_rate), xytext=(prev_m2, prev_rate),
                         arrowprops=dict(arrowstyle="->", color=phase_colors.get(phase, 'black'), lw=2))

# Add key annotations by fetching coordinates from data
annotation_data = {
    "Pre-9/11\nHigh Rates": {"date": "2001-08-01", "xytext": (-80, 40)},
    "9/11 Cuts": {"date": "2001-12-01", "xytext": (10, -50)},
    "2008 Crisis\n(Liquidity Flood)": {"date": "2008-12-01", "xytext": (-100, 30)},
    "End of QE\n(2015)": {"date": "2015-10-01", "xytext": (-70, 50)},
    "COVID-19\nLiquidity Surge": {"date": "2020-06-01", "xytext": (-120, 20)},
    "Peak Stimulus\n(2021)": {"date": "2021-05-01", "xytext": (-20, 50)},
    "Inflation Fight\n(2022-23)": {"date": "2023-07-01", "xytext": (10, -60)},
    "Easing Cycle\n(2024-25)": {"date": "2024-12-01", "xytext": (-90, 20)}
}

for text, info in annotation_data.items():
    date = pd.to_datetime(info['date'])
    
    # Find the closest available date in the index (data is monthly, first of month)
    if date in data.index:
        point = data.loc[date]
        x, y = point['M2'], point['Rate']
        
        ax2.annotate(text, (x, y), xytext=info['xytext'], 
                     textcoords='offset points',
                     arrowprops=dict(arrowstyle='->', color='black', lw=1.5, connectionstyle="arc3,rad=0.3"),
                     fontsize=8, ha='center', fontweight='bold', color='#333333',
                     bbox=dict(boxstyle='round,pad=0.4', facecolor='white', alpha=0.8, edgecolor='gray'))

# Formatting for bottom panel
ax2.set_xlabel('M2 Money Supply ($ Trillions)', fontsize=12, fontweight='bold')
ax2.set_ylabel('Federal Funds Rate (%)', fontsize=12, fontweight='bold')
ax2.grid(True, linestyle='--', alpha=0.5)

# Axis Limits
ax2.set_ylim(-0.5, 7.5)
ax2.set_xlim(4.5, 23)

# Legend for bottom panel
handles = [mpatches.Patch(color=color, label=label) for label, color in phase_colors.items()]
ax2.legend(handles=handles, title="Monetary Phases", loc='upper left', frameon=True, fontsize='small')

# Add Source Note
fig.text(0.99, 0.01, 'Source: us_money_market_monthly_2000_2025.csv (Yahoo Finance S&P 500, adjusted to 2000 dollars using CPI)', horizontalalignment='right', fontsize=8, color='gray')

plt.tight_layout()
plt.savefig('monthly_chart_constant_dollar.png')
plt.show()
