import { generateNavigationItems } from './structure'
import structure from './structure'

// Generate navigation items from the single source of truth structure
export const mainNavigationItems = generateNavigationItems(structure, 'main')

export const footerNavigationItems = generateNavigationItems(structure, 'footer')

export const legalNavigationItems = generateNavigationItems(structure, 'legal')
