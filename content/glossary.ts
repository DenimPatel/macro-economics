/**
 * Glossary of key terms. Rendered by the /glossary page; each entry may link to
 * the lecture where it is taught.
 */
export interface GlossaryEntry {
  term: string
  definition: string
  /** Lecture number where the term is introduced, when applicable. */
  lecture?: number
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Aggregate demand', definition: 'Total desired spending on domestic output: consumption, investment, government spending, and net exports.', lecture: 3 },
  { term: 'Automatic stabilizers', definition: 'Fiscal features such as taxes and transfers that dampen fluctuations without explicit policy action.', lecture: 3 },
  { term: 'Balanced growth path', definition: 'A path on which output, capital, and the labour force grow at a constant common rate, with ratios roughly stable.', lecture: 15 },
  { term: 'Bond price and yield', definition: 'The price of a bond is the present value of its payments; price and yield move in opposite directions.', lecture: 22 },
  { term: 'Conditional convergence', definition: 'Countries grow faster when further below their own steady state, given structural characteristics.', lecture: 16 },
  { term: 'CPI', definition: 'Consumer Price Index; a measure of the price level based on a fixed basket of consumer goods, used to compute inflation.', lecture: 2 },
  { term: 'Crowding out', definition: 'The reduction in private investment caused by the higher interest rates a fiscal expansion brings.', lecture: 6 },
  { term: 'Discount factor', definition: 'The value today of one unit of currency next period, 1/(1+i); used to compute present discounted values.', lecture: 22 },
  { term: 'EPDV', definition: 'Expected Present Discounted Value; the sum of future expected payments discounted at the relevant rates.', lecture: 22 },
  { term: 'Fisher equation', definition: 'The real interest rate is approximately the nominal rate minus expected inflation.', lecture: 7 },
  { term: 'GDP', definition: 'Gross Domestic Product; the value of final goods and services produced domestically during a period.', lecture: 2 },
  { term: 'GDP deflator', definition: 'The ratio of nominal to real GDP; a broad measure of the price level covering all domestic output.', lecture: 2 },
  { term: 'IS curve', definition: 'The set of output and interest-rate pairs that equilibrate the goods market; downward sloping.', lecture: 5 },
  { term: 'IS-LM-PC', definition: 'The IS-LM model combined with the Phillips curve, so the output gap drives inflation dynamics.', lecture: 11 },
  { term: 'J-curve', definition: 'The tendency of the trade balance to worsen before improving after a depreciation, because quantities adjust slowly.', lecture: 19 },
  { term: 'LM curve', definition: 'The set of output and interest-rate pairs that equilibrate the money market; upward sloping.', lecture: 5 },
  { term: 'Marshall-Lerner condition', definition: 'A depreciation improves the trade balance only if export and import elasticities sum to more than one.', lecture: 19 },
  { term: 'Multiplier', definition: 'The factor 1/(1−c₁) by which a change in autonomous spending is amplified into a change in output.', lecture: 3 },
  { term: 'Mundell-Fleming', definition: 'IS-LM extended to an open economy with perfect capital mobility, used to compare fixed and floating regimes.', lecture: 20 },
  { term: 'Natural rate of unemployment', definition: 'The unemployment rate at which the real wage workers demand equals the real wage firms can pay.', lecture: 8 },
  { term: 'Neutral real rate', definition: 'The real interest rate consistent with output at potential and stable inflation in the medium run.', lecture: 24 },
  { term: 'Okun\u2019s law', definition: 'The empirical relationship between movements in the unemployment rate and deviations of output from potential.', lecture: 2 },
  { term: 'Open market operations', definition: 'Central-bank purchases or sales of bonds that change the money supply and the interest rate.', lecture: 4 },
  { term: 'Output gap', definition: 'The difference between actual output and potential output; positive when the economy is overheating.', lecture: 11 },
  { term: 'Phillips curve', definition: 'The relationship between unemployment (or the output gap) and the change in inflation.', lecture: 9 },
  { term: 'Present value', definition: 'The value today of a future payment, obtained by discounting at the relevant interest rate.', lecture: 22 },
  { term: 'Solow residual', definition: 'The part of growth not explained by capital and labour inputs; a measure of total factor productivity.', lecture: 16 },
  { term: 'Steady state', definition: 'A rest point where investment exactly replaces depreciation and capital per (effective) worker is constant.', lecture: 14 },
  { term: 'TFP', definition: 'Total factor productivity; how much output is obtained from given inputs, driven by technology and efficiency.', lecture: 16 },
  { term: 'Trade balance', definition: 'Net exports: exports minus imports, equivalently output minus domestic spending.', lecture: 17 },
  { term: 'Trilemma', definition: 'A country cannot simultaneously have a fixed exchange rate, free capital flows, and independent monetary policy.', lecture: 21 },
  { term: 'Uncovered interest parity', definition: 'The domestic interest rate equals the foreign rate plus the expected depreciation of the domestic currency.', lecture: 17 },
  { term: 'Wage-setting curve', definition: 'The real wage workers can secure at each unemployment rate; downward sloping in unemployment.', lecture: 8 },
  { term: 'Zero lower bound', definition: 'The constraint that nominal interest rates cannot fall much below zero, limiting conventional monetary policy.', lecture: 6 },
]
