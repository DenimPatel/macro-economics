/* eslint-disable react-refresh/only-export-components -- helpers live beside the renderer intentionally. */
/**
 * Markdown rendering for lecture notes: GFM tables, KaTeX math, and heading
 * anchors. Heading ids are generated here with the same `slugify` used to build
 * the table of contents, so the two can never drift.
 */
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props
    return nodeText(props?.children)
  }
  return ''
}

function HeadingWithAnchor({ level, children }: { level: 2 | 3; children: ReactNode }) {
  const text = nodeText(children)
  const id = slugify(text)
  const Tag = level === 2 ? 'h2' : 'h3'
  return (
    <Tag id={id} className="group scroll-mt-24">
      {children}
      <a href={`#${id}`} className="anchor-link" aria-label={`Link to ${text}`}>
        #
      </a>
    </Tag>
  )
}

export interface Heading {
  level: number
  text: string
  id: string
}

/** Extract h2/h3 headings for the table of contents, skipping fenced code. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (match) {
      const text = match[2].replace(/[*_`$]/g, '').trim()
      headings.push({ level: match[1].length, text, id: slugify(text) })
    }
  }
  return headings
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-lecture">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children: c }) => <HeadingWithAnchor level={2}>{c}</HeadingWithAnchor>,
          h2: ({ children: c }) => <HeadingWithAnchor level={2}>{c}</HeadingWithAnchor>,
          h3: ({ children: c }) => <HeadingWithAnchor level={3}>{c}</HeadingWithAnchor>,
          table: ({ children: c }) => (
            <div className="overflow-x-auto">
              <table>{c}</table>
            </div>
          ),
          a: ({ href, children: c }) => {
            const external = href?.startsWith('http')
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
              >
                {c}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
