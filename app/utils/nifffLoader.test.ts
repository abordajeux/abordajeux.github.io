import { describe, expect, it } from 'vitest'
import {
  type NifffEditionEvent,
  buildGalleryItems,
  buildYearGalleryItems,
  highestEditionYear,
  loadNifffEditions,
  loadNifffLatest,
  parseEditionsFromGlob,
} from './nifffLoader'

function buildEvent(overrides: Partial<NifffEditionEvent> = {}): NifffEditionEvent {
  return {
    id: 'evt-1',
    title: 'Test Event',
    date: '2026-07-04',
    hours: ['13:00', '19:00'],
    image_path: 'nifff/2026/poster.jpeg',
    cardDescription: 'A test event',
    isPublic: true,
    prices: {},
    ...overrides,
  }
}

describe('parseEditionsFromGlob', () => {
  it('parses the year from the filename and keeps year_copyright + events', () => {
    const editions = parseEditionsFromGlob({
      '/src/app/data/nifff-2026.json': {
        year_copyright: 'Sauf mention contraire, © 2026',
        events: [{
          id: 'nifff-everyday',
          title: 'Jeux',
          date: '2026-07-04',
          hours: ['13:00'],
          image_path: 'nifff/2026/poster.jpeg',
          cardDescription: 'desc',
          isPublic: true,
          prices: {},
        }],
      },
    })
    expect(editions).toHaveLength(1)
    expect(editions[0]!.year).toBe(2026)
    expect(editions[0]!.year_copyright).toBe('Sauf mention contraire, © 2026')
    expect(editions[0]!.events).toHaveLength(1)
    expect(editions[0]!.events[0]!.image_path).toBe('nifff/2026/poster.jpeg')
  })

  it('excludes nifff-latest.json (not a 4-digit year)', () => {
    const editions = parseEditionsFromGlob({
      '/src/app/data/nifff-2026.json': { events: [] },
      '/src/app/data/nifff-latest.json': { events: [{ id: 'x', title: 't', hours: [], image_path: 'p', cardDescription: 'c', isPublic: true, prices: {} }] },
    })
    expect(editions).toHaveLength(1)
    expect(editions[0]!.year).toBe(2026)
  })

  it('sorts editions by year descending', () => {
    const editions = parseEditionsFromGlob({
      '/src/app/data/nifff-2025.json': { events: [] },
      '/src/app/data/nifff-2027.json': { events: [] },
      '/src/app/data/nifff-2026.json': { events: [] },
    })
    expect(editions.map(e => e.year)).toEqual([2027, 2026, 2025])
  })

  it('preserves gallery_images (polymorphic) and image_copyright', () => {
    const editions = parseEditionsFromGlob({
      '/src/app/data/nifff-2026.json': {
        events: [{
          id: 'e1',
          title: 't',
          hours: [],
          image_path: 'nifff/2026/poster.jpeg',
          cardDescription: 'c',
          image_copyright: ['© Affiche par X', 'https://x.example'],
          gallery_images: [
            'nifff/2026/photo1.jpg',
            { file: 'nifff/2026/photo2.jpg', copyright: ['© Jane', 'https://jane.example'] },
          ],
          isPublic: true,
          prices: {},
        }],
      },
    })
    const event = editions[0]!.events[0]!
    expect(event.image_copyright).toEqual(['© Affiche par X', 'https://x.example'])
    expect(event.gallery_images).toHaveLength(2)
    expect(event.gallery_images![0]).toBe('nifff/2026/photo1.jpg')
    expect(event.gallery_images![1]).toMatchObject({ file: 'nifff/2026/photo2.jpg', copyright: ['© Jane', 'https://jane.example'] })
  })

  it('accepts events with only the required fields', () => {
    const editions = parseEditionsFromGlob({
      '/src/app/data/nifff-2026.json': {
        events: [{
          id: 'min',
          title: 'Minimal',
          hours: [],
          image_path: 'p',
          cardDescription: 'c',
          isPublic: true,
          prices: {},
        }],
      },
    })
    expect(editions[0]!.events[0]!.gallery_images).toBeUndefined()
    expect(editions[0]!.events[0]!.image_copyright).toBeUndefined()
  })
})

