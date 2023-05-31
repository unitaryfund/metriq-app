import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

export function renderLatex(text) {
  const regex = /\$(.*?)\$/g // Matches LaTeX expressions wrapped in $ symbols
  const parts = text.split(regex)
  const renderError = (error) => <span className="latex-error">Invalid LaTeX syntax: {error.message}</span>

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) { // Non-LaTeX content
          return part
        } else { // LaTeX content
          return <InlineMath math={part} renderError={renderError} />
        }
      })}
    </>
  )
}