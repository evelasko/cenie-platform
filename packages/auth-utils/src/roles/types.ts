import type { APP_ROLES } from './constants'

export type AppName = 'hub' | 'editorial' | 'academy' | 'agency'

export type HubRole = (typeof APP_ROLES.hub)[number]
export type EditorialRole = (typeof APP_ROLES.editorial)[number]
export type AcademyRole = (typeof APP_ROLES.academy)[number]
export type AgencyRole = (typeof APP_ROLES.agency)[number]

export type AppRole<T extends AppName> = T extends 'hub'
  ? HubRole
  : T extends 'editorial'
    ? EditorialRole
    : T extends 'academy'
      ? AcademyRole
      : T extends 'agency'
        ? AgencyRole
        : never

export type AnyRole = HubRole | EditorialRole | AcademyRole | AgencyRole

