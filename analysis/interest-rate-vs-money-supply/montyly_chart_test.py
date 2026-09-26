import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from datetime import datetime
import yfinance as yf

# Set non-interactive backend before importing pyplot
import matplotlib
matplotlib.use('Agg')

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
sp500_returns = sp500_monthly.pct_change() * 100  # Monthly returns in percentage

# Convert the month-end dates to month-start to match CSV format
sp500_returns.index = sp500_returns.index - pd.offsets.MonthEnd(0) + pd.offsets.MonthBegin(0)

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

print(f"Data merged successfully! Records: {len(data)}")
print(f"Date range: {data.index.min()} to {data.index.max()}")
print("Generating chart...")

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
fig, (ax1, ax1_sp500, ax2) = plt.subplots(3, 1, figsize=(14, 15), gridspec_kw={'height_ratios': [1, 0.8, 1.5]})
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

ax1.set_ylabel('M2 Money Supply ($ Trillions)', fontsize=12, fontweight='bold')
ax1.set_title('US Financial Markets & Monetary Policy (2000-2025)', fontsize=16, pad=20, fontweight='bold')
ax1.grid(True, linestyle='--', alpha=0.5)

# ========== MIDDLE PANEL: S&P 500 MONTHLY RETURNS ==========
# Plot S&P 500 monthly returns with phase coloring
for phase in sorted(phases):
    phase_subset = data[data['phase'] == phase]
    ax1_sp500.bar(phase_subset.index, phase_subset['SP500_Return'], 
                  label=phase,
                  color=phase_colors.get(phase, 'black'),
                  alpha=0.7,
                  width=20)

ax1_sp500.axhline(y=0, color='black', linestyle='-', linewidth=0.8)
ax1_sp500.set_ylabel('S&P 500 Monthly Return (%)', fontsize=12, fontweight='bold')
ax1_sp500.grid(True, linestyle='--', alpha=0.5, axis='y')
ax1_sp500.set_ylim(bottom=-20, top=20)

# Add recession shading to both top panels
recession_periods = [
    ('2001-03-01', '2001-11-01'),  # 2001 recession
    ('2007-12-01', '2009-06-01'),  # 2008 Financial Crisis
    ('2020-02-01', '2020-04-01'),  # COVID-19
]

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

# Add key annotations
annotations = [
    (4.8, 6.5, "Pre-9/11\nHigh Rates"),
    (4.9, 1.8, "9/11 Cuts"),
    (7.2, 0.2, "2008 Crisis\n(Liquidity Flood)"),
    (12.3, 0.2, "End of QE\n(2015)"),
    (17.8, 0.05, "COVID-19\nLiquidity Surge"),
    (21.5, 0.08, "Peak Stimulus\n(2021)"),
    (21.3, 4.1, "Inflation Fight\n(2022-23)"),
    (22.0, 3.5, "Easing Cycle\n(2024-25)")
]

for x, y, text in annotations:
    ax2.annotate(text, (x, y), xytext=(x, y+0.4), 
                 arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=8),
                 fontsize=8, ha='center', fontweight='bold', color='#333333')

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
fig.text(0.99, 0.01, 'Source: us_money_market_monthly_2000_2025.csv (Yahoo Finance S&P 500)', horizontalalignment='right', fontsize=8, color='gray')

plt.tight_layout()
output_file = 'montyly_chart.png'
plt.savefig(output_file, dpi=300, bbox_inches='tight')
print(f"Chart saved to {output_file}")
plt.close()
