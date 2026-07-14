import { describe, expect, it } from 'vitest'
import { resolveFile, resolveImage } from './assetLinksResolver'

describe('resolveImage', () => {
  it('returns an empty string for undefined input', () => {
    expect(resolveImage(undefined)).toBe('')
  })

  it('returns an empty string for empty input', () => {
    expect(resolveImage('')).toBe('')
  })

  it('passes through external http(s) URLs unchanged', () => {
    expect(resolveImage('https://example.com/logo.png')).toBe('https://example.com/logo.png')
    expect(resolveImage('http://example.com/logo.png')).toBe('http://example.com/logo.png')
  })
})

describe('resolveFile', () => {
  it('returns an empty string for undefined input', () => {
    expect(resolveFile(undefined)).toBe('')
  })

  it('passes through external URLs unchanged', () => {
    expect(resolveFile('https://example.com/doc.pdf')).toBe('https://example.com/doc.pdf')
  })
})
