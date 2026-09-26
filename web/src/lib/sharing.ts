export interface ScenarioParams {
  [key: string]: number
}

export const saveScenario = (toolId: string, params: ScenarioParams): string => {
  const encoded = btoa(JSON.stringify({ toolId, params, timestamp: Date.now() }))
  return encoded
}

export const loadScenario = (encoded: string): { toolId: string; params: ScenarioParams } | null => {
  try {
    const decoded = JSON.parse(atob(encoded))
    return { toolId: decoded.toolId, params: decoded.params }
  } catch {
    return null
  }
}

export const copyToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text)
}

export const generateShareUrl = (baseUrl: string, scenario: string): string => {
  return `${baseUrl}?scenario=${scenario}`
}

export const downloadAsJSON = (data: object, filename: string): void => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const downloadAsCSV = (data: unknown[], filename: string): void => {
  if (data.length === 0) return

  const headers = Object.keys(data[0] as Record<string, unknown>)
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = (row as Record<string, unknown>)[header]
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        })
        .join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
