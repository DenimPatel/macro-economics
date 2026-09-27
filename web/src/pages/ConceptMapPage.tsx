import ConceptMap from '../learning/ConceptMap'

/**
 * The route is a shell and the map is the page. `/glossary` and `/data` own
 * their own `PageHeader`; this one used to as well, which meant the header and
 * the map's own `useDocumentTitle` were two descriptions of one page in two
 * files. The map renders it, so the page title, the document title and the
 * search row are the same object.
 */
export default function ConceptMapPage() {
  return <ConceptMap />
}