describe('buildGalleryItems (pure flattening + orphan diff)', () => {
  it('emits a single poster item when the event has no gallery_images', () => {
    const items = buildGalleryItems([buildEvent()])
    expect(items).toEqual([{ image: 'nifff/2026/poster.jpeg' }])
  })

  it('carries the event image_copyright onto the poster item', () => {
    const items = buildGalleryItems([buildEvent({ image_copyright: ['© X', 'https://x.example'] })])
    expect(items[0]).toEqual({ image: 'nifff/2026/poster.jpeg', copyright: ['© X', 'https://x.example'] })
  })

  it('emits poster first then gallery_images in array order', () => {
    const items = buildGalleryItems([buildEvent({
      gallery_images: [
        'nifff/2026/photo1.jpg',
        'nifff/2026/photo2.jpg',
        'nifff/2026/photo3.jpg',
      ],
    })])
    expect(items.map(i => i.image)).toEqual([
      'nifff/2026/poster.jpeg',
      'nifff/2026/photo1.jpg',
      'nifff/2026/photo2.jpg',
      'nifff/2026/photo3.jpg',
    ])
  })

  it('does NOT inherit event image_copyright onto photos (no blanket inheritance)', () => {
    const items = buildGalleryItems([buildEvent({
      image_copyright: ['© Poster Artist', 'https://poster.example'],
      gallery_images: ['nifff/2026/photo1.jpg'],
    })])
    expect(items[0]).toHaveProperty('copyright')
    expect(items[1]).not.toHaveProperty('copyright')
  })

  it('attaches per-photo copyright override from object-form entries', () => {
    const items = buildGalleryItems([buildEvent({
      gallery_images: [
        'nifff/2026/no-credit.jpg',
        { file: 'nifff/2026/with-credit.jpg', copyright: ['© Jane', 'https://jane.example'] },
        { file: 'nifff/2026/object-no-credit.jpg' },
      ],
    })])
    expect(items[1]).not.toHaveProperty('copyright')
    expect(items[2]).toEqual({ image: 'nifff/2026/with-credit.jpg', copyright: ['© Jane', 'https://jane.example'] })
    expect(items[3]).not.toHaveProperty('copyright')
  })

  it('groups multiple events in data-file order', () => {
    const items = buildGalleryItems([
      buildEvent({ id: 'a', image_path: 'nifff/2026/a.jpg' }),
      buildEvent({ id: 'b', image_path: 'nifff/2026/b.jpg', gallery_images: ['nifff/2026/b1.jpg'] }),
    ])
    expect(items.map(i => i.image)).toEqual([
      'nifff/2026/a.jpg',
      'nifff/2026/b.jpg',
      'nifff/2026/b1.jpg',
    ])
  })

  it('appends unreferenced folder images as a final untitled batch (alphabetical)', () => {
    const items = buildGalleryItems(
      [buildEvent({ image_path: 'nifff/2026/poster.jpeg' })],
      ['nifff/2026/poster.jpeg', 'nifff/2026/zeta.jpg', 'nifff/2026/alpha.jpg', 'nifff/2026/mid.jpg'],
    )
    expect(items.map(i => i.image)).toEqual([
      'nifff/2026/poster.jpeg',
      'nifff/2026/alpha.jpg',
      'nifff/2026/mid.jpg',
      'nifff/2026/zeta.jpg',
    ])
    expect(items.slice(1).every(i => i.copyright === undefined)).toBe(true)
  })

  it('treats an image referenced by a gallery_images entry as non-orphan', () => {
    const items = buildGalleryItems(
      [buildEvent({ gallery_images: ['nifff/2026/photo.jpg'] })],
      ['nifff/2026/photo.jpg', 'nifff/2026/orphan.jpg'],
    )
    expect(items.map(i => i.image)).toEqual([
      'nifff/2026/poster.jpeg',
      'nifff/2026/photo.jpg',
      'nifff/2026/orphan.jpg',
    ])
  })

  it('dedupes orphan list against the same image referenced by multiple events', () => {
    const items = buildGalleryItems(
      [
        buildEvent({ id: 'a', image_path: 'nifff/2026/shared.jpg' }),
        buildEvent({ id: 'b', image_path: 'nifff/2026/shared.jpg' }),
      ],
      ['nifff/2026/shared.jpg', 'nifff/2026/orphan.jpg'],
    )
    expect(items.filter(i => i.image === 'nifff/2026/shared.jpg')).toHaveLength(2)
    expect(items.at(-1)!.image).toBe('nifff/2026/orphan.jpg')
  })

  it('returns an empty list for no events and no folder images', () => {
    expect(buildGalleryItems([], [])).toEqual([])
  })
})

