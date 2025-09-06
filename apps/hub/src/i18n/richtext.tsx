import { type RichTagsFunction } from 'next-intl'

const richtextSolver: Record<string, string | number | Date | RichTagsFunction> | undefined = {
  subtext: (chunks) => <span className="text-subtext-color">{' ' + chunks}</span>,
}

export default richtextSolver
