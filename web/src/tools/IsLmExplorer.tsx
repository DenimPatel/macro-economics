import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartLine } from '../components/ChartPrimitives'
import {
  ToolHeader,
  ToolNote,
  SliderControl,
  StatBox,
  InfoBox,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

/** IS and LM keep a fixed economic identity across every chart in this tool. */
const IS_STROKE = chartColor(0)
const LM_STROKE = chartColor(3)

/** Layout shared by the "controls beside chart" blocks. */
const SPLIT = 'grid gap-8 lg:grid-cols-2'

const NOTE_BOX = 'mt-6 rounded-card border border-border bg-surface p-4'

export default function IsLmExplorer() {
  // Scenario A parameters
  const [G_a, setG_a] = useState(100)
  const [T_a, setT_a] = useState(50)
  const [M_a, setM_a] = useState(150)
  const [P_a, setP_a] = useState(1.0)
  const [I0_a, setI0_a] = useState(50)

  // Scenario B parameters
  const [G_b, setG_b] = useState(120)
  const [T_b, setT_b] = useState(50)
  const [M_b, setM_b] = useState(150)
  const [P_b, setP_b] = useState(1.0)
  const [I0_b, setI0_b] = useState(50)

  // Model parameters
  const C0 = 40
  const alpha = 0.15 // Investment sensitivity to output (reduced to avoid singularity)
  const [beta, setBeta] = useState(10) // Investment sensitivity to interest rate (user-adjustable)
  const [gamma, setGamma] = useState(5) // Money demand sensitivity to interest rate (user-adjustable)
  const mpc = 0.6
  const [comparisonMode, setComparisonMode] = useState(false)

  // Calculate IS curve: Y = C(Y-T) + I(Y,r) + G
  // => Y = C0 + mpc*(Y-T) + (I0 + alpha*Y - beta*r) + G
  // => Y*(1 - mpc - alpha) = C0 - mpc*T + I0 - beta*r + G
  // => Y = [C0 - mpc*T + I0 + G - beta*r] / (1 - mpc - alpha)
  const calculateISCurve = (G: number, T: number, I0: number) => {
    const data = []
    // Generate points from r=0 to r=25 with finer granularity
    for (let r = 0; r <= 25; r += 0.25) {
      const denominator = 1 - mpc - alpha
      const numerator = C0 - mpc * T + I0 + G - beta * r
      const Y = numerator / denominator
      // Include all points in range, don't filter
      data.push({ r: parseFloat(r.toFixed(2)), Y: parseFloat(Y.toFixed(2)), curve: 'IS' })
    }
    return data
  }

  // Calculate LM curve: M/P = L(Y,r)
  // => M/P = Y - gamma*r
  // => Y = M/P + gamma*r
  const calculateLMCurve = (M: number, P: number) => {
    const data = []
    for (let r = 0; r <= 20; r += 0.5) {
      const Y = M / P + gamma * r
      if (Y >= 0 && Y <= 300) {
        data.push({ r: parseFloat(r.toFixed(1)), Y: parseFloat(Y.toFixed(2)), curve: 'LM' })
      }
    }
    return data
  }

  // Find equilibrium intersection
  const findEquilibrium = (G: number, T: number, M: number, P: number, I0: number) => {
    // Solve system:
    // IS: Y = (C0 - mpc*T + I0 + G - beta*r) / (1 - mpc - alpha)
    // LM: Y = M/P + gamma*r
    // Setting equal and solving for r:
    const a = beta + gamma * (1 - mpc - alpha)
    const b = C0 - mpc * T + I0 + G - (1 - mpc - alpha) * (M / P)
    const r_eq = b / a
    const Y_eq = M / P + gamma * r_eq

    // Calculate investment and money demand at equilibrium
    const I_eq = I0 + alpha * Y_eq - beta * r_eq
    const L_eq = Y_eq - gamma * r_eq

    return {
      Y: Math.max(0, Y_eq),
      r: Math.max(0, r_eq),
      I: Math.max(0, I_eq),
      L: Math.max(0, L_eq),
    }
  }

  // Generate data for current scenario
  const isCurveA = calculateISCurve(G_a, T_a, I0_a)
  const lmCurveA = calculateLMCurve(M_a, P_a)
  const equilibrium_a = findEquilibrium(G_a, T_a, M_a, P_a, I0_a)

  const isCurveB = calculateISCurve(G_b, T_b, I0_b)
  const lmCurveB = calculateLMCurve(M_b, P_b)
  const equilibrium_b = findEquilibrium(G_b, T_b, M_b, P_b, I0_b)

  // Merge curves for chart
  const chartData_a = [...isCurveA, ...lmCurveA]
  const chartData_comparison = [
    ...isCurveA.map((d) => ({ ...d, scenario: 'A', curve: 'IS-A' })),
    ...lmCurveA.map((d) => ({ ...d, scenario: 'A', curve: 'LM-A' })),
    ...isCurveB.map((d) => ({ ...d, scenario: 'B', curve: 'IS-B' })),
    ...lmCurveB.map((d) => ({ ...d, scenario: 'B', curve: 'LM-B' })),
  ]

  const outputChange = equilibrium_b.Y - equilibrium_a.Y
  const rateChange = equilibrium_b.r - equilibrium_a.r

  return (
    <div className="tool-card">
      <ToolHeader
        title="IS-LM Equilibrium Explorer"
        description="Adjust fiscal and monetary policy parameters. Watch how IS and LM curves shift and equilibrium output and interest rates adjust. Explore crowding out, the multiplier effect at different interest rates, and policy effectiveness."
        badge="beginner"
      />

      {/* Lesson 1 */}
      <ToolNote
        label="Lesson 1"
        variant="lesson"
        title="The IS Curve (Investment = Saving)"
      >
        <p>
          <strong>What is the IS Curve?</strong> The IS curve shows the relationship between
          output (Y) and interest rate (r) in the goods market when investment equals saving.
          It is derived from the equilibrium condition Y = C + I + G.
        </p>
        <p>
          <strong>Key Formula:</strong> Y = C(Y-T) + I(r) + G
        </p>
        <ul>
          <li>
            <strong>C = C₀ + c₁(Y - T)</strong>: Consumption increases with income
          </li>
          <li>
            <strong>I = I₀ - β·r</strong>: Investment <em>decreases</em> with interest rate (higher
            rates mean fewer projects are profitable)
          </li>
          <li>
            <strong>G:</strong> Government spending (exogenous)
          </li>
        </ul>
        <p>
          <strong>Why does IS slope downward?</strong> When interest rates rise, investment falls,
          aggregate demand falls, and output must fall to restore equilibrium. Hence, higher r is
          paired with lower Y.
        </p>
        <p>
          <strong>What shifts the IS curve?</strong> Changes in fiscal policy (G or T) shift the IS
          curve:
        </p>
        <ul>
          <li>
            <strong>G up (expansionary)</strong>: IS shifts RIGHT (output up at each interest rate)
          </li>
          <li>
            <strong>T up (contractionary)</strong>: IS shifts LEFT (output down at each interest
            rate)
          </li>
          <li>
            <strong>I₀ down (worse investment climate)</strong>: IS shifts LEFT
          </li>
        </ul>
      </ToolNote>

      {/* Interactive: IS */}
      <ToolNote label="Try it" variant="try" title="Adjust IS Curve Parameters">
        <div className={SPLIT}>
          <div>
            <h4 className="mb-4 text-label-sm font-semibold text-fg">IS Curve Parameters</h4>
            <div className="control-panel">
              <SliderControl label="Government Spending (G)" value={G_a} min={50} max={150} onChange={setG_a} />
              <SliderControl label="Taxes (T)" value={T_a} min={20} max={80} onChange={setT_a} />
              <SliderControl
                label="Base Investment (I₀)"
                value={I0_a}
                min={20}
                max={100}
                onChange={setI0_a}
              />
              <SliderControl
                label="Interest Rate Sensitivity (β)"
                value={beta}
                min={2}
                max={20}
                onChange={setBeta}
              />
            </div>

            <div className={NOTE_BOX}>
              <p>
                <strong>What to observe:</strong> As you increase G, the IS curve shifts RIGHT. As
                you increase T, it shifts LEFT. Changes in I₀ shift the curve in the same direction
                as G changes.
              </p>
              <p className="mt-2">
                <strong>Curve Slope:</strong> The parameter β (interest rate sensitivity) controls
                the IS curve's slope. Higher β means a steeper slope (investment less sensitive to
                rates). Lower β means a flatter slope (investment more sensitive to rates).
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-label-sm font-semibold text-fg">IS Curve</h4>
            {isCurveA.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={isCurveA} margin={chartTheme.margin}>
                  <CartesianGrid {...chartTheme.grid} />
                  <XAxis
                    dataKey="Y"
                    type="number"
                    domain={[0, 500]}
                    ticks={[0, 100, 200, 300, 400, 500]}
                    allowDataOverflow
                    label={{
                      value: 'Output (Y)',
                      position: 'insideBottomRight',
                      offset: -5,
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.axis}
                  />
                  <YAxis
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    allowDataOverflow
                    label={{
                      value: 'Interest Rate (r)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.axis}
                  />
                  <Tooltip
                    {...chartTheme.tooltip}
                    cursor={chartTheme.cursor}
                    formatter={(value: number) => value.toFixed(2)}
                    labelFormatter={(label: number) => `Y = ${label.toFixed(1)}`}
                  />
                  <ChartLine
                    type="monotone"
                    dataKey="r"
                    stroke={IS_STROKE}
                    dot={false}
                    strokeWidth={2}
                    name="IS Curve"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-card border border-border bg-surface-2">
                <p className="text-sm text-fg-subtle">No data to display</p>
              </div>
            )}
          </div>
        </div>
      </ToolNote>

      {/* Lesson 2 */}
      <ToolNote
        label="Lesson 2"
        variant="lesson"
        title="The LM Curve (Liquidity Money)"
      >
        <p>
          <strong>What is the LM Curve?</strong> The LM curve shows the relationship between
          output (Y) and interest rate (r) in the money market when money supply equals money
          demand. It is derived from the equilibrium condition M/P = L.
        </p>
        <p>
          <strong>Key Formula:</strong> M/P = L(Y, r)
        </p>
        <ul>
          <li>
            <strong>M/P:</strong> Real money supply (fixed by central bank)
          </li>
          <li>
            <strong>L(Y):</strong> Money demand <em>increases</em> with output (higher income means
            more spending and more money needed)
          </li>
          <li>
            <strong>L(r):</strong> Money demand <em>decreases</em> with interest rate (higher rates
            mean a higher cost of holding money, so hold less)
          </li>
        </ul>
        <p>
          <strong>Why does LM slope upward?</strong> When output increases, money demand rises, and
          the interest rate must rise to clear the money market. Hence, higher Y is paired with
          higher r.
        </p>
        <p>
          <strong>What shifts the LM curve?</strong> Changes in monetary policy (M or P) shift the LM
          curve:
        </p>
        <ul>
          <li>
            <strong>M up (expansionary)</strong>: LM shifts RIGHT (lower rates at each output level)
          </li>
          <li>
            <strong>M down (contractionary)</strong>: LM shifts LEFT (higher rates at each output
            level)
          </li>
          <li>
            <strong>P up (inflation)</strong>: LM shifts LEFT (real money supply falls)
          </li>
        </ul>
      </ToolNote>

      {/* Interactive: LM */}
      <ToolNote label="Try it" variant="try" title="Adjust LM Curve Parameters">
        <div className={SPLIT}>
          <div>
            <h4 className="mb-4 text-label-sm font-semibold text-fg">LM Curve Parameters</h4>
            <div className="control-panel">
              <SliderControl label="Money Supply (M)" value={M_a} min={80} max={250} onChange={setM_a} />
              <SliderControl
                label="Price Level (P)"
                value={P_a}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={setP_a}
              />
              <SliderControl
                label="Money Demand Sensitivity (γ)"
                value={gamma}
                min={1}
                max={30}
                onChange={setGamma}
              />
            </div>

            <div className={NOTE_BOX}>
              <p>
                <strong>What to observe:</strong> As you increase M, the LM curve shifts RIGHT
                (lower interest rates at each output level). As you increase P, the LM curve shifts
                LEFT (real money supply decreases).
              </p>
              <p className="mt-2">
                <strong>Curve Slope:</strong> The LM curve's slope is determined by money demand
                sensitivity (γ). The slope is 1/γ, so higher γ means a steeper LM curve (more
                interest rate sensitivity to output changes).
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-label-sm font-semibold text-fg">LM Curve</h4>
            {lmCurveA.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lmCurveA} margin={chartTheme.margin}>
                  <CartesianGrid {...chartTheme.grid} />
                  <XAxis
                    dataKey="Y"
                    type="number"
                    domain={[0, 500]}
                    ticks={[0, 100, 200, 300, 400, 500]}
                    allowDataOverflow
                    label={{
                      value: 'Output (Y)',
                      position: 'insideBottomRight',
                      offset: -5,
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.axis}
                  />
                  <YAxis
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    allowDataOverflow
                    label={{
                      value: 'Interest Rate (r)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.axis}
                  />
                  <Tooltip
                    {...chartTheme.tooltip}
                    cursor={chartTheme.cursor}
                    formatter={(value: number) => value.toFixed(2)}
                    labelFormatter={(label: number) => `Y = ${label.toFixed(1)}`}
                  />
                  <ChartLine
                    type="monotone"
                    dataKey="r"
                    stroke={LM_STROKE}
                    dot={false}
                    strokeWidth={2}
                    name="LM Curve"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-card border border-border bg-surface-2">
                <p className="text-sm text-fg-subtle">No data to display</p>
              </div>
            )}
          </div>
        </div>
      </ToolNote>

      {/* Lesson 3 */}
      <ToolNote label="Lesson 3" variant="lesson" title="IS-LM Equilibrium">
        <p>
          <strong>What is IS-LM Equilibrium?</strong> The intersection of the IS and LM curves
          determines the equilibrium output (Y*) and interest rate (r*) where both the goods market
          and money market clear simultaneously.
        </p>
        <p>
          <strong>Graphical Intuition:</strong>
        </p>
        <ul>
          <li>
            Points <em>above</em> IS: Investment greater than Saving (excess demand, so output is
            pushed up)
          </li>
          <li>
            Points <em>below</em> IS: Investment less than Saving (excess saving, so output falls)
          </li>
          <li>
            Points <em>above</em> LM: Money demand greater than Money supply (interest rates rise to
            equilibrate)
          </li>
          <li>
            Points <em>below</em> LM: Money demand less than Money supply (interest rates fall to
            equilibrate)
          </li>
        </ul>
        <p>
          <strong>Policy Implications:</strong>
        </p>
        <ul>
          <li>
            <strong>Fiscal Policy (G up):</strong> Shifts IS right, so output up and interest rate
            up (crowding out: higher rates discourage investment)
          </li>
          <li>
            <strong>Monetary Policy (M up):</strong> Shifts LM right, so output up and interest rate
            down (less crowding out)
          </li>
          <li>
            <strong>Combined:</strong> Fiscal and monetary policy can amplify output increases with
            minimal rate increases
          </li>
        </ul>
      </ToolNote>

      {/* Comparison toggle */}
      <label className="mb-8 flex cursor-pointer items-center gap-2 text-sm font-medium text-fg">
        <input
          type="checkbox"
          checked={comparisonMode}
          onChange={(e) => setComparisonMode(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[rgb(var(--c-accent-ch))]"
        />
        Compare Two Scenarios
      </label>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-5 text-lg font-semibold tracking-tight text-fg">Scenario A</h3>
          <div className="control-panel">
            <SliderControl
              label="Government Spending (G)"
              value={G_a}
              min={50}
              max={200}
              step={10}
              onChange={setG_a}
              unit="units"
            />
            <SliderControl
              label="Taxes (T)"
              value={T_a}
              min={20}
              max={100}
              step={5}
              onChange={setT_a}
              unit="units"
            />
            <SliderControl
              label="Money Supply (M)"
              value={M_a}
              min={50}
              max={200}
              step={10}
              onChange={setM_a}
              unit="units"
            />
            <SliderControl
              label="Price Level (P)"
              value={P_a}
              min={0.8}
              max={1.2}
              step={0.1}
              onChange={setP_a}
            />
            <SliderControl
              label="Investment Intercept (I₀)"
              value={I0_a}
              min={20}
              max={80}
              step={5}
              onChange={setI0_a}
              unit="units"
            />
          </div>
        </div>

        {comparisonMode && (
          <div>
            <h3 className="mb-5 text-lg font-semibold tracking-tight text-fg">Scenario B</h3>
            <div className="control-panel">
              <SliderControl
                label="Government Spending (G)"
                value={G_b}
                min={50}
                max={200}
                step={10}
                onChange={setG_b}
                unit="units"
              />
              <SliderControl
                label="Taxes (T)"
                value={T_b}
                min={20}
                max={100}
                step={5}
                onChange={setT_b}
                unit="units"
              />
              <SliderControl
                label="Money Supply (M)"
                value={M_b}
                min={50}
                max={200}
                step={10}
                onChange={setM_b}
                unit="units"
              />
              <SliderControl
                label="Price Level (P)"
                value={P_b}
                min={0.8}
                max={1.2}
                step={0.1}
                onChange={setP_b}
              />
              <SliderControl
                label="Investment Intercept (I₀)"
                value={I0_b}
                min={20}
                max={80}
                step={5}
                onChange={setI0_b}
                unit="units"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-micro font-bold uppercase tracking-widest text-fg-subtle">
          Equilibrium Results
        </h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatBox label="Output (Y*)" value={equilibrium_a.Y.toFixed(2)} tone="accent" />
          <StatBox label="Interest Rate (r*)" value={equilibrium_a.r.toFixed(2)} unit="%" />
          <StatBox label="Investment at Eq." value={equilibrium_a.I.toFixed(2)} unit="units" />
          <StatBox label="Money Demand (L)" value={equilibrium_a.L.toFixed(2)} unit="units" />
        </div>
      </div>

      {comparisonMode && (
        <>
          <div className="mb-8">
            <h3 className="mb-4 text-micro font-bold uppercase tracking-widest text-fg-subtle">
              Policy Impact Comparison
            </h3>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatBox
                label="Output Change (ΔY)"
                value={`${outputChange >= 0 ? '+' : ''}${outputChange.toFixed(2)}`}
                tone={outputChange >= 0 ? 'positive' : 'negative'}
              />
              <StatBox
                label="Interest Rate Change (Δr)"
                value={`${rateChange >= 0 ? '+' : ''}${rateChange.toFixed(2)}%`}
                tone={rateChange >= 0 ? 'negative' : 'positive'}
              />
              <StatBox label="Scenario B Output" value={equilibrium_b.Y.toFixed(2)} tone="accent" />
              <StatBox label="Scenario B Rate" value={`${equilibrium_b.r.toFixed(2)}%`} tone="accent" />
            </div>
          </div>

          <ToolNote label="Watch out" variant="warning" title="Crowding Out Effect">
            <p>
              When fiscal policy increases without accompanying monetary expansion, interest rates
              rise, discouraging private investment. This is &quot;crowding out.&quot;
            </p>
            <p>
              <strong>Your results:</strong> If Δr is positive (rates rose), look for the output gain
              to be smaller than predicted by the multiplier alone, because investment fell.
            </p>
          </ToolNote>

          <ToolNote label="Insight" variant="insight" title="Policy Effectiveness Comparison">
            <ul>
              <li>
                <strong>Fiscal policy alone:</strong> Raises output but also raises rates (crowding
                out reduces gains)
              </li>
              <li>
                <strong>Monetary policy alone:</strong> Raises output and lowers rates (no crowding
                out, investment encouraged)
              </li>
              <li>
                <strong>Combined policy:</strong> Maximum output gain with minimal rate increases
                (best of both worlds)
              </li>
            </ul>
          </ToolNote>
        </>
      )}

      {/* IS-LM diagram */}
      <figure className="visualization-container">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">IS-LM Diagram</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={comparisonMode ? chartData_comparison : chartData_a} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="Y"
              label={{
                value: 'Output (Y)',
                position: 'insideBottomRight',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              domain={[0, 700]}
              ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
              allowDataOverflow
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Interest Rate (r)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              {...chartTheme.axis}
            />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            {!comparisonMode ? (
              <>
                <ChartLine
                  type="monotone"
                  dataKey="r"
                  stroke={IS_STROKE}
                  dot={false}
                  name="IS Curve"
                  data={isCurveA}
                  strokeWidth={2}
                />
                <ChartLine
                  type="monotone"
                  dataKey="r"
                  stroke={LM_STROKE}
                  dot={false}
                  name="LM Curve"
                  data={lmCurveA}
                  strokeWidth={2}
                />
              </>
            ) : (
              <>
                <ChartLine
                  type="monotone"
                  dataKey="r"
                  stroke={IS_STROKE}
                  dot={false}
                  name="IS-A"
                  data={isCurveA}
                  strokeWidth={2}
                />
                <ChartLine
                  type="monotone"
                  dataKey="r"
                  stroke={LM_STROKE}
                  dot={false}
                  name="LM-A"
                  data={lmCurveA}
                  strokeWidth={2}
                />
                <ChartLine
                  type="monotone"
                  dataKey="r"
                  stroke={IS_STROKE}
                  strokeOpacity={0.55}
                  dot={false}
                  name="IS-B"
                  data={isCurveB}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <ChartLine
                  type="monotone"
                  dataKey="r"
                  stroke={LM_STROKE}
                  strokeOpacity={0.55}
                  dot={false}
                  name="LM-B"
                  data={lmCurveB}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </>
            )}
            <Legend {...chartTheme.legend} />
          </LineChart>
        </ResponsiveContainer>

        {/* Equilibrium readouts */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-card border border-tier-advanced/30 bg-tier-advanced/5 px-3 py-2">
            <div className="text-micro font-bold uppercase tracking-widest text-tier-advanced-ink">
              Scenario A equilibrium
            </div>
            <div className="mt-1 text-sm text-fg-muted tabular-nums">
              Y* = {equilibrium_a.Y.toFixed(2)} | r* = {equilibrium_a.r.toFixed(2)}%
            </div>
          </div>
          {comparisonMode && (
            <div className="rounded-card border border-tier-case/30 bg-tier-case/5 px-3 py-2">
              <div className="text-micro font-bold uppercase tracking-widest text-tier-case-ink">
                Scenario B equilibrium
              </div>
              <div className="mt-1 text-sm text-fg-muted tabular-nums">
                Y* = {equilibrium_b.Y.toFixed(2)} | r* = {equilibrium_b.r.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </figure>

      {/* Explanations */}
      <ToolNote label="Overview" variant="info" title="How IS-LM Works">
        <ul>
          <li>
            <strong>IS Curve (Investment-Saving):</strong> Shows combinations of Y and r where the
            goods market clears. Higher r reduces investment, lowering equilibrium Y. When G rises,
            IS shifts right (higher Y at each r).
          </li>
          <li>
            <strong>LM Curve (Liquidity-Money):</strong> Shows combinations of Y and r where the
            money market clears. Higher Y increases money demand, raising r. When M rises, LM shifts
            right (lower r at each Y).
          </li>
          <li>
            <strong>Equilibrium:</strong> Where IS and LM intersect. At this point, both goods and
            money markets are in equilibrium.
          </li>
        </ul>
      </ToolNote>

      <ToolNote label="Reference" variant="lesson" title="Understanding the Curves">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-label-sm font-semibold text-fg">IS Curve Characteristics</h4>
            <ul>
              <li>
                <strong>Slope:</strong> Negative (downward sloping)
              </li>
              <li>
                <strong>Reason:</strong> Higher interest rates reduce investment, decreasing
                aggregate demand and output
              </li>
              <li>
                <strong>Shifts:</strong> Due to changes in G, T, C₀, I₀, or consumer confidence
              </li>
              <li>
                <strong>Shape:</strong> Typically linear but can be curved depending on model
                assumptions
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-label-sm font-semibold text-fg">LM Curve Characteristics</h4>
            <ul>
              <li>
                <strong>Slope:</strong> Positive (upward sloping)
              </li>
              <li>
                <strong>Reason:</strong> Higher income increases money demand, requiring higher
                interest rates to maintain equilibrium
              </li>
              <li>
                <strong>Shifts:</strong> Due to changes in M or P
              </li>
              <li>
                <strong>Shape:</strong> Typically linear but can be curved in more advanced models
              </li>
            </ul>
          </div>
        </div>
      </ToolNote>

      <ToolNote label="Insight" variant="insight" title="Policy Effects">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <strong>Fiscal Expansion (G up or T down):</strong>
            <ul className="mt-2">
              <li>IS shifts right, so Y up and r up</li>
              <li>Higher rates crowd out private investment</li>
              <li>Multiplier effect depends on monetary policy response</li>
            </ul>
          </div>
          <div>
            <strong>Monetary Expansion (M up):</strong>
            <ul className="mt-2">
              <li>LM shifts right, so Y up and r down</li>
              <li>Lower rates boost private investment</li>
              <li>
                More effective in a liquidity trap, when r is already low
              </li>
            </ul>
          </div>
        </div>
      </ToolNote>

      <ToolNote label="Go deeper" variant="info" title="Advanced Concepts">
        <ul>
          <li>
            <strong>Crowding Out:</strong> Fiscal expansion raises interest rates, crowding out
            private investment. Try increasing G and notice that r increases, which reduces I in the
            equilibrium results.
          </li>
          <li>
            <strong>Multiplier Effect:</strong> The impact of fiscal policy on output depends on the
            interest rate response. With flexible money supply (M rising too), the multiplier is
            stronger.
          </li>
          <li>
            <strong>Monetary Policy Effectiveness:</strong> Monetary policy is most effective when
            the LM curve is steep (sensitive to Y changes). It is ineffective in a liquidity trap,
            where LM is horizontal.
          </li>
          <li>
            <strong>Policy Mix:</strong> Fiscal expansion plus monetary contraction raises rates and
            crowds out investment. Fiscal expansion plus monetary expansion keeps rates stable and
            the multiplier strong.
          </li>
        </ul>
      </ToolNote>

      <ToolNote label="Try it" variant="try" title="Experiments">
        <p>Enable &quot;Compare Two Scenarios&quot; and try these:</p>
        <ol>
          <li>
            <strong>Fiscal Stimulus Alone:</strong> Keep Scenario A as baseline. In Scenario B,
            increase G by 30. Watch output rise but interest rate rise too (crowding out effect
            visible).
          </li>
          <li>
            <strong>Monetary Response to Fiscal:</strong> Same as above, but also increase M by 30 in
            Scenario B. Output rises more and the rate increase is smaller.
          </li>
          <li>
            <strong>Monetary Policy Alone:</strong> Keep Scenario A as baseline. In Scenario B,
            increase M by 40 only (keep G unchanged). Output rises and rates fall, so investment is
            encouraged.
          </li>
          <li>
            <strong>Tax Cut vs. Spending Increase:</strong> In Scenario B, decrease T by 20 (instead
            of increasing G). Output rises but by less than the same dollar amount in spending. This
            is the tax multiplier effect.
          </li>
          <li>
            <strong>Inflation Effect on Money:</strong> In Scenario B, increase P (price level) with
            M unchanged. This reduces real money supply (M/P falls), raising rates and crowding out
            private investment.
          </li>
        </ol>
      </ToolNote>

      <InfoBox title="Applications of the IS-LM Model" type="info">
        <ul>
          <li>
            <strong>Economic Analysis:</strong> Analyze the effects of fiscal and monetary policy on
            output and interest rates
          </li>
          <li>
            <strong>Policy Design:</strong> Determine optimal combinations of fiscal and monetary
            policy to achieve desired outcomes
          </li>
          <li>
            <strong>Recession Analysis:</strong> Understand how to stimulate the economy during
            downturns
          </li>
          <li>
            <strong>Inflation Control:</strong> Analyze how to cool down overheating economies
          </li>
          <li>
            <strong>International Policy:</strong> Basis for the Mundell-Fleming model in open
            economies
          </li>
        </ul>
        <p className="mt-3">
          The IS-LM model is a fundamental tool for understanding how the goods market and money
          market interact to determine national income and interest rates in the short run.
        </p>
      </InfoBox>
    </div>
  )
}
