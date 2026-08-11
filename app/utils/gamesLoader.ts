import * as v from 'valibot'
import gamesRaw from '~/data/games.json'

export interface GameEntry {
  id: string
  date_acquisition: string
  titre: string
  sous_titre?: string
  image_url: string
}

const gameSchema = v.object({
  id: v.string(),
  date_acquisition: v.string(),
  titre: v.string(),
  sous_titre: v.optional(v.string()),
  image_url: v.string(),
})

const gamesFileSchema = v.object({
  games: v.array(gameSchema),
})

export function parseGames(raw: unknown): GameEntry[] {
  const parsed = v.parse(gamesFileSchema, raw) as { games: GameEntry[] }
  return parsed.games
}

export function sortGamesByAcquisitionDesc(games: GameEntry[]): GameEntry[] {
  return [...games].sort((first, second) => second.date_acquisition.localeCompare(first.date_acquisition))
}

export function takeMostRecent(games: GameEntry[], count: number): GameEntry[] {
  return sortGamesByAcquisitionDesc(games).slice(0, Math.max(0, count))
}

export function loadRecentGames(count: number): GameEntry[] {
  return takeMostRecent(parseGames(gamesRaw), count)
}

export function slugifyTitle(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildGameUrl(game: GameEntry): string {
  return `https://www.myludo.fr/#!/game/${slugifyTitle(game.titre)}-${game.id}`
}
