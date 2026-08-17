import * as v from 'valibot'
import artistsRaw from '~/data/artists.json'
import videosRaw from '~/data/videos.json'

export interface ArtistCredit {
  name: string
  contribution: string
  link?: string
  image?: string
}

export type VideoKind = 'youtube' | 'instagram'

export interface CreditVideo {
  kind: VideoKind
  id: string
  title: string
  thumbnail?: string
  featured?: boolean
}

const artistSchema = v.object({
  name: v.string(),
  contribution: v.string(),
  link: v.optional(v.string()),
  image: v.optional(v.string()),
})

const videoSchema = v.object({
  kind: v.picklist(['youtube', 'instagram']),
  id: v.string(),
  title: v.string(),
  thumbnail: v.optional(v.string()),
  featured: v.optional(v.boolean()),
})

export function parseArtists(raw: unknown): ArtistCredit[] {
  return v.parse(v.array(artistSchema), raw) as ArtistCredit[]
}

export function parseVideos(raw: unknown): CreditVideo[] {
  return v.parse(v.array(videoSchema), raw) as CreditVideo[]
}

export function loadArtists(): ArtistCredit[] {
  return parseArtists(artistsRaw)
}

export function loadVideos(): CreditVideo[] {
  return parseVideos(videosRaw)
}

export function videoUrl(video: CreditVideo): string {
  if (video.kind === 'youtube') {
    return `https://www.youtube.com/watch?v=${video.id}`
  }
  return `https://www.instagram.com/reel/${video.id}/`
}

export function videoProviderLabel(video: CreditVideo): string {
  return video.kind === 'youtube' ? 'YouTube' : 'Instagram'
}
