import { describe, expect, it } from 'vitest'
import { projectThemes, themeToCssVars } from './themes'

describe('themeToCssVars', () => {
  it('maps friendly keys to --ui-* CSS variables', () => {
    expect(themeToCssVars({ primary: '#fff', bg: '#000' })).toEqual({
      '--ui-primary': '#fff',
      '--page-bg': '#000',
    })
  })

  it('maps all 8 tokens', () => {
    const vars = themeToCssVars({
      primary: 'p',
      secondary: 's',
      neutral: 'n',
      success: 'su',
      warning: 'w',
      error: 'e',
      bg: 'b',
      text: 't',
    })
    expect(Object.keys(vars)).toHaveLength(8)
    expect(vars).toEqual({
      '--ui-primary': 'p',
      '--ui-secondary': 's',
      '--ui-neutral': 'n',
      '--ui-success': 'su',
      '--ui-warning': 'w',
      '--ui-error': 'e',
      '--page-bg': 'b',
      '--ui-text': 't',
    })
  })

  it('returns empty for undefined/empty theme (reset path)', () => {
    expect(themeToCssVars(undefined)).toEqual({})
    expect(themeToCssVars({})).toEqual({})
  })

  it('ignores unknown keys defensively', () => {
    expect(
      themeToCssVars({ primary: '#fff', bogus: 'x' } as Record<string, string>),
    ).toEqual({ '--ui-primary': '#fff' })
  })
})

describe('projectThemes seed', () => {
  it('defines a presque theme with a distinct primary', () => {
    expect(projectThemes.presque?.primary).toBeTruthy()
    expect(projectThemes.presque?.primary).not.toBe('#05037a')
  })

  it('defines a nifff theme with a distinct primary', () => {
    expect(projectThemes.nifff?.primary).toBeTruthy()
    expect(projectThemes.nifff?.primary).not.toBe('#05037a')
  })
})

describe('apply mechanism on documentElement', () => {
  it('writes theme vars as inline styles and removes them on reset', () => {
    const root = document.documentElement
    const vars = themeToCssVars(projectThemes.presque)

    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value)
    }
    expect(root.style.getPropertyValue('--ui-primary')).toBe(projectThemes.presque!.primary)

    for (const name of Object.keys(vars)) {
      root.style.removeProperty(name)
    }
    expect(root.style.getPropertyValue('--ui-primary')).toBe('')
  })
})
