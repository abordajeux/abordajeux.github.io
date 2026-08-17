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

  it('rejects path traversal with a leading ..', () => {
    expect(resolveImage('../secret.png')).toBe('')
  })

  it('rejects path traversal via an intermediate .. segment', () => {
    expect(resolveImage('nifff/../img_calendar.png')).toBe('')
    expect(resolveImage('nifff/2026/../../img_calendar.png')).toBe('')
  })

  it('rejects path traversal with a trailing .. segment', () => {
    expect(resolveImage('nifff/..')).toBe('')
    expect(resolveImage('foo/bar/..')).toBe('')
  })

  it('still resolves real flat-path and nested-path images (no false positives)', () => {
    expect(resolveImage('event_mercredi.jpeg')).not.toBe('')
    expect(resolveImage('nifff/2026/nifff_affiche_semaine.jpeg')).not.toBe('')
    expect(resolveImage('videos/dungeon_lords_longue.jpg')).not.toBe('')
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
