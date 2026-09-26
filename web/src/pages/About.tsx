import { Link } from 'react-router-dom'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { PageHeader } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle(
    'About & sources',
    'What is in this course, how the repository is organised, and where the material comes from.',
  )
  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="About"
        title="About this course"
        description="A written course, a simulator, and a real-data explorer, kept in one repository so the notes and the tools stay in step."
      />

      <section className="prose-lecture">
        <h2>What is here</h2>
        <p>
          {LECTURES.length} lectures of notes, interactive tools woven into the lectures that
          introduce them, {CASE_STUDIES.length} crisis case studies, and a data explorer over US
          macro series. Every lecture opens with a prediction prompt and closes with a quiz, and your
          progress is stored locally in the browser.
        </p>

        <h2>Repository layout</h2>
        <ul>
          <li>
            <code>content/</code> — the source of truth: lecture notes, transcripts,{' '}
            <code>lectures.ts</code> metadata, and the glossary.
          </li>
          <li>
            <code>web/</code> — the Vite + React + TypeScript site deployed to GitHub Pages.
          </li>
          <li>
            <code>analysis/</code> — Python analysis and the data export pipeline.
          </li>
          <li>
            <code>data/</code> and <code>assets/</code> — datasets, the compiled PDF, and charts.
          </li>
        </ul>

        <h2>Running it locally</h2>
        <pre>
          <code>{`npm install --prefix web
npm run dev            # http://localhost:5173/macro-economics/
npm run test           # vitest
npm run build          # type-check and build`}</code>
        </pre>

        <h2>Contributing</h2>
        <p>
          To add a lecture, drop a Markdown file in <code>content/lecture_notes/</code> and add an
          entry to <code>content/lectures.ts</code>. To add a tool, see{' '}
          <code>CONTRIBUTING.md</code>. The full compiled notes are available as{' '}
          <a href={`${import.meta.env.BASE_URL}All_Lecture_Notes.pdf`}>a PDF</a>.
        </p>

        <h2>Sources and attribution</h2>
        <p>
          The lecture sequence follows the MIT OpenCourseWare macroeconomics series (the playlist is
          listed in <code>content/lectures.txt</code>), with notes written from the lecture
          transcripts and the standard intermediate textbook treatment. The interactive tools,
          design, and code are original.
        </p>

        <h2>License</h2>
        <p>
          Released under the MIT License. See <code>LICENSE</code> in the repository.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Link to="/syllabus" className="button button-primary no-underline">
          Syllabus
        </Link>
        <Link to="/tools" className="button button-secondary no-underline">
          Tools
        </Link>
        <Link to="/concepts" className="button button-secondary no-underline">
          Concept map
        </Link>
      </div>
    </div>
  )
}
