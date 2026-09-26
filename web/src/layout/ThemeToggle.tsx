import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted transition-colors hover:text-fg"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
