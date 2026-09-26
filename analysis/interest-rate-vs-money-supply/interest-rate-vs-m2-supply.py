import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from datetime import datetime

# 1. DATA COMPILATION ---------------------------------------------------------
# We construct the dataset based on the specific turning points in your text.
# Dates are End-of-Month approximate.

data_anchors = [
    # Phase 1: Pre-9/11 & Dot-com (2000-2002)
    {"date": "2000-12-01", "rate": 6.51, "m2": 4.81, "sp500": 1320, "phase": "1. Pre-9/11 (2000-02)"},
    {"date": "2001-09-01", "rate": 3.00, "m2": 4.85, "sp500": 1040, "phase": "1. Pre-9/11 (2000-02)"}, # Pre-attack dip
    {"date": "2001-12-01", "rate": 1.82, "m2": 4.90, "sp500": 1150, "phase": "1. Pre-9/11 (2000-02)"},
    
    # Phase 2: Low Rate Regime (2003-2004)
    {"date": "2003-12-01", "rate": 1.13, "m2": 5.39, "sp500": 1112, "phase": "2. Low Rate Regime (2003-04)"},
    
    # Phase 3: Rate Normalization (2004-2006)
    {"date": "2004-01-01", "rate": 1.35, "m2": 5.42, "sp500": 1132, "phase": "3. Normalization (2004-06)"},
    {"date": "2006-06-01", "rate": 5.25, "m2": 6.33, "sp500": 1270, "phase": "3. Normalization (2004-06)"},
    
    # Phase 4: Financial Crisis (2007-2009)
    {"date": "2007-12-01", "rate": 4.07, "m2": 6.68, "sp500": 1468, "phase": "4. Financial Crisis (2007-09)"},
    {"date": "2008-09-01", "rate": 2.00, "m2": 7.20, "sp500": 1166, "phase": "4. Financial Crisis (2007-09)"}, # Lehman moment
    {"date": "2008-12-01", "rate": 0.16, "m2": 7.64, "sp500": 903, "phase": "4. Financial Crisis (2007-09)"},
    
    # Phase 5: ZIRP & QE (2009-2015)
    {"date": "2009-12-01", "rate": 0.18, "m2": 8.32, "sp500": 1115, "phase": "5. ZIRP & QE (2009-15)"},
    {"date": "2015-12-01", "rate": 0.20, "m2": 12.35, "sp500": 2043, "phase": "5. ZIRP & QE (2009-15)"},
    
    # Phase 6: Normalization & Taper (2015-2019)
    {"date": "2015-12-31", "rate": 0.40, "m2": 12.40, "sp500": 2043, "phase": "6. Normalization (2015-19)"},
    {"date": "2017-12-01", "rate": 1.82, "m2": 13.39, "sp500": 2674, "phase": "6. Normalization (2015-19)"},
    {"date": "2019-12-01", "rate": 1.55, "m2": 14.74, "sp500": 3231, "phase": "6. Normalization (2015-19)"},
    
    # Phase 7: COVID-19 (2020-2021)
    {"date": "2020-02-01", "rate": 1.58, "m2": 15.49, "sp500": 3386, "phase": "7. COVID-19 (2020-21)"},
    {"date": "2020-05-01", "rate": 0.05, "m2": 17.80, "sp500": 2954, "phase": "7. COVID-19 (2020-21)"}, # The Surge
    {"date": "2021-12-01", "rate": 0.08, "m2": 21.55, "sp500": 4766, "phase": "7. COVID-19 (2020-21)"},
    
    # Phase 8: Inflation & Hikes (2022-2023)
    {"date": "2022-03-01", "rate": 0.20, "m2": 21.60, "sp500": 4631, "phase": "8. Inflation Fight (2022-23)"}, # Start of hikes
    {"date": "2022-12-01", "rate": 4.10, "m2": 21.27, "sp500": 3839, "phase": "8. Inflation Fight (2022-23)"},
    {"date": "2023-06-01", "rate": 5.08, "m2": 20.78, "sp500": 4450, "phase": "8. Inflation Fight (2022-23)"},
    
    # Phase 9: Easing Cycle (2024-2025)
    {"date": "2024-06-01", "rate": 5.33, "m2": 20.90, "sp500": 5460, "phase": "9. Easing Cycle (2024-25)"}, # Peak rates
    {"date": "2024-09-01", "rate": 5.33, "m2": 21.20, "sp500": 5616, "phase": "9. Easing Cycle (2024-25)"}, # Pivot point
    {"date": "2025-06-01", "rate": 4.50, "m2": 21.80, "sp500": 5980, "phase": "9. Easing Cycle (2024-25)"},
    {"date": "2025-11-01", "rate": 3.88, "m2": 22.35, "sp500": 6137, "phase": "9. Easing Cycle (2024-25)"}
]

