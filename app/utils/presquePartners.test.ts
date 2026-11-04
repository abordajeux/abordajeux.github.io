import { describe, expect, it } from 'vitest'
import { loadPresquePartners, parsePresquePartners } from './presquePartners'

describe('parsePresquePartners', () => {
  it('parses sponsors and partners with all fields', () => {
    const parsed = parsePresquePartners({
      sponsors: [{ name: 'Sponsor Exemple', logo: 'presque/logos/sponsor_exemple.svg' }],
      partners: [{
        name: 'Partenaire Exemple',
        logo: 'presque/logos/partenaire_exemple.svg',
        description: 'Un petit texte.',
        website: 'https://www.exemple.ch',
      }],
    })
    expect(parsed.sponsors).toHaveLength(1)
    expect(parsed.sponsors[0]).toMatchObject({ name: 'Sponsor Exemple', logo: 'presque/logos/sponsor_exemple.svg' })
    expect(parsed.partners).toHaveLength(1)
    expect(parsed.partners[0]).toMatchObject({ name: 'Partenaire Exemple', website: 'https://www.exemple.ch' })
  })

  it('accepts empty lists', () => {
    const parsed = parsePresquePartners({ sponsors: [], partners: [] })
    expect(parsed.sponsors).toHaveLength(0)
    expect(parsed.partners).toHaveLength(0)
  })

  it('rejects a partner website without a full URL', () => {
    expect(() => parsePresquePartners({
      sponsors: [],
      partners: [{ name: 'X', logo: 'x.svg', description: 'texte', website: 'www.exemple.ch' }],
    })).toThrow()
  })

  it('rejects a sponsor missing a logo', () => {
    expect(() => parsePresquePartners({
      sponsors: [{ name: 'X' }],
      partners: [],
    })).toThrow()
  })

  it('rejects non-object input', () => {
    expect(() => parsePresquePartners([])).toThrow()
  })
})

describe('real fixtures', () => {
  it('loads partners with non-empty names and logos', () => {
    const partners = loadPresquePartners()
    for (const sponsor of partners.sponsors) {
      expect(sponsor.name.length).toBeGreaterThan(0)
      expect(sponsor.logo.length).toBeGreaterThan(0)
    }
    for (const partner of partners.partners) {
      expect(partner.name.length).toBeGreaterThan(0)
      expect(partner.logo.length).toBeGreaterThan(0)
      expect(partner.description.length).toBeGreaterThan(0)
      expect(partner.website.startsWith('https://')).toBe(true)
    }
  })
})
