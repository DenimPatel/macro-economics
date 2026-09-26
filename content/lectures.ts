/**
 * Course metadata: the single source of truth that maps each lecture to its
 * tier, source video, interactive tools, concepts, and quiz.
 *
 * Prose lives in `content/lecture_notes/Lecture_N.md` and is rendered by the
 * site; this file never duplicates it. Add a lecture here when you add a note.
 */

export type Tier = 'beginner' | 'intermediate' | 'advanced' | 'case-study'

export type ToolId =
  | 'gdp-visualizer'
  | 'multiplier-simulator'
  | 'fiscal-policy-experiments'
  | 'is-lm-explorer'
  | 'modern-is-curve'
  | 'phillips-curve'
  | 'phillips-curve-tradeoff'
  | 'real-interest-rate'
  | 'real-interest-rate-calculator'
  | 'labor-market'
  | 'labor-market-wsps'
  | 'is-lm-pc-dynamics'
  | 'solow-simulator'
  | 'mundell-fleming'
  | 'asset-pricing'
  | 'growth-accounting'
  | 'crisis-2008'
  | 'crisis-covid'
  | 'crisis-svb'
  | 'speculative-attack'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  /** Index into `options`. */
  answer: number
  explanation: string
}

export interface MiniToolSpec {
  toolId: ToolId
  /** Optional starting scenario label shown above the embedded tool. */
  preset?: string
  caption?: string
}

export interface LectureMeta {
  /** Lecture number as it appears in the note heading. */
  n: number
  slug: string
  title: string
  tier: Tier
  /** Review lectures have no new material and no tools. */
  review?: boolean
  videoUrl: string
  summary: string
  tools: ToolId[]
  concepts: string[]
  miniTools: MiniToolSpec[]
  quiz: QuizQuestion[]
}

export interface CaseStudy {
  id: string
  slug: string
  title: string
  period: string
  summary: string
  tool: ToolId
  /** Lecture numbers this case draws on. */
  relatedLectures: number[]
}

const PLAYLIST = 'PLUl4u3cNGP62EXoZ4B3_Ob7lRRwpGQxkb'
const video = (id: string) => `https://youtu.be/${id}?list=${PLAYLIST}`

