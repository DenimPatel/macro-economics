import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="card max-w-xl p-8">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="That route does not exist. It may have been renamed, or the link may be mistyped."
      />
      <div className="flex flex-wrap gap-2.5">
        <Link to="/" className="button button-primary no-underline">
          Home
        </Link>
        <Link to="/syllabus" className="button button-secondary no-underline">
          Syllabus
        </Link>
        <Link to="/tools" className="button button-secondary no-underline">
          Tools
        </Link>
      </div>
    </div>
  )
}
