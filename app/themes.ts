export type ProjectThemeKey =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'bg'
  | 'text'

export type ProjectTheme = Partial<Record<ProjectThemeKey, string>>

export const THEME_TOKEN_VAR: Record<ProjectThemeKey, string> = {
  primary: '--ui-primary',
  secondary: '--ui-secondary',
  neutral: '--ui-neutral',
  success: '--ui-success',
  warning: '--ui-warning',
  error: '--ui-error',
  bg: '--page-bg',
  text: '--ui-text',
}

export const projectThemes: Record<string, ProjectTheme> = {
  presque: {
    primary: '#9f1239',
    secondary: '#b45309',
    bg: '#f5e9d4',
  },
  nifff: {
    primary: '#7c3aed',
    secondary: '#0e7490',
    bg: '#ede4d3',
  },
}

export function themeToCssVars(theme?: ProjectTheme): Record<string, string> {
  if (!theme) {
    return {}
  }
  return Object.fromEntries(
    (Object.entries(theme) as [string, string][])
      .filter(([key]) => key in THEME_TOKEN_VAR)
      .map(([key, value]) => [THEME_TOKEN_VAR[key as ProjectThemeKey], value]),
  )
}
