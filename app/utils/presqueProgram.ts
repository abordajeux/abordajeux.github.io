import * as v from 'valibot'
import { resolveImage } from './assetLinksResolver'

export const PRESQUE_PLACEHOLDER_IMAGE = 'placeholder.png'
export const PRESQUE_PLACEHOLDER_IMAGE_COPYRIGHT: [string, string] = [
  '© placeholder par JonGriffon',
  'https://jongriffon.carrd.co/#tosfr',
]
export const PRESQUE_DEFAULT_IMAGE_COPYRIGHT: [string, string] = ['À L\'Abordajeux', '/credits']

export type PresqueCategory = 'jdr' | 'jds'

export const PRESQUE_EVENT_COLOR_VARS = [
  '--presque-gros-jeux',
  '--presque-jdr',
  '--presque-partenaires',
  '--presque-tournois',
  '--presque-activites-association',
] as const

export type PresqueEventColor = typeof PRESQUE_EVENT_COLOR_VARS[number]

export type PresquePrizes = string | Record<string, string>

export interface PresqueActivity {
  id: string
  title: string
  category: PresqueCategory
  color?: PresqueEventColor
  start: string
  end: string
  max_participants: number
  short_description?: string
  game?: string
  pre_img_description?: string[]
  post_img_description?: string[]
  organizer?: [string, string]
  image_path?: string
  image_copyright?: [string, string]
  prizes?: PresquePrizes
}

export interface PresqueProgramTabs {
  jdr: PresqueActivity[]
  jds: PresqueActivity[]
}

const stringList = v.optional(v.array(v.string()))
const labelLink = v.optional(v.tuple([v.string(), v.string()]))
const prizeWall = v.pipe(
  v.unknown(),
  v.rawCheck(({ dataset, addIssue }) => {
    if (Array.isArray(dataset.value)) {
      addIssue({ message: 'prizes must be a phrase or a rank map, not an array' })
    }
  }),
  v.record(v.string(), v.string()),
)
const prizes = v.optional(v.union([v.string(), prizeWall]))

const activitySchema = v.object({
  id: v.string(),
  title: v.string(),
  category: v.picklist(['jdr', 'jds']),
  color: v.optional(v.picklist(PRESQUE_EVENT_COLOR_VARS)),
  start: v.string(),
  end: v.string(),
  max_participants: v.number(),
  short_description: v.optional(v.string()),
  game: v.optional(v.string()),
  pre_img_description: stringList,
  post_img_description: stringList,
  organizer: labelLink,
  image_path: v.optional(v.string()),
  image_copyright: labelLink,
  prizes,
})

const programmeSchema = v.object({
  activities: v.array(v.unknown()),
})

function describeEntry(entry: unknown): string {
  if (typeof entry === 'object' && entry !== null) {
    const candidate = entry as { id?: unknown, title?: unknown }
    if (typeof candidate.id === 'string') {
      return candidate.id
    }
    if (typeof candidate.title === 'string') {
      return candidate.title
    }
  }
  return 'entrée inconnue'
}

export function parsePresqueProgram(
  raw: unknown,
  onWarning?: (message: string) => void,
): PresqueActivity[] {
  const parsed = v.safeParse(programmeSchema, raw)
  if (!parsed.success) {
    onWarning?.('Le programme reçu est illisible.')
    return []
  }
  const activities: PresqueActivity[] = []
  for (const entry of parsed.output.activities) {
    const result = v.safeParse(activitySchema, entry)
    if (result.success) {
      activities.push(result.output as PresqueActivity)
    } else {
      onWarning?.(`Activité ignorée (${describeEntry(entry)}) : données invalides.`)
    }
  }
  return activities
}

export function sortByStart(activities: PresqueActivity[]): PresqueActivity[] {
  return [...activities].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  )
}

export function splitByCategory(activities: PresqueActivity[]): PresqueProgramTabs {
  return {
    jdr: sortByStart(activities.filter(activity => activity.category === 'jdr')),
    jds: sortByStart(activities.filter(activity => activity.category === 'jds')),
  }
}

export interface PresqueDayGroup {
  key: string
  label: string
  activities: PresqueActivity[]
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function dayLabel(date: Date): string {
  const formatted = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function groupByDay(activities: PresqueActivity[]): PresqueDayGroup[] {
  const groups: PresqueDayGroup[] = []
  for (const activity of sortByStart(activities)) {
    const start = new Date(activity.start)
    const key = dayKey(start)
    const last = groups[groups.length - 1]
    if (last && last.key === key) {
      last.activities.push(activity)
    } else {
      groups.push({ key, label: dayLabel(start), activities: [activity] })
    }
  }
  return groups
}

const TINT_CLASS_BY_COLOR: Record<PresqueEventColor, string> = {
  '--presque-gros-jeux': 'presque-tint-gros-jeux',
  '--presque-jdr': 'presque-tint-jdr',
  '--presque-partenaires': 'presque-tint-partenaires',
  '--presque-tournois': 'presque-tint-tournois',
  '--presque-activites-association': 'presque-tint-activites-association',
}

export function activityColorVar(activity: PresqueActivity): PresqueEventColor {
  if (activity.color) {
    return activity.color
  }
  return activity.category === 'jdr' ? '--presque-jdr' : '--presque-gros-jeux'
}

export function activityTintClass(activity: PresqueActivity): string {
  return TINT_CLASS_BY_COLOR[activityColorVar(activity)]
}

export interface PresqueActivityImage {
  src: string
  copyright: [string, string]
}

export function getActivityImage(activity: PresqueActivity): PresqueActivityImage {
  const src = resolveImage(activity.image_path)
  if (src === '') {
    return {
      src: resolveImage(PRESQUE_PLACEHOLDER_IMAGE),
      copyright: PRESQUE_PLACEHOLDER_IMAGE_COPYRIGHT,
    }
  }
  return {
    src,
    copyright: activity.image_copyright ?? PRESQUE_DEFAULT_IMAGE_COPYRIGHT,
  }
}

export function formatPresqueSchedule(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const weekday = (date: Date) =>
    new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date)
  const time = (date: Date) =>
    new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date)
  const sameDay = startDate.toDateString() === endDate.toDateString()
  if (sameDay) {
    return `${weekday(startDate)} de ${time(startDate)} à ${time(endDate)}`
  }
  return `De ${weekday(startDate)} ${time(startDate)} à ${weekday(endDate)} ${time(endDate)}`
}

export function getDeepLinkId(queryValue: unknown): string {
  if (typeof queryValue === 'string' && queryValue !== '') {
    return queryValue
  }
  if (Array.isArray(queryValue)) {
    const first = queryValue.find(entry => typeof entry === 'string' && entry !== '')
    return first ?? ''
  }
  return ''
}
