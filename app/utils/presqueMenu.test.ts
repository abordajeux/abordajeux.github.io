import { describe, expect, it } from 'vitest'
import { formatMenuItemPrice, loadPresqueMenu, parsePresqueMenu } from './presqueMenu'

describe('parsePresqueMenu', () => {
  it('parses sections with items and keeps optional fields undefined', () => {
    const sections = parsePresqueMenu([
      {
        title: 'À manger',
        icon: 'i-lucide-utensils',
        items: [
          { name: 'Tarte maison', description: 'Exemple', price: 3 },
          { name: 'Soupe du jour', price: 4 },
        ],
      },
      { title: 'À boire', items: [{ name: 'Thé / café' }] },
    ])
    expect(sections).toHaveLength(2)
    expect(sections[0]!.items[0]).toMatchObject({ name: 'Tarte maison', price: 3 })
    expect(sections[0]!.items[1]!.description).toBeUndefined()
    expect(sections[1]!.icon).toBeUndefined()
    expect(sections[1]!.items[0]!.price).toBeUndefined()
  })

  it('accepts empty sections', () => {
    expect(parsePresqueMenu([])).toHaveLength(0)
  })

  it('rejects an item missing a name', () => {
    expect(() => parsePresqueMenu([{ title: 'X', items: [{ price: 2 }] }])).toThrow()
  })

  it('rejects non-array input', () => {
    expect(() => parsePresqueMenu({ title: 'X' })).toThrow()
  })
})

describe('formatMenuItemPrice', () => {
  it('formats zero as free', () => {
    expect(formatMenuItemPrice(0)).toBe('gratuit')
  })

  it('formats prices in CHF', () => {
    expect(formatMenuItemPrice(3)).toBe('3 CHF')
    expect(formatMenuItemPrice(4.5)).toBe('4.5 CHF')
  })
})

describe('real fixtures', () => {
  it('loads sections with non-empty titles and item names', () => {
    const sections = loadPresqueMenu()
    expect(sections.length).toBeGreaterThan(0)
    for (const section of sections) {
      expect(section.title.length).toBeGreaterThan(0)
      expect(section.items.length).toBeGreaterThan(0)
      for (const item of section.items) {
        expect(item.name.length).toBeGreaterThan(0)
      }
    }
  })
})
