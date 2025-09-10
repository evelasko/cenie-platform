import { generatePathnames } from '../constants/structure'
import structure from '../constants/structure'

// Generate pathnames from the single source of truth structure
export const pathnames = generatePathnames(structure)