export const LECTURES: LectureMeta[] = [
  {
    n: 1,
    slug: 'introduction',
    title: 'Introduction to Macroeconomics',
    tier: 'beginner',
    videoUrl: video('heBErnN3ZPk'),
    summary:
      'Why macro is not just micro writ large, the big variables, and how aggregate outcomes produce paradoxes like "good news is bad news".',
    tools: [],
    concepts: [
      'micro vs macro',
      'aggregate variables',
      'fallacy of composition',
      'paradox of savings',
      'wage-price spiral',
    ],
    miniTools: [],
    quiz: [
      {
        id: 'l1q1',
        question: 'What best distinguishes macroeconomics from microeconomics?',
        options: [
          'Macroeconomics studies only government policy',
          'Macroeconomics studies economy-wide aggregates, not individual agents',
          'Microeconomics uses no mathematics',
          'They are identical but use different data',
        ],
        answer: 1,
        explanation:
          'Macro focuses on aggregates like GDP, inflation, and unemployment, whereas micro studies individual agents and markets.',
      },
      {
        id: 'l1q2',
        question: 'The paradox of savings illustrates which idea?',
        options: [
          'Saving is always bad',
          'What is true for one person may not be true for everyone at once',
          'Interest rates do not matter',
          'Inflation always follows saving',
        ],
        answer: 1,
        explanation:
          'The fallacy of composition: if one person saves more they are better off, but if everyone saves more at once demand falls and output may drop.',
      },
    ],
  },
  {
    n: 2,
    slug: 'definitions',
    title: 'Definitions: GDP, Unemployment, and Inflation',
    tier: 'beginner',
    videoUrl: video('kmUPK9AIE64'),
    summary:
      'How GDP is built from final goods or value added, what the unemployment rate does and does not capture, and the difference between the CPI and the GDP deflator.',
    tools: ['gdp-visualizer'],
    concepts: [
      'GDP',
      'value added',
      'unemployment rate',
      'participation rate',
      'CPI',
      'GDP deflator',
      "Okun's law",
    ],
    miniTools: [
      { toolId: 'gdp-visualizer', caption: 'See the three ways of measuring GDP agree.' },
    ],
    quiz: [
      {
        id: 'l2q1',
        question: 'GDP measures the value of:',
        options: [
          'All transactions in the economy, including used goods',
          'Final goods and services produced domestically in a period',
          'Only goods, not services',
          'The nation\u2019s total wealth',
        ],
        answer: 1,
        explanation:
          'GDP counts final production during a period; used goods and intermediate goods are excluded to avoid double counting.',
      },
      {
        id: 'l2q2',
        question: 'If nominal GDP rises 5% while the price level rises 5%, real GDP:',
        options: ['Rises 10%', 'Rises 5%', 'Is roughly unchanged', 'Falls 5%'],
        answer: 2,
        explanation: 'Real GDP is nominal GDP adjusted for prices, so it is approximately unchanged.',
      },
    ],
  },
  {
    n: 3,
    slug: 'goods-market',
    title: 'The Goods Market and Aggregate Demand',
    tier: 'beginner',
    videoUrl: video('fxrwTj2i_S4'),
    summary:
      'Consumption, the multiplier, goods-market equilibrium, and why the paradox of savings appears once you allow income to respond.',
    tools: ['multiplier-simulator', 'fiscal-policy-experiments'],
    concepts: [
      'consumption function',
      'multiplier',
      'goods-market equilibrium',
      'autonomous spending',
      'fiscal policy',
    ],
    miniTools: [
      {
        toolId: 'multiplier-simulator',
        preset: 'MPC 0.6',
        caption: 'Watch spending cascade through successive rounds.',
      },
    ],
    quiz: [
      {
        id: 'l3q1',
        question: 'With marginal propensity to consume c1, the multiplier is:',
        options: ['c1', '1 / (1 - c1)', '1 - c1', '1 / c1'],
        answer: 1,
        explanation:
          'Each round of spending is a fraction c1 of the previous, so the total is the geometric sum 1/(1 - c1).',
      },
      {
        id: 'l3q2',
        question: 'A $1 increase in autonomous spending raises equilibrium output by:',
        options: ['Exactly $1', 'Less than $1', 'More than $1', 'Nothing'],
        answer: 2,
        explanation:
          'The multiplier means output rises by 1/(1 - c1) dollars, which exceeds one when 0 < c1 < 1.',
      },
    ],
  },
  {
    n: 4,
    slug: 'financial-markets',
    title: 'Financial Markets and Interest Rate Determination',
    tier: 'beginner',
    videoUrl: video('b5H8D_wD2AY'),
    summary:
      'Money demand and money supply set the interest rate; open market operations shift it; bond prices and yields move in opposite directions.',
    tools: ['real-interest-rate', 'real-interest-rate-calculator'],
    concepts: [
      'money demand',
      'money supply',
      'open market operations',
      'bond prices and yields',
      'interest-rate determination',
    ],
    miniTools: [
      {
        toolId: 'real-interest-rate-calculator',
        preset: 'nominal 5%, inflation 2%',
        caption: 'Separate the nominal rate from the real rate.',
      },
    ],
    quiz: [
      {
        id: 'l4q1',
        question: 'Higher income, with money supply fixed, tends to:',
        options: [
          'Lower the interest rate',
          'Raise the interest rate',
          'Leave the interest rate unchanged',
          'Lower output',
        ],
        answer: 1,
        explanation:
          'Higher income raises money demand; with a fixed supply, the interest rate must rise to restore equilibrium.',
      },
      {
        id: 'l4q2',
        question: 'An open market purchase by the central bank:',
        options: [
          'Reduces the money supply and raises rates',
          'Increases the money supply and lowers rates',
          'Has no effect on the money supply',
          'Increases reserve requirements',
        ],
        answer: 1,
        explanation:
          'The central bank buys bonds, paying with newly created money, expanding the supply and pushing the rate down.',
      },
    ],
  },
  {
    n: 5,
    slug: 'is-lm-part-1',
    title: 'The IS-LM Model (Part I)',
    tier: 'beginner',
    videoUrl: video('qg_HT3CjFI4'),
    summary:
      'Goods-market and financial-market equilibrium combined: the downward-sloping IS curve and upward-sloping LM curve determine output and the interest rate together.',
    tools: ['is-lm-explorer'],
    concepts: ['IS curve', 'LM curve', 'simultaneous equilibrium', 'slope of IS', 'slope of LM'],
    miniTools: [
      {
        toolId: 'is-lm-explorer',
        preset: 'baseline',
        caption: 'Shift the curves and find the new intersection.',
      },
    ],
    quiz: [
      {
        id: 'l5q1',
        question: 'The IS curve slopes downward because:',
        options: [
          'Higher income raises money demand',
          'A lower interest rate raises investment and thus output',
          'Inflation falls with output',
          'Taxes fall automatically',
        ],
        answer: 1,
        explanation:
          'IS traces goods-market equilibria: lower r raises investment, and through the multiplier, output.',
      },
      {
        id: 'l5q2',
        question: 'The LM curve slopes upward because:',
        options: [
          'Higher output raises money demand, requiring a higher rate',
          'Higher rates reduce investment',
          'Prices are sticky',
          'Exports rise with output',
        ],
        answer: 0,
        explanation:
          'For a fixed money supply, higher output raises money demand and therefore the equilibrium interest rate.',
      },
    ],
  },
  {
    n: 6,
    slug: 'is-lm-part-2',
    title: 'The IS-LM Model (Part II): Applications and Policy Analysis',
    tier: 'beginner',
    videoUrl: video('gYgARXwnZTk'),
    summary:
      'Using IS-LM to analyse fiscal and monetary policy, crowding out, and the policy mix, including the 2008-style shift in financial conditions.',
    tools: ['is-lm-explorer', 'modern-is-curve'],
    concepts: ['fiscal expansion', 'monetary expansion', 'crowding out', 'policy mix', 'policy analysis'],
    miniTools: [
      {
        toolId: 'is-lm-explorer',
        preset: 'fiscal expansion',
        caption: 'Watch the interest rate rise as output expands.',
      },
    ],
    quiz: [
      {
        id: 'l6q1',
        question: 'Crowding out refers to:',
        options: [
          'Fiscal expansion lowering the interest rate',
          'Higher interest rates from fiscal expansion reducing private investment',
          'Monetary expansion raising output',
          'Imports displacing exports',
        ],
        answer: 1,
        explanation:
          'A fiscal expansion shifts IS right, raising r and dampening investment, so output rises by less than the simple multiplier.',
      },
      {
        id: 'l6q2',
        question: 'A monetary expansion in IS-LM:',
        options: [
          'Shifts LM right, lowering r and raising Y',
          'Shifts IS right, raising r and Y',
          'Shifts LM left, raising r and lowering Y',
          'Has no effect on Y',
        ],
        answer: 0,
        explanation: 'More money shifts LM to the right: the rate falls and output rises along the IS curve.',
      },
    ],
  },
  {
    n: 7,
    slug: 'is-lm-extensions',
    title: 'Extensions to IS-LM: Nominal vs. Real Rates and Credit Spreads',
    tier: 'intermediate',
    videoUrl: video('fkiWQZPOHXk'),
    summary:
      'The Fisher equation, why borrowing decisions depend on the real rate, and how credit spreads and the risk premium shift the IS curve.',
    tools: ['modern-is-curve', 'real-interest-rate'],
    concepts: ['Fisher equation', 'nominal vs real rate', 'credit spreads', 'risk premium', 'financial IS curve'],
    miniTools: [
      {
        toolId: 'modern-is-curve',
        preset: 'financial conditions',
        caption: 'Financial frictions widen the gap between the policy rate and borrowing costs.',
      },
    ],
    quiz: [
      {
        id: 'l7q1',
        question: 'The real interest rate approximately equals:',
        options: [
          'The nominal rate plus inflation',
          'The nominal rate minus expected inflation',
          'Inflation minus the nominal rate',
          'The nominal rate alone',
        ],
        answer: 1,
        explanation: 'Fisher: r ≈ i − πᵉ. Borrowers and lenders care about the real rate.',
      },
      {
        id: 'l7q2',
        question: 'An increase in credit spreads:',
        options: [
          'Shifts IS to the right',
          'Shifts IS to the left by raising borrowing costs',
          'Shifts LM to the right',
          'Has no effect on investment',
        ],
        answer: 1,
        explanation:
          'Wider spreads raise the cost of capital for firms and households, reducing investment at any policy rate.',
      },
    ],
  },
  {
    n: 8,
    slug: 'labor-market',
    title: 'The Labor Market',
    tier: 'intermediate',
    videoUrl: video('oQ2mTN1_bus'),
    summary:
      'Wage setting and price setting together determine the real wage and the natural rate of unemployment; equilibrium unemployment is structural, not a failure of demand.',
    tools: ['labor-market', 'labor-market-wsps'],
    concepts: ['WS curve', 'PS curve', 'wage bargaining', 'natural rate of unemployment', 'markup'],
    miniTools: [
      {
        toolId: 'labor-market-wsps',
        preset: 'baseline',
        caption: 'Find the real wage and unemployment where WS and PS meet.',
      },
    ],
    quiz: [
      {
        id: 'l8q1',
        question: 'The wage-setting curve slopes upward because:',
        options: [
          'Lower unemployment strengthens workers\u2019 bargaining position and raises wages',
          'Higher unemployment raises wages',
          'Prices rise with employment',
          'Firms set higher markups when employment rises',
        ],
        answer: 0,
        explanation:
          'As unemployment falls, workers have more outside options and bargaining power, so the real wage they can secure rises.',
      },
      {
        id: 'l8q2',
        question: 'The natural rate of unemployment is the point where:',
        options: [
          'Output equals money supply',
          'The real wage from WS equals the real wage from PS',
          'Inflation is zero',
          'Employment is maximal',
        ],
        answer: 1,
        explanation:
          'Equilibrium unemployment is where the wage workers demand equals the wage firms can afford to pay.',
      },
    ],
  },
  {
    n: 9,
    slug: 'phillips-curve',
    title: 'The Phillips Curve',
    tier: 'intermediate',
    videoUrl: video('mhqsslG9tyw'),
    summary:
      'From a stable inflation-unemployment trade-off to the expectations-augmented curve, and why there is no permanent trade-off at the natural rate.',
    tools: ['phillips-curve', 'phillips-curve-tradeoff'],
    concepts: ['Phillips curve', 'expectations', 'inflation', 'sacrifice ratio', 'NAIRU'],
    miniTools: [
      {
        toolId: 'phillips-curve-tradeoff',
        preset: 'expectations up',
        caption: 'When expected inflation rises, the curve shifts and the short-run trade-off moves.',
      },
    ],
    quiz: [
      {
        id: 'l9q1',
        question: 'The original Phillips curve implied:',
        options: [
          'A stable trade-off between inflation and unemployment',
          'No relationship between inflation and unemployment',
          'Unemployment causes deflation only',
          'Inflation is always zero',
        ],
        answer: 0,
        explanation:
          'Early estimates suggested policy could permanently choose a point on a stable downward-sloping trade-off.',
      },
      {
        id: 'l9q2',
        question: 'Once expectations adjust, the Phillips curve:',
        options: [
          'Stays put',
          'Shifts so that no permanent trade-off exists at the natural rate',
          'Becomes upward sloping',
          'Disappears entirely',
        ],
        answer: 1,
        explanation:
          'With expectations-augmented pricing, trying to hold unemployment below the natural rate only raises inflation over time.',
      },
    ],
  },
  {
    n: 10,
    slug: 'review-quiz-1',
    title: 'Comprehensive Review for Quiz 1',
    tier: 'beginner',
    review: true,
    videoUrl: video('XEETOp5jo9w'),
    summary: 'Review of GDP, the goods market, financial markets, and IS-LM.',
    tools: [],
    concepts: ['review: GDP', 'review: multiplier', 'review: money market', 'review: IS-LM'],
    miniTools: [],
    quiz: [
      {
        id: 'l10q1',
        question: 'Which is NOT counted in GDP?',
        options: ['A new car sold to a household', 'Intermediate goods used up in production', 'A haircut', 'Government services'],
        answer: 1,
        explanation: 'Intermediate goods are embedded in final goods; counting them would double count.',
      },
      {
        id: 'l10q2',
        question: 'An increase in government spending with unchanged taxes:',
        options: [
          'Raises output by exactly the spending increase',
          'Raises output by more than the spending increase via the multiplier',
          'Lowers output',
          'Leaves output unchanged',
        ],
        answer: 1,
        explanation: 'The initial spending is re-spent by households, amplifying the effect on output.',
      },
    ],
  },
  {
    n: 11,
    slug: 'is-lm-pc',
    title: 'The IS-LM-PC Model',
    tier: 'intermediate',
    videoUrl: video('QMtbUSfRWBY'),
    summary:
      'Combining IS-LM with the Phillips curve so that the output gap drives changes in inflation, and the central bank reacts with the policy rate.',
    tools: ['is-lm-pc-dynamics'],
    concepts: ['IS-LM-PC', 'output gap', 'Phillips curve dynamics', 'policy rate', 'Taylor rule'],
    miniTools: [
      {
        toolId: 'is-lm-pc-dynamics',
        preset: 'demand boom',
        caption: 'A positive output gap puts upward pressure on inflation.',
      },
    ],
    quiz: [
      {
        id: 'l11q1',
        question: 'In IS-LM-PC, an output gap above zero leads to:',
        options: ['Falling inflation', 'Rising inflation', 'No change in inflation', 'Falling unemployment permanently'],
        answer: 1,
        explanation: 'Above-potential output tightens the labour market and pushes inflation up along the PC.',
      },
      {
        id: 'l11q2',
        question: 'The central bank stabilizes the economy by raising the policy rate when:',
        options: [
          'Inflation is below target and output is below potential',
          'Inflation is above target and output is above potential',
          'Unemployment is at the natural rate',
          'The output gap is zero',
        ],
        answer: 1,
        explanation: 'A positive gap calls for tighter policy to bring inflation back to target.',
      },
    ],
  },
  {
    n: 12,
    slug: 'is-lm-pc-dynamics',
    title: 'The IS-LM-PC Model: Dynamics and Policy Analysis',
    tier: 'intermediate',
    videoUrl: video('yoq0ENMiR4w'),
    summary:
      'Adjustment from short run to medium run, disinflation, anchoring expectations, and the interaction of fiscal and monetary policy.',
    tools: ['is-lm-pc-dynamics', 'phillips-curve-tradeoff'],
    concepts: ['medium-run equilibrium', 'expectations anchoring', 'disinflation', 'accommodation', 'neutral rate'],
    miniTools: [
      {
        toolId: 'is-lm-pc-dynamics',
        preset: 'disinflation',
        caption: 'Trace output and inflation as policy tightens.',
      },
    ],
    quiz: [
      {
        id: 'l12q1',
        question: 'In the medium run, output returns to potential and inflation:',
        options: [
          'Accelerates forever',
          'Stabilizes (at target if expectations are anchored)',
          'Falls to zero',
          'Becomes undefined',
        ],
        answer: 1,
        explanation: 'Once the gap closes, inflation stops changing; with anchored expectations it settles at target.',
      },
      {
        id: 'l12q2',
        question: 'A permanent fiscal expansion without monetary accommodation leads to:',
        options: [
          'A higher neutral real rate and crowding out in the medium run',
          'Lower interest rates forever',
          'No change in investment',
          'Permanently higher inflation',
        ],
        answer: 0,
        explanation: 'Sustained higher demand raises the neutral rate and displaces private spending.',
      },
    ],
  },
  {
    n: 13,
    slug: 'growth-intro',
    title: 'Introduction to Economic Growth',
    tier: 'advanced',
    videoUrl: video('v3k6BbBLULI'),
    summary:
      'The growth facts, why small differences in growth rates compound, and the aggregate production function with diminishing returns.',
    tools: [],
    concepts: ['growth facts', 'productivity', 'aggregate production function', 'diminishing returns'],
    miniTools: [],
    quiz: [
      {
        id: 'l13q1',
        question: 'Long-run growth in output per person is driven mainly by:',
        options: ['Money creation', 'Technological progress', 'Population growth', 'Government spending'],
        answer: 1,
        explanation: 'Sustained increases in living standards come from productivity, not from accumulating more of the same inputs.',
      },
      {
        id: 'l13q2',
        question: 'Diminishing returns to capital imply:',
        options: [
          'Capital accumulation can raise output indefinitely',
          'Each extra unit of capital raises output by less than the last',
          'Capital is irrelevant to growth',
          'Labour does not matter',
        ],
        answer: 1,
        explanation: 'This is why capital deepening alone cannot sustain growth per worker forever — technology must do that.',
      },
    ],
  },
  {
    n: 14,
    slug: 'solow',
    title: 'The Solow Growth Model',
    tier: 'advanced',
    videoUrl: video('VE4whF07w08'),
    summary:
      'Capital accumulation, saving, and depreciation converge to a steady state; a higher saving rate raises the level of income but not its long-run growth rate.',
    tools: ['solow-simulator'],
    concepts: ['Solow model', 'steady state', 'saving rate', 'depreciation', 'capital per worker'],
    miniTools: [
      {
        toolId: 'solow-simulator',
        preset: 'baseline',
        caption: 'Raise the saving rate and watch the steady state move.',
      },
    ],
    quiz: [
      {
        id: 'l14q1',
        question: 'In the Solow model, a higher saving rate leads to:',
        options: [
          'A permanently higher growth rate',
          'A higher steady-state capital and output per worker, but no permanent growth-rate increase',
          'Lower output per worker',
          'No change in steady state',
        ],
        answer: 1,
        explanation: 'Saving affects the level of the steady state, not the long-run growth rate in the basic model.',
      },
      {
        id: 'l14q2',
        question: 'The steady state occurs when:',
        options: [
          'Investment equals depreciation (and dilution)',
          'Output is zero',
          'The saving rate is zero',
          'Capital grows forever',
        ],
        answer: 0,
        explanation: 'Investment just replaces the capital lost to depreciation and population growth, so capital per worker stops changing.',
      },
    ],
  },
  {
    n: 15,
    slug: 'technological-progress',
    title: 'Technological Progress and Growth',
    tier: 'advanced',
    videoUrl: video('nNqnivVl8WI'),
    summary:
      'Labour-augmenting progress lets output per worker grow in the steady state; the balanced-growth facts and why capital per effective worker is constant.',
    tools: ['solow-simulator', 'growth-accounting'],
    concepts: ['technological progress', 'effective worker', 'balanced growth', 'labour-augmenting progress'],
    miniTools: [
      {
        toolId: 'growth-accounting',
        preset: 'TFP growth 1.5%',
        caption: 'See how much of growth is the residual, not inputs.',
      },
    ],
    quiz: [
      {
        id: 'l15q1',
        question: 'With technological progress, in steady state capital per effective worker is constant while:',
        options: [
          'Output per worker grows at the rate of technological progress',
          'Output per worker is constant',
          'Capital per worker is constant',
          'Population stops growing',
        ],
        answer: 0,
        explanation: 'Progress raises the effective labour supply, so output per person grows even with constant capital per effective worker.',
      },
      {
        id: 'l15q2',
        question: 'Which is a balanced-growth fact?',
        options: [
          'A rising capital-output ratio over time',
          'A roughly constant capital-output ratio and constant factor shares',
          'Falling output per worker',
          'Zero productivity growth',
        ],
        answer: 1,
        explanation: 'Along the balanced growth path, ratios and shares are roughly stable while levels grow.',
      },
    ],
  },
  {
    n: 16,
    slug: 'growth-accounting',
    title: 'Growth Accounting and Conditional Convergence',
    tier: 'advanced',
    videoUrl: video('ijXdeJTL6OU'),
    summary:
      'Decomposing growth into capital, labour, and total factor productivity; the Solow residual; and why countries converge to their own steady states.',
    tools: ['growth-accounting'],
    concepts: ['growth accounting', 'TFP', 'Solow residual', 'conditional convergence', 'human capital'],
    miniTools: [
      {
        toolId: 'growth-accounting',
        preset: 'US 1990-2019',
        caption: 'Attribute growth to inputs versus productivity.',
      },
    ],
    quiz: [
      {
        id: 'l16q1',
        question: 'Growth accounting decomposes growth into:',
        options: [
          'Inflation and unemployment',
          'Capital, labour, and TFP contributions',
          'Consumption and investment only',
          'Imports and exports',
        ],
        answer: 1,
        explanation: 'The residual after accounting for inputs is interpreted as total factor productivity.',
      },
      {
        id: 'l16q2',
        question: 'Conditional convergence means:',
        options: [
          'All countries converge to the same income',
          'Countries converge to their own steady states, given their structural characteristics',
          'Rich countries always grow faster',
          'Growth rates never change',
        ],
        answer: 1,
        explanation: 'The empirical pattern is convergence after conditioning on saving, institutions, and human capital.',
      },
    ],
  },
  {
    n: 17,
    slug: 'open-economy-intro',
    title: 'Open Economy Macroeconomics: Introduction',
    tier: 'advanced',
    videoUrl: video('5uygC4oJvCI'),
    summary:
      'Openness, the trade balance, the real exchange rate, and uncovered interest parity as the link between domestic and foreign rates.',
    tools: ['mundell-fleming'],
    concepts: ['openness', 'uncovered interest parity', 'trade balance', 'real exchange rate'],
    miniTools: [
      {
        toolId: 'mundell-fleming',
        preset: 'floating baseline',
        caption: 'Introduce the rest of the world to IS-LM.',
      },
    ],
    quiz: [
      {
        id: 'l17q1',
        question: 'In an open economy, the trade balance equals:',
        options: ['Output minus domestic spending', 'Exports plus imports', 'Government spending minus taxes', 'Saving plus investment'],
        answer: 0,
        explanation: 'Net exports = Y − (C + I + G); domestic output not absorbed at home is exported.',
      },
      {
        id: 'l17q2',
        question: 'Uncovered interest parity says the domestic interest rate:',
        options: [
          'Equals the foreign rate plus the expected rate of depreciation',
          'Always exceeds the foreign rate',
          'Equals the foreign rate minus expected depreciation',
          'Is unrelated to foreign rates',
        ],
        answer: 0,
        explanation: 'Investors equalize expected returns, so the interest differential reflects expected currency movement.',
      },
    ],
  },
  {
    n: 18,
    slug: 'review-quiz-2',
    title: 'Review for Quiz 2',
    tier: 'intermediate',
    review: true,
    videoUrl: video('yv0KsBKJzKY'),
    summary: 'Review of the labour market, the Phillips curve, and IS-LM-PC.',
    tools: [],
    concepts: ['review: WS/PS', 'review: Phillips curve', 'review: IS-LM-PC'],
    miniTools: [],
    quiz: [
      {
        id: 'l18q1',
        question: 'The natural rate of unemployment is determined by:',
        options: ['Aggregate demand', 'The WS and PS curves, not by demand', 'Money supply', 'The exchange rate'],
        answer: 1,
        explanation: 'It is structural: the unemployment consistent with the real wage workers demand and firms can pay.',
      },
      {
        id: 'l18q2',
        question: 'A rise in the price of oil (a higher markup) tends to:',
        options: [
          'Raise the natural rate of unemployment',
          'Lower the natural rate of unemployment',
          'Leave the natural rate unchanged',
          'Raise output at potential',
        ],
        answer: 0,
        explanation: 'A higher markup lowers the real wage firms can pay, moving the WS/PS intersection to higher unemployment.',
      },
    ],
  },
  {
    n: 19,
    slug: 'open-economy-goods',
    title: 'Open Economy: The Goods Market',
    tier: 'advanced',
    videoUrl: video('f5ExlmDGdro'),
    summary:
      'Net exports and the real exchange rate, the Marshall-Lerner condition, and the J-curve dynamics of a depreciation.',
    tools: ['mundell-fleming'],
    concepts: ['net exports', 'Marshall-Lerner', 'depreciation', 'J-curve'],
    miniTools: [
      {
        toolId: 'mundell-fleming',
        preset: 'depreciation',
        caption: 'A weaker currency shifts demand toward domestic output.',
      },
    ],
    quiz: [
      {
        id: 'l19q1',
        question: 'A depreciation of the domestic currency tends to:',
        options: ['Raise net exports', 'Lower net exports', 'Have no effect', 'Raise the natural rate of unemployment'],
        answer: 0,
        explanation: 'A weaker currency makes exports cheaper and imports dearer, improving the trade balance under Marshall-Lerner.',
      },
      {
        id: 'l19q2',
        question: 'The Marshall-Lerner condition is that:',
        options: [
          'The sum of export and import elasticities exceeds one',
          'Interest rates are equal across countries',
          'Imports always equal exports',
          'Inflation is zero',
        ],
        answer: 0,
        explanation: 'Only then does a depreciation actually improve the trade balance rather than worsen it.',
      },
    ],
  },
  {
    n: 20,
    slug: 'mundell-fleming',
    title: 'The Mundell-Fleming Model',
    tier: 'advanced',
    videoUrl: video('ucPrWHF_5Lc'),
    summary:
      'IS-LM with perfect capital mobility and an exchange rate: fiscal policy is powerful under a peg and ineffective under floating; monetary policy is the reverse.',
    tools: ['mundell-fleming'],
    concepts: [
      'Mundell-Fleming',
      'perfect capital mobility',
      'floating rate',
      'fixed rate',
      'policy effectiveness',
    ],
    miniTools: [
      {
        toolId: 'mundell-fleming',
        preset: 'fixed vs floating',
        caption: 'Compare the same policy under two regimes.',
      },
    ],
    quiz: [
      {
        id: 'l20q1',
        question: 'Under a floating rate with perfect capital mobility, fiscal expansion:',
        options: [
          'Is highly effective',
          'Is ineffective: the currency appreciates and net exports fall',
          'Lowers the interest rate',
          'Raises the money supply',
        ],
        answer: 1,
        explanation: 'Higher rates attract capital, the currency appreciates, and crowding out of net exports offsets the fiscal boost.',
      },
      {
        id: 'l20q2',
        question: 'Under a fixed rate with perfect capital mobility, monetary policy:',
        options: [
          'Is highly effective',
          'Is ineffective: the central bank must defend the peg',
          'Raises output permanently',
          'Changes the exchange rate',
        ],
        answer: 1,
        explanation: 'Any attempt to change the money supply is reversed by intervention needed to hold the parity.',
      },
    ],
  },
  {
    n: 21,
    slug: 'exchange-rate-regimes',
    title: 'Exchange Rate Regimes',
    tier: 'advanced',
    videoUrl: video('84LF3ze7Yvw'),
    summary:
      'Fixed, floating, and intermediate regimes; speculative attacks; the trilemma; and the mechanics of defending a peg with reserves and interest rates.',
    tools: ['speculative-attack', 'mundell-fleming'],
    concepts: ['exchange-rate regimes', 'speculative attack', 'reserves', 'credibility', 'trilemma'],
    miniTools: [
      {
        toolId: 'speculative-attack',
        preset: 'reserve drain',
        caption: 'Watch reserves fall as the market bets against the peg.',
      },
    ],
    quiz: [
      {
        id: 'l21q1',
        question: 'A speculative attack on a fixed peg is most likely when:',
        options: [
          'Reserves are plentiful and the peg is credible',
          'Reserves are low and the peg is inconsistent with fundamentals',
          'Inflation is zero',
          'The currency is undervalued',
        ],
        answer: 1,
        explanation: 'Attackers bet against a peg they expect to be abandoned; low reserves and bad fundamentals invite it.',
      },
      {
        id: 'l21q2',
        question: 'Raising domestic interest rates to defend a peg:',
        options: [
          'Can help in the short run but raises fiscal and banking stress',
          'Always succeeds permanently',
          'Has no cost',
          'Directly increases reserves',
        ],
        answer: 0,
        explanation: 'Higher rates make the currency more attractive but can slow the economy and strain borrowers.',
      },
    ],
  },
  {
    n: 22,
    slug: 'asset-pricing-bonds',
    title: 'Expectations and Asset Pricing I: Bonds',
    tier: 'advanced',
    videoUrl: video('csWwk_MOLww'),
    summary:
      'Expected present discounted value, the price-yield relationship, and the term structure as a reflection of expected future short rates.',
    tools: ['asset-pricing'],
    concepts: ['bonds', 'yield', 'EPDV', 'present value', 'yield curve'],
    miniTools: [
      {
        toolId: 'asset-pricing',
        preset: 'bond',
        caption: 'Vary the discount rate and watch the price move.',
      },
    ],
    quiz: [
      {
        id: 'l22q1',
        question: 'A bond price moves:',
        options: [
          'In the same direction as its yield',
          'Inversely with its yield',
          'Independently of its yield',
          'Only with inflation',
        ],
        answer: 1,
        explanation: 'Price is the present value of fixed payments, so a higher yield means a lower price.',
      },
      {
        id: 'l22q2',
        question: 'The EPDV of a £100 payment one year from now, at nominal rate i, is:',
        options: ['£100 × (1 + i)', '£100 / (1 + i)', '£100', '£100 × i'],
        answer: 1,
        explanation: 'Discounting divides by one plus the rate; present value is always less than the future payment for positive i.',
      },
    ],
  },
  {
    n: 23,
    slug: 'asset-pricing-equity',
    title: 'Expectations and Asset Pricing II: Equity',
    tier: 'advanced',
    videoUrl: video('dCJEeSD7hKk'),
    summary:
      'Share prices as the present value of expected future dividends; how news, discount rates, and expectations move markets; and the possibility of bubbles.',
    tools: ['asset-pricing'],
    concepts: ['equities', 'dividends', 'discount rate', 'bubbles', "q theory"],
    miniTools: [
      {
        toolId: 'asset-pricing',
        preset: 'equity',
        caption: 'Growth and discount assumptions drive the valuation.',
      },
    ],
    quiz: [
      {
        id: 'l23q1',
        question: 'A share price fundamentally equals:',
        options: [
          'This year\u2019s dividend',
          'The expected present discounted value of future dividends (plus terminal value)',
          'The firm\u2019s total assets',
          'The interest rate',
        ],
        answer: 1,
        explanation: 'Equity is a claim on a stream of uncertain future payouts, discounted at the required return.',
      },
      {
        id: 'l23q2',
        question: 'If expected future dividends rise, with discount rates unchanged, the stock price:',
        options: ['Rises', 'Falls', 'Is unchanged', 'Becomes negative'],
        answer: 0,
        explanation: 'Higher expected cash flows raise the present value of the claim.',
      },
    ],
  },
  {
    n: 24,
    slug: 'expectations-is-lm',
    title: 'Expectations in IS-LM',
    tier: 'advanced',
    videoUrl: video('bEWpXwflCoY'),
    summary:
      'Forward-looking behaviour in the IS-LM framework: announcements move the economy today, expectations shift the curves, and the neutral real rate anchors medium-run policy.',
    tools: ['modern-is-curve', 'is-lm-explorer'],
    concepts: ['expectations', 'announcement effects', 'anticipation', 'neutral real rate', 'IS with expectations'],
    miniTools: [
      {
        toolId: 'modern-is-curve',
        preset: 'expected future policy',
        caption: 'Today\u2019s outcome depends on expected future rates.',
      },
    ],
    quiz: [
      {
        id: 'l24q1',
        question: 'A credible announcement of future monetary expansion:',
        options: [
          'Has no effect until it happens',
          'Can move output and inflation today by changing expected future rates',
          'Always raises the exchange rate',
          'Only affects the past',
        ],
        answer: 1,
        explanation: 'With forward-looking agents, expectations of future policy feed into current spending and pricing.',
      },
      {
        id: 'l24q2',
        question: 'The neutral real rate is the real rate consistent with:',
        options: [
          'Zero inflation',
          'Output at potential and stable inflation',
          'Maximum employment at any inflation',
          'Zero growth',
        ],
        answer: 1,
        explanation: 'It is the real rate that neither stimulates nor restrains the economy in the medium run.',
      },
    ],
  },
  {
    n: 25,
    slug: 'review-quiz-3',
    title: 'Review for Quiz 3',
    tier: 'advanced',
    review: true,
    videoUrl: video('spY5kl_EYDU'),
    summary: 'Review of growth, the open economy, and asset pricing.',
    tools: [],
    concepts: ['review: growth', 'review: open economy', 'review: asset pricing'],
    miniTools: [],
    quiz: [
      {
        id: 'l25q1',
        question: 'In the open economy with a fixed rate, fiscal expansion:',
        options: [
          'Is effective because monetary policy must accommodate',
          'Is ineffective',
          'Lowers output',
          'Raises the exchange rate only',
        ],
        answer: 0,
        explanation: 'Defending the peg requires expanding the money supply alongside the fiscal expansion, so output rises.',
      },
      {
        id: 'l25q2',
        question: 'Stock prices should fall when:',
        options: [
          'The central bank unexpectedly raises interest rates',
          'Expected dividends rise',
          'The discount rate falls',
          'Inflation falls with rates unchanged',
        ],
        answer: 0,
        explanation: 'A surprise rate rise increases the discount rate and lowers the present value of future dividends.',
      },
    ],
  },
]

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-2008',
    slug: '2008-financial-crisis',
    title: 'The 2008 Financial Crisis',
    period: '2007\u20132009',
    summary:
      'A housing shock becomes a financial crisis: credit spreads spike, the IS curve shifts left, and employment collapses while policy hits the zero lower bound.',
    tool: 'crisis-2008',
    relatedLectures: [6, 7, 11],
  },
  {
    id: 'case-covid',
    slug: 'covid-shock',
    title: 'The COVID Shock',
    period: '2020\u20132023',
    summary:
      'A supply and demand shock at once, met with massive fiscal support and monetary accommodation, followed by an inflation surge as demand recovered.',
    tool: 'crisis-covid',
    relatedLectures: [9, 11, 12],
  },
  {
    id: 'case-svb',
    slug: 'svb-and-the-fisher-equation',
    title: 'SVB and the Fisher Equation',
    period: '2022\u20132023',
    summary:
      'How a sharp rise in nominal rates after inflation surprise created unrealized bond losses and a bank run, through the lens of the real rate.',
    tool: 'crisis-svb',
    relatedLectures: [7, 21],
  },
  {
    id: 'case-speculative-attack',
    slug: 'speculative-attack-on-a-peg',
    title: 'Speculative Attack on a Fixed Peg',
    period: '1992, 2001, 2018',
    summary:
      'Reserve depletion and bank-run dynamics against a fixed exchange rate, from the ERM crisis to Argentina and Turkey.',
    tool: 'speculative-attack',
    relatedLectures: [20, 21],
  },
]

export function lectureByNumber(n: number): LectureMeta | undefined {
  return LECTURES.find((lecture) => lecture.n === n)
}

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}
