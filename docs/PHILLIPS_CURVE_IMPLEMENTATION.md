# Phillips Curve Trade-Off Tool - Implementation Summary

## Overview
Successfully implemented a comprehensive, production-ready Phillips Curve tool for the interactive macroeconomics website. The tool demonstrates the relationship between unemployment and inflation from historical and theoretical perspectives.

## File
- **Location**: `src/tools/PhillipsCurve.tsx`
- **Lines of Code**: 429 lines
- **Size**: 17KB

## Key Features Implemented

### 1. **Dual Curve Visualization**
- **Traditional Phillips Curve (1960s)**: π = 5 - 1.5(u - 4)
  - Shows the original stable trade-off assumption
  - Purple line on the chart
- **Expectations-Augmented Phillips Curve**: π = π^e - α(u - u_n)
  - Modern understanding incorporating inflation expectations
  - Blue line on the chart
- Toggle button to switch between views

### 2. **Interactive Control Sliders**
- **Expected Inflation (π^e)**: -2% to 6% (step 0.5%)
  - Controls where the curve sits vertically
  - Demonstrates central bank credibility effects
- **Natural Unemployment Rate (u_n)**: 3% to 7% (step 0.5%)
  - Non-accelerating inflation rate of unemployment (NAIRU)
  - Shifts the curve horizontally
- **Phillips Curve Sensitivity (α)**: 0.5 to 2.0 (step 0.1)
  - Controls the slope of the curve
  - Higher α = stronger unemployment response to inflation
- **Current Unemployment Rate**: 0% to 10% (step 0.5%)
  - User-adjustable to see current position on curve

### 3. **Display Statistics**
Four real-time StatBoxes showing:
1. **Current Unemployment**: User-selected rate
2. **Implied Inflation**: Calculated from the Phillips Curve
3. **Expected Inflation**: The parameter π^e
4. **Inflation Surprise**: (Actual - Expected) inflation

### 4. **Advanced Visualization Features**

#### Multiple Curves
- Primary Phillips Curve (depends on mode)
- Secondary curve for comparison
- Reference lines showing:
  - Current position (yellow dot with border)
  - Natural unemployment rate (indigo marker)

#### Historical Data Overlay
Toggle to show actual empirical data from:
- **1960s** (Purple): Stable Phillips curve trade-off visible
- **1970s** (Red): Stagflation breaks the relationship
- **1980s** (Green): Volcker disinflation restores credibility
- **2000s** (Cyan): Great Moderation period
- **2020s** (Orange): Post-pandemic inflation challenge

#### Comparison Mode
Toggle to show low vs high inflation expectations:
- Demonstrates curve shifts with expectations changes
- Green dashed line: Low expectations scenario (π^e - 2%)
- Red dashed line: High expectations scenario (π^e + 2%)
- Shows how central bank credibility affects the entire relationship

### 5. **Educational Information Boxes**

Six comprehensive InfoBoxes explaining:

1. **Phillips Curve Trade-Off** (Info)
   - Historical context from 1960s Phillips's empirical work
   - Policy implication of the original stable trade-off

2. **The 1970s Problem: Stagflation** (Warning)
   - Why the original Phillips Curve broke down
   - Role of inflation expectations in wage-setting

3. **Modern Understanding: NAIRU** (Success)
   - Non-Accelerating Inflation Rate of Unemployment
   - How curve shifts with expectations

4. **Why Expectations Matter** (Info)
   - Central bank credibility and commitment
   - How expected inflation feeds into actual inflation

5. **No Long-Run Trade-Off** (Warning)
   - Long-run Phillips Curve is vertical
   - Cannot permanently reduce unemployment via inflation

6. **Optimal Policy** (Success)
   - Keep expectations anchored
   - Credible communication and follow-through

### 6. **Interactive Experiments Section**
Six guided experiments users can perform:

1. **Shift Expected Inflation** → See entire curve move up
2. **Move Along vs Shift** → Understand movement vs shift distinctions
3. **Natural Rate Effects** → See labor market changes impact
4. **Sensitivity Parameter** → Explore different elasticities
5. **1970s Lesson** → Oil shocks and stagflation
6. **2020s Challenge** → Modern credibility restoration

## Technical Implementation

### Architecture
- **Pattern**: Follows MultiplicerSimulator.tsx structure
- **State Management**: 7 useState hooks for parameters and toggles
- **Calculation**: Real-time curve generation (20-25 data points)
- **Visualization**: Recharts ComposedChart with multiple Line series

### Components Used
- `ToolHeader`: Title and badge
- `SliderControl`: 4 interactive parameter sliders
- `StatBox`: 4 real-time statistics display
- `Button`: 3 toggle buttons for views
- `InfoBox`: 6 educational information panels
- Recharts: `ComposedChart`, `Line`, `ReferenceDot`, `Scatter`, `Legend`, `Tooltip`

### Data Structures
- Curve data arrays with unemployment, traditional, and expectations inflation
- Historical data points with color coding by era
- Comparison data with low/high expectations variants

### Mathematical Models
```
Traditional Phillips Curve:
π = 5 - 1.5(u - 4)

Expectations-Augmented Phillips Curve:
π = π^e - α(u - u_n)

Current Inflation Surprise:
surprise = π - π^e
```

## Styling & UX
- Responsive grid layouts for controls (4 sliders in responsive grid)
- Color-coded buttons for visual feedback
- Animated chart with smooth transitions
- Information boxes color-coded by type (info/warning/success)
- Historical period legend with inline color indicators
- Accessible contrast and readable font sizes

## Educational Value
The tool teaches:
1. Historical evolution of Phillips Curve understanding
2. Importance of inflation expectations in modern macroeconomics
3. Central bank credibility and policy transmission
4. Why permanent unemployment-inflation trade-off is impossible
5. Long-run vertical Phillips Curve vs short-run trade-off
6. NAIRU concept and labor market dynamics
7. Policy implications for inflation targeting

## Integration Status
✅ Already imported and integrated in `src/App.tsx`
✅ Lazy-loaded component
✅ Accessible via 'phillips-curve' route
✅ Follows existing tool patterns and styling

## Testing Recommendations
1. Test all slider interactions and real-time updates
2. Verify historical data overlay toggles correctly
3. Check comparison mode curves shift appropriately
4. Verify calculation accuracy at edge cases (0% unemployment, 10% unemployment)
5. Test responsive behavior on mobile devices
6. Confirm chart animations are smooth

## Future Enhancements (Optional)
- Add actual historical data from FRED API
- Include policy shock scenarios (oil crisis, pandemic)
- Add Phillips Curve estimation from user's selected periods
- Include wage-price spiral visualization
- Add monetary policy transmission channels visualization
