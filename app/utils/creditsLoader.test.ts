import { describe, expect, it } from 'vitest'
import {
  type CreditVideo,
  loadArtists,
  loadVideos,
  parseArtists,
  parseVideos,
  videoProviderLabel,
  videoUrl,
} from './creditsLoader'

function buildVideo(overrides: Partial<CreditVideo> = {}): CreditVideo {
  return {
    kind: 'youtube',
    id: 'abc123',
    title: 'Une vidéo',
    ...overrides,
  }
}

describe('parseArtists', () => {
  it('parses required fields and keeps optional fields undefined', () => {
    const artists = parseArtists([
      { name: 'Serasuu', contribution: 'Affiche du NIFFF 2026', link: 'https://www.instagram.com/serasuwu' },
    ])
    expect(artists).toHaveLength(1)
    expect(artists[0]!.name).toBe('Serasuu')
    expect(artists[0]!.contribution).toBe('Affiche du NIFFF 2026')
    expect(artists[0]!.link).toBe('https://www.instagram.com/serasuwu')
    expect(artists[0]!.image).toBeUndefined()
  })

  it('accepts optional image and omits link', () => {
    const artists = parseArtists([{ name: 'X', contribution: 'Logo', image: 'Logo-new.png' }])
    expect(artists[0]!.image).toBe('Logo-new.png')
    expect(artists[0]!.link).toBeUndefined()
  })

  it('rejects an entry missing a required field', () => {
    expect(() => parseArtists([{ contribution: 'pas de nom' }])).toThrow()
  })

  it('rejects non-array input', () => {
    expect(() => parseArtists({ name: 'X' })).toThrow()
  })
})

describe('parseVideos', () => {
  it('parses youtube and instagram entries with optional fields', () => {
    const videos = parseVideos([
      { kind: 'youtube', id: 'abc123', title: 'Long', featured: true },
      { kind: 'instagram', id: 'xyz789', title: 'Short', thumbnail: 'videos/short.jpg' },
    ])
    expect(videos[0]).toMatchObject({ kind: 'youtube', id: 'abc123', featured: true })
    expect(videos[0]!.thumbnail).toBeUndefined()
    expect(videos[1]).toMatchObject({ kind: 'instagram', id: 'xyz789', thumbnail: 'videos/short.jpg' })
    expect(videos[1]!.featured).toBeUndefined()
  })

  it('rejects an unknown kind', () => {
    expect(() => parseVideos([{ kind: 'vimeo', id: 'x', title: 't' }])).toThrow()
  })
})

describe('videoUrl', () => {
  it('builds a YouTube watch URL', () => {
    expect(videoUrl(buildVideo({ kind: 'youtube', id: 'abc123' }))).toBe('https://www.youtube.com/watch?v=abc123')
  })

  it('builds an Instagram reel URL', () => {
    expect(videoUrl(buildVideo({ kind: 'instagram', id: 'xyz789' }))).toBe('https://www.instagram.com/reel/xyz789/')
  })
})

describe('videoProviderLabel', () => {
  it('labels each provider', () => {
    expect(videoProviderLabel(buildVideo({ kind: 'youtube' }))).toBe('YouTube')
    expect(videoProviderLabel(buildVideo({ kind: 'instagram' }))).toBe('Instagram')
  })
})

describe('real fixtures', () => {
  it('loads artists with non-empty names and contributions', () => {
    const artists = loadArtists()
    expect(artists.length).toBeGreaterThan(0)
    for (const artist of artists) {
      expect(artist.name.length).toBeGreaterThan(0)
      expect(artist.contribution.length).toBeGreaterThan(0)
    }
  })

  it('loads videos with non-empty ids/titles and at most one featured entry', () => {
    const videos = loadVideos()
    expect(videos.length).toBeGreaterThan(0)
    expect(videos.filter(video => video.featured).length).toBeLessThanOrEqual(1)
    for (const video of videos) {
      expect(video.id.length).toBeGreaterThan(0)
      expect(video.title.length).toBeGreaterThan(0)
    }
  })
})