describe('loadNifffEditions / loadNifffLatest / highestEditionYear (smoke — real fixtures)', () => {
  it('returns the 2026 edition migrated from programme.vue, with events in data-file order', () => {
    const editions = loadNifffEditions()
    expect(editions.length).toBeGreaterThanOrEqual(1)
    const edition2026 = editions.find(e => e.year === 2026)
    expect(edition2026).toBeDefined()
    expect(edition2026!.events.map(e => e.id)).toEqual([
      'nifff-everyday',
      'nifff-saturday',
      'nifff-sunday',
      'nifff-monday',
      'nifff-thursday',
    ])
  })

  it('preserves the operator-defined year_copyright string from the manifest', () => {
    const editions = loadNifffEditions()
    const edition2026 = editions.find(e => e.year === 2026)
    expect(edition2026).toBeDefined()
    expect(typeof edition2026!.year_copyright).toBe('string')
    expect(edition2026!.year_copyright!.length).toBeGreaterThan(0)
  })

  it('preserves the Serasuu credit on the Sunday event', () => {
    const editions = loadNifffEditions()
    const sunday = editions.find(e => e.year === 2026)!.events.find(e => e.id === 'nifff-sunday')!
    expect(sunday.image_copyright).toEqual(['© Affiche par Serasuu', 'https://www.instagram.com/serasuwu'])
  })

  it('uses nifff/2026/* paths for all affiches', () => {
    const editions = loadNifffEditions()
    const paths = editions.find(e => e.year === 2026)!.events.map(e => e.image_path)
    expect(paths.every(p => p.startsWith('nifff/2026/'))).toBe(true)
  })

  it('loadNifffLatest returns [] from the empty latest slot', () => {
    expect(loadNifffLatest()).toEqual([])
  })

  it('highestEditionYear returns 2026 (highest of the fixtures)', () => {
    expect(highestEditionYear()).toBe(2026)
  })
})

describe('buildYearGalleryItems (smoke — real fixtures + real image glob)', () => {
  it('emits events in data-file order with gallery_images after each poster, orphans at end', () => {
    const items = buildYearGalleryItems(2026)

    const affiches = items.filter(i => i.image.includes('nifff_affiche_'))
    expect(affiches.map(i => i.image)).toEqual([
      'nifff/2026/nifff_affiche_semaine.jpeg',
      'nifff/2026/nifff_affiche_samedi.jpeg',
      'nifff/2026/nifff_affiche_dimanche.jpeg',
      'nifff/2026/nifff_affiche_lundi.jpeg',
      'nifff/2026/nifff_affiche_jeudi.png',
    ])

    const gaiaIndex = items.findIndex(i => i.image === 'nifff/2026/gaia.jpg')
    const samediIndex = items.findIndex(i => i.image === 'nifff/2026/nifff_affiche_samedi.jpeg')
    const dimancheIndex = items.findIndex(i => i.image === 'nifff/2026/nifff_affiche_dimanche.jpeg')
    expect(gaiaIndex).toBeGreaterThan(samediIndex)
    expect(gaiaIndex).toBeLessThan(dimancheIndex)

    const thursdayIndex = items.findIndex(i => i.image === 'nifff/2026/nifff_affiche_jeudi.png')
    const orphans = items.slice(thursdayIndex + 1)
    for (const orphan of orphans) {
      expect(orphan.copyright).toBeUndefined()
      expect(orphan.image.startsWith('nifff/2026/')).toBe(true)
    }
    const orphanNames = orphans.map(i => i.image)
    expect([...orphanNames].sort()).toEqual(orphanNames)
  })

  it('attaches the Serasuu credit only to the Sunday affiche (per-image, no inheritance)', () => {
    const items = buildYearGalleryItems(2026)
    const withCredit = items.filter(i => i.copyright !== undefined)
    expect(withCredit).toHaveLength(1)
    expect(withCredit[0]!.image).toBe('nifff/2026/nifff_affiche_dimanche.jpeg')
    expect(withCredit[0]!.copyright).toEqual(['© Affiche par Serasuu', 'https://www.instagram.com/serasuwu'])
  })

  it('returns [] for an unknown year', () => {
    expect(buildYearGalleryItems(1999)).toEqual([])
  })
})
