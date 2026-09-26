import type { Heading } from '../content/markdownComponents'

/** Sticky lecture table of contents built from the rendered headings. */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null
  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <nav aria-label="On this page">
        <div className="sticky top-20">
          <p className="mb-2.5 text-micro font-bold uppercase tracking-widest text-fg-subtle">
            On this page
          </p>
          <ul className="space-y-0.5 border-l border-border pl-3 text-sm">
            {headings.map((heading, i) => (
              <li key={`${heading.id}-${i}`} className={heading.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${heading.id}`}
                  className="block py-0.5 leading-snug text-fg-muted no-underline transition-colors hover:text-accent"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