# Create DataFrame
df = pd.DataFrame(data_anchors)
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

# Resample to Monthly frequency to get smooth lines
# We upscale to monthly resolution and interpolate
df_monthly = df.resample('ME')[['rate', 'm2', 'sp500']].mean() # Month End frequency

# Interpolate values. 
# We use 'index' (time-based) interpolation for smooth transitions.
df_monthly['rate'] = df_monthly['rate'].interpolate(method='time')
df_monthly['m2'] = df_monthly['m2'].interpolate(method='time')
df_monthly['sp500'] = df_monthly['sp500'].interpolate(method='time')

# Map phases back to the monthly data (forward fill the phase labels)
# We need to re-merge the phase labels because resampling drops non-numeric columns
df_phases = df[['phase']].resample('ME').ffill()
df_final = df_monthly.join(df_phases)

# 2. PLOTTING ----------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 12), gridspec_kw={'height_ratios': [1, 1.5]})
plt.style.use('bmh') # Clean aesthetic style

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

# ========== TOP PANEL: S&P 500 INDEX ==========
# Plot S&P 500 with phase-colored segments
phases = df_final['phase'].dropna().unique()

for phase in phases:
    phase_subset = df_final[df_final['phase'] == phase]
    ax1.plot(phase_subset.index, phase_subset['sp500'], 
             label=phase, 
             color=phase_colors.get(phase, 'black'), 
             linewidth=2.5, 
             alpha=0.85)

ax1.set_ylabel('S&P 500 Index', fontsize=12, fontweight='bold')
ax1.set_title('US Financial Markets & Monetary Policy (2000-2025)', fontsize=16, pad=20, fontweight='bold')
ax1.grid(True, linestyle='--', alpha=0.5)

# Add recession shading to top panel (approximate US recession periods)
recession_periods = [
    ('2001-03-01', '2001-11-01'),  # 2001 recession
    ('2007-12-01', '2009-06-01'),  # 2008 Financial Crisis
    ('2020-02-01', '2020-04-01'),  # COVID-19
]

for start, end in recession_periods:
    ax1.axvspan(pd.to_datetime(start), pd.to_datetime(end), alpha=0.15, color='red')

# Add legend for phases (matching bottom panel)
handles = [mpatches.Patch(color=color, label=label) for label, color in phase_colors.items()]
ax1.legend(handles=handles, title="Monetary Phases", loc='upper left', frameon=True, fontsize='small')

# ========== CALCULATE S&P 500 METRICS FOR EACH PHASE ==========
# Define phase date ranges
phase_ranges = [
    ("1. Pre-9/11 (2000-02)", "2000-12-01", "2001-12-01"),
    ("2. Low Rate Regime (2003-04)", "2003-12-01", "2003-12-01"),
    ("3. Normalization (2004-06)", "2004-01-01", "2006-06-01"),
    ("4. Financial Crisis (2007-09)", "2007-12-01", "2008-12-01"),
    ("5. ZIRP & QE (2009-15)", "2009-12-01", "2015-12-01"),
    ("6. Normalization (2015-19)", "2015-12-31", "2019-12-01"),
    ("7. COVID-19 (2020-21)", "2020-02-01", "2021-12-01"),
    ("8. Inflation Fight (2022-23)", "2022-03-01", "2023-06-01"),
    ("9. Easing Cycle (2024-25)", "2024-06-01", "2025-11-01"),
]

