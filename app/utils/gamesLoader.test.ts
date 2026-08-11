import { describe, expect, it } from 'vitest'
import {
  type GameEntry,
  buildGameUrl,
  loadRecentGames,
  parseGames,
  slugifyTitle,
  sortGamesByAcquisitionDesc,
  takeMostRecent,
} from './gamesLoader'

function buildGame(overrides: Partial<GameEntry> = {}): GameEntry {
  return {
    id: 'g1',
    date_acquisition: '2024-01-01',
    titre: 'Test Game',
    image_url: 'https://example.com/g1.png',
    ...overrides,
  }
}

describe('parseGames', () => {
  it('parses a valid file into a GameEntry array', () => {
    const games = parseGames({
      games: [
        { id: 'g1', date_acquisition: '2024-01-01', titre: 'A', image_url: 'https://example.com/a.png' },
        { id: 'g2', date_acquisition: '2024-02-01', titre: 'B', sous_titre: 'le retour', image_url: 'https://example.com/b.png' },
      ],
    })
    expect(games).toHaveLength(2)
    expect(games[0]!.id).toBe('g1')
    expect(games[1]!.sous_titre).toBe('le retour')
  })

  it('accepts entries without sous_titre (optional field)', () => {
    const games = parseGames({
      games: [{ id: 'g1', date_acquisition: '2024-01-01', titre: 'A', image_url: 'u' }],
    })
    expect(games[0]!.sous_titre).toBeUndefined()
  })

  it('throws on missing required fields (fail loud — operator fixes the data file)', () => {
    expect(() => parseGames({ games: [{ id: 'g1' }] })).toThrow()
  })
})

describe('sortGamesByAcquisitionDesc', () => {
  it('sorts newest first by date_acquisition string (ISO YYYY-MM-DD lexical = chronological)', () => {
    const games = [
      buildGame({ id: 'old', date_acquisition: '2023-01-01' }),
      buildGame({ id: 'new', date_acquisition: '2025-01-01' }),
      buildGame({ id: 'mid', date_acquisition: '2024-01-01' }),
    ]
    const sorted = sortGamesByAcquisitionDesc(games)
    expect(sorted.map(g => g.id)).toEqual(['new', 'mid', 'old'])
  })

  it('does not mutate the input array', () => {
    const games = [
      buildGame({ id: 'old', date_acquisition: '2023-01-01' }),
      buildGame({ id: 'new', date_acquisition: '2025-01-01' }),
    ]
    const snapshot = games.map(g => g.id)
    sortGamesByAcquisitionDesc(games)
    expect(games.map(g => g.id)).toEqual(snapshot)
  })
})

describe('takeMostRecent', () => {
  it('returns the N most recent entries in descending order', () => {
    const games = [
      buildGame({ id: 'a', date_acquisition: '2024-01-01' }),
      buildGame({ id: 'b', date_acquisition: '2024-02-01' }),
      buildGame({ id: 'c', date_acquisition: '2024-03-01' }),
      buildGame({ id: 'd', date_acquisition: '2024-04-01' }),
    ]
    expect(takeMostRecent(games, 2).map(g => g.id)).toEqual(['d', 'c'])
  })

  it('returns all games when count exceeds the list length', () => {
    const games = [
      buildGame({ id: 'a', date_acquisition: '2024-01-01' }),
      buildGame({ id: 'b', date_acquisition: '2024-02-01' }),
    ]
    expect(takeMostRecent(games, 10)).toHaveLength(2)
  })

  it('returns an empty array for count <= 0 (no negative slicing)', () => {
    const games = [buildGame()]
    expect(takeMostRecent(games, 0)).toEqual([])
    expect(takeMostRecent(games, -3)).toEqual([])
  })
})

describe('loadRecentGames (smoke — real fixture)', () => {
  it('returns the seed entries from games.json (sorted desc by date_acquisition)', () => {
    const games = loadRecentGames(10)
    expect(games.length).toBeGreaterThanOrEqual(1)
    for (const game of games) {
      expect(game.id).toBeTruthy()
      expect(game.titre).toBeTruthy()
      expect(typeof game.image_url).toBe('string')
    }
    const dates = games.map(g => g.date_acquisition)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })

  it('respects the count argument', () => {
    expect(loadRecentGames(2)).toHaveLength(Math.min(2, loadRecentGames(99).length))
  })
})

describe('slugifyTitle', () => {
  it('lowercases and dashes spaces', () => {
    expect(slugifyTitle('Les Aventuriers du Rail')).toBe('les-aventuriers-du-rail')
  })

  it('strips diacritics (French accents)', () => {
    expect(slugifyTitle('L\'Âge de Pierre')).toBe('l-age-de-pierre')
  })

  it('drops punctuation but keeps alphanumeric + dashes', () => {
    expect(slugifyTitle('Catan: Les Villes & Les Chevaliers')).toBe('catan-les-villes-les-chevaliers')
  })

  it('collapses repeated spaces and dashes', () => {
    expect(slugifyTitle('  multiple   spaces--and--dashes  ')).toBe('multiple-spaces-and-dashes')
  })

  it('returns empty string for input with no alphanumeric content', () => {
    expect(slugifyTitle('!!!')).toBe('')
  })
})

describe('buildGameUrl', () => {
  it('builds the canonical myLudo game URL from slug + id', () => {
    const game = buildGame({ id: '12345', titre: 'Les Aventuriers du Rail' })
    expect(buildGameUrl(game)).toBe('https://www.myludo.fr/#!/game/les-aventuriers-du-rail-12345')
  })

  it('handles French titles with accents', () => {
    const game = buildGame({ id: '42', titre: 'L\'Âge de Pierre' })
    expect(buildGameUrl(game)).toBe('https://www.myludo.fr/#!/game/l-age-de-pierre-42')
  })
})
