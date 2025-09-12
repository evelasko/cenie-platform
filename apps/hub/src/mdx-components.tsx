import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
  h1: ({ children }) => <h1 className="text-display-text-extra-large mb-4">{children}</h1>,
}

export function useMDXComponents(): MDXComponents {
  return components
}