# Add annotations for S&P 500 performance
for phase_name, start_date, end_date in phase_ranges:
    start_dt = pd.to_datetime(start_date)
    end_dt = pd.to_datetime(end_date)
    
    # Find data points for this phase
    phase_data = df_final[(df_final.index >= start_dt) & (df_final.index <= end_dt)]
    
    if len(phase_data) > 0:
        start_price = phase_data['sp500'].iloc[0]
        end_price = phase_data['sp500'].iloc[-1]
        
        # Calculate percentage change
        pct_change = ((end_price - start_price) / start_price) * 100
        
        # Calculate annualized return rate
        num_years = (end_dt - start_dt).days / 365.25
        if num_years > 0:
            arr = ((end_price / start_price) ** (1 / num_years) - 1) * 100
        else:
            arr = pct_change
        
        # Find middle point for annotation placement
        mid_idx = len(phase_data) // 2
        mid_date = phase_data.index[mid_idx]
        mid_price = phase_data['sp500'].iloc[mid_idx]
        
        # Format annotation text
        annotation_text = f"{pct_change:+.1f}%\n(ARR: {arr:+.1f}%)"
        
        # Color based on positive/negative performance
        text_color = '#2ca02c' if pct_change >= 0 else '#d62728'
        
        ax1.annotate(annotation_text, xy=(mid_date, mid_price), 
                    xytext=(10, 10), textcoords='offset points',
                    fontsize=8, fontweight='bold', color=text_color,
                    bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.8, edgecolor=text_color, linewidth=1.5))

# ========== BOTTOM PANEL: M2 vs INTEREST RATE ==========
# Plot each phase as a segment
phases_list = df_final['phase'].dropna().unique()

for phase in phases_list:
    subset = df_final[df_final['phase'] == phase]
    # We include the first point of the next phase to connect lines smoothly
    next_indices = np.where(df_final.index > subset.index[-1])[0]
    if len(next_indices) > 0:
        next_point = df_final.iloc[[next_indices[0]]]
        subset = pd.concat([subset, next_point])
    
    ax2.plot(subset['m2'], subset['rate'], 
             label=phase, 
             color=phase_colors.get(phase, 'black'), 
             linewidth=2.5, 
             marker='', 
             alpha=0.85)

    # Add arrow at the end of the phase to show direction
    if len(subset) > 1:
        end_x = subset['m2'].iloc[-1]
        end_y = subset['rate'].iloc[-1]
        prev_x = subset['m2'].iloc[-2]
        prev_y = subset['rate'].iloc[-2]
        
        # Only add arrows for distinct movements
        if abs(end_x - prev_x) > 0.1 or abs(end_y - prev_y) > 0.1:
            ax2.annotate('', xy=(end_x, end_y), xytext=(prev_x, prev_y),
                         arrowprops=dict(arrowstyle="->", color=phase_colors.get(phase, 'black'), lw=2))

# 3. ANNOTATIONS FOR BOTTOM PANEL -----------------------------------------------
# Add specific text markers
annotations = [
    (4.9, 6.2, "9/11 Cuts"),
    (7.6, 0.5, "2008 Crisis\n(Liquidity Flood)"),
    (12.35, 0.5, "End of QE (2015)"),
    (17.8, 0.1, "COVID-19\nLiquidity"),
    (21.55, 0.1, "Peak Stimulus\n(2021)"),
    (22.35, 3.88, "Soft Landing?\n(Nov 2025)")
]

for x, y, text in annotations:
    ax2.annotate(text, (x, y), xytext=(x, y+0.5), 
                 arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=8),
                 fontsize=9, ha='center', fontweight='bold', color='#333333')

# Formatting for bottom panel
ax2.set_xlabel('M2 Money Supply ($ Trillions)', fontsize=12, fontweight='bold')
ax2.set_ylabel('Federal Funds Rate (%)', fontsize=12, fontweight='bold')
ax2.grid(True, linestyle='--', alpha=0.5)

# Axis Limits
ax2.set_ylim(-0.5, 7.5)
ax2.set_xlim(4, 23)

# Legend for bottom panel
handles = [mpatches.Patch(color=color, label=label) for label, color in phase_colors.items()]
ax2.legend(handles=handles, title="Monetary Phases", loc='upper left', frameon=True, fontsize='small')

# Add Source Note
fig.text(0.99, 0.01, 'Source: Compiled from User Data (2000-2025)', horizontalalignment='right', fontsize=8, color='gray')

plt.tight_layout()
plt.show()