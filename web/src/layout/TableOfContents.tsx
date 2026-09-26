import type { Heading } from '../content/markdownComponents'

/** Sticky lecture table of contents built from the rendered headings. */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null
  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fg-subtle">On this page</p>
        <ul className="space-y-1 border-l border-border pl-3 text-sm">
          {headings.map((heading, i) => (
            <li key={`${heading.id}-${i}`} className={heading.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${heading.id}`}
                className="block py-0.5 text-fg-muted no-underline hover:text-accent"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
