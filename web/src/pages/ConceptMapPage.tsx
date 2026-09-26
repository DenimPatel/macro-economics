import ConceptMap from '../learning/ConceptMap'
import { PageHeader } from '../components/ui'

export default function ConceptMapPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Study aid"
        title="Concept map"
        description="Every idea in the course, grouped by tier, linking to where it is taught and where you can practise it. Ticks appear as you complete lectures."
      />
      <ConceptMap />
    </div>
  )
}