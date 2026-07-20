import * as v from 'valibot'
import latestRaw from '~/data/nifff-latest.json'

const stringList = v.optional(v.array(v.string()))
const copyright = v.optional(v.tuple([v.string(), v.string()]))
const galleryImageSchema = v.union([
  v.string(),
  v.object({
    file: v.string(),
    copyright,
  }),
])

export type NifffGalleryImageEntry = string | { file: string, copyright?: [string, string] }

export interface NifffEditionEvent {
  id: string
  title: string
  date?: string
  hours: string[]
  image_path: string
  cardDescription: string
  image_copyright?: [string, string]
  gallery_images?: NifffGalleryImageEntry[]
  pre_img_description?: string[]
  post_img_description?: string[]
  organizer?: string
  isPublic: boolean
  prices: Record<string, number>
  external_link?: string[]
}

export interface NifffEdition {
  year: number
  year_copyright?: string
  events: NifffEditionEvent[]
}

export interface NifffGalleryItem {
  image: string
  copyright?: [string, string]
}

const editionEventSchema = v.object({
  id: v.string(),
  title: v.string(),
  date: v.optional(v.string()),
  hours: v.array(v.string()),
  image_path: v.string(),
  cardDescription: v.string(),
  image_copyright: copyright,
  gallery_images: v.optional(v.array(galleryImageSchema)),
  pre_img_description: stringList,
  post_img_description: stringList,
  organizer: v.optional(v.string()),
  isPublic: v.boolean(),
  prices: v.record(v.string(), v.number()),
  external_link: stringList,
})

const editionFileSchema = v.object({
  year_copyright: v.optional(v.string()),
  events: v.array(editionEventSchema),
})

type EditionFile = { year_copyright?: string, events: NifffEditionEvent[] }

const EDITION_FILENAME = /nifff-(\d{4})\.json$/

export function parseEditionsFromGlob(files: Record<string, unknown>): NifffEdition[] {
  const editions: NifffEdition[] = []
  for (const [path, raw] of Object.entries(files)) {
    const match = path.match(EDITION_FILENAME)
    if (match) {
      const year = Number(match[1])
      const parsed = v.parse(editionFileSchema, raw) as EditionFile
      editions.push({ year, year_copyright: parsed.year_copyright, events: parsed.events })
    }

  }
  return editions.sort((first, second) => second.year - first.year)
}

const editionFiles = import.meta.glob<unknown>('~/data/nifff-*.json', { eager: true, import: 'default' })

export function loadNifffEditions(): NifffEdition[] {
  return parseEditionsFromGlob(editionFiles)
}

export function loadNifffLatest(): NifffEditionEvent[] {
  const parsed = v.parse(editionFileSchema, latestRaw) as EditionFile
  return parsed.events
}

export function highestEditionYear(): number | undefined {
  return loadNifffEditions()[0]?.year
}

type NormalizedGalleryImage = { file: string, copyright?: [string, string] }

function normalizeGalleryImage(entry: NifffGalleryImageEntry): NormalizedGalleryImage {
  return typeof entry === 'string' ? { file: entry } : { file: entry.file, copyright: entry.copyright }
}

export function buildGalleryItems(events: NifffEditionEvent[], folderImages: string[] = []): NifffGalleryItem[] {
  const items: NifffGalleryItem[] = []
  const referenced = new Set<string>()
  for (const event of events) {
    const poster: NifffGalleryItem = { image: event.image_path }
    if (event.image_copyright) {
      poster.copyright = event.image_copyright
    }
    items.push(poster)
    referenced.add(event.image_path)
    for (const raw of event.gallery_images ?? []) {
      const entry = normalizeGalleryImage(raw)
      const photo: NifffGalleryItem = { image: entry.file }
      if (entry.copyright) {
        photo.copyright = entry.copyright
      }
      items.push(photo)
      referenced.add(entry.file)
    }
  }
  const orphans = folderImages
    .filter(image => !referenced.has(image))
    .sort((first, second) => first.localeCompare(second))
  for (const orphan of orphans) {
    items.push({ image: orphan })
  }
  return items
}

const imageGlob = import.meta.glob('~/assets/images/nifff/**/*.{jpg,jpeg,png,webp,avif}')

const NIFFF_IMAGE_PATH = /nifff\/\d{4}\/[^/]+$/

function extractImagePath(globKey: string): string | undefined {
  const match = globKey.match(NIFFF_IMAGE_PATH)
  return match ? match[0] : undefined
}

function listYearImagePaths(year: number): string[] {
  const prefix = `nifff/${year}/`
  return Object.keys(imageGlob)
    .map(extractImagePath)
    .filter((path): path is string => path != null && path.startsWith(prefix))
}

export function buildYearGalleryItems(year: number): NifffGalleryItem[] {
  const edition = loadNifffEditions().find(entry => entry.year === year)
  if (!edition) {
    return []
  }
  return buildGalleryItems(edition.events, listYearImagePaths(year))
}
