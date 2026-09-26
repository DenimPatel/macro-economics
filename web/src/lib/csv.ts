/** Minimal CSV parsing for the exported datasets. */

export interface MoneySeriesPoint {
  date: string
  label: string
  m2: number
  fedFunds: number
}

function parseLine(line: string): string[] {
  const out: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      out.push(current)
      current = ''
    } else {
      current += char
    }
  }
  out.push(current)
  return out
}

export function parseMoneySeries(text: string): MoneySeriesPoint[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const header = parseLine(lines[0]).map((h) => h.trim())
  const dateIdx = header.indexOf('Date')
  const m2Idx = header.indexOf('M2_Money_Supply_Trillions')
  const rateIdx = header.indexOf('Federal_Funds_Rate_Percent')

  const points: MoneySeriesPoint[] = []
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseLine(lines[i])
    const date = cols[dateIdx]?.trim()
    const m2 = Number(cols[m2Idx])
    const fedFunds = Number(cols[rateIdx])
    if (!date || Number.isNaN(m2) || Number.isNaN(fedFunds)) continue
    points.push({ date, label: date, m2, fedFunds })
  }
  return points
}

export async function loadMoneySeries(): Promise<MoneySeriesPoint[]> {
  const url = `${import.meta.env.BASE_URL}data/us_money_market_monthly_2000_2025.csv`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to load dataset (${response.status})`)
  return parseMoneySeries(await response.text())
}
