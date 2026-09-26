import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'

export default function NotFound() {
  return (
    <div className="card max-w-xl p-8">
      <PageHeader title="Page not found" description="That route does not exist." />
      <div className="flex flex-wrap gap-2">
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
