import { RRule } from 'rrule'
import * as v from 'valibot'
import type { baseEvent, datedEvent } from '~/types/navigation'
import recurringRaw from '~/data/recurring.json'
import oneOffRaw from '~/data/one-off.json'

export const ASSOCIATION_LOCAL_ADDRESS = 'Rue de la gare 4, 2034 Peseux'

export type EventCategory =
  | 'local-open'
  | 'local-closed'
  | 'external-open'
  | 'external-closed'
  | 'cancelled'
  | 'reservation'

export type CalendarEvent = datedEvent & { cancelled?: boolean, cancelReason?: string }

const stringList = v.optional(v.array(v.string()))
const copyright = v.optional(v.tuple([v.string(), v.string()]))

const recurringSchema = v.object({
  id: v.string(),
  title: v.string(),
  rrule: v.string(),
  hours: v.array(v.string()),
  isPublic: v.boolean(),
  location: v.optional(v.string()),
  coordinates: v.optional(v.string()),
  image_path: v.optional(v.string()),
  image_copyright: copyright,
  pre_img_description: stringList,
  post_img_description: stringList,
  external_link: stringList,
  organizer: v.optional(v.string()),
  prices: v.record(v.string(), v.number()),
})

const oneOffSchema = v.object({
  id: v.string(),
  date: v.string(),
  cancelled: v.optional(v.boolean()),
  cancelReason: v.optional(v.string()),
  title: v.optional(v.string()),
  hours: v.optional(v.array(v.string())),
  isPublic: v.optional(v.boolean()),
  location: v.optional(v.string()),
  coordinates: v.optional(v.string()),
  image_path: v.optional(v.string()),
  image_copyright: copyright,
  pre_img_description: stringList,
  post_img_description: stringList,
  external_link: stringList,
  organizer: v.optional(v.string()),
  prices: v.optional(v.record(v.string(), v.number())),
})

export type RecurringEvent = v.InferOutput<typeof recurringSchema>
export type OneOffEvent = v.InferOutput<typeof oneOffSchema>
export type ParsedRecurring = RecurringEvent & { repetitionRule: RRule }

export function parseRrule(rrule: string): RRule {
  try {
    const rule = RRule.fromString(rrule)
    if (!rule.origOptions.dtstart) {
      rule.options.dtstart = new Date(0)
    }
    return rule
  }
  catch (error) {
    throw new Error(`Invalid rrule "${rrule}": ${(error as Error).message}`, { cause: error })
  }
}

export function toDateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

export function parseDateKey(key: string): Date {
  return new Date(`${key}T12:00:00Z`)
}

const normalizeForComparison = (value?: string) => (value ?? '').trim().toLowerCase()

export function categorize(event: { location?: string, isPublic?: boolean, cancelled?: boolean }): EventCategory {
  if (event.cancelled) {
    return 'cancelled'
  }
  const isLocal = normalizeForComparison(event.location) === normalizeForComparison(ASSOCIATION_LOCAL_ADDRESS)
  if (isLocal) {
    return event.isPublic ? 'local-open' : 'local-closed'
  }
  return event.isPublic ? 'external-open' : 'external-closed'
}

const CATEGORY_PRIORITY: Record<EventCategory, number> = {
  'local-open': 0,
  'external-open': 1,
  'local-closed': 2,
  'external-closed': 3,
  'reservation': 4,
  'cancelled': 5,
}

export function topCategory(events: CalendarEvent[]): EventCategory | undefined {
  if (events.length === 0) {
    return undefined
  }
  return events
    .map(categorize)
    .sort((first, second) => CATEGORY_PRIORITY[first] - CATEGORY_PRIORITY[second])[0]
}

function toBaseEvent(recurringEvent: ParsedRecurring): baseEvent {
  const { rrule, ...base } = recurringEvent
  return base
}

export function mergeEvents(
  recurringEvents: ParsedRecurring[],
  oneOffs: OneOffEvent[],
  windowStart: Date,
  windowEnd: Date,
): CalendarEvent[] {
  const oneOffByKey = new Map<string, OneOffEvent>()
  for (const oneOff of oneOffs) {
    oneOffByKey.set(`${oneOff.id}|${oneOff.date}`, oneOff)
  }

  const matchedKeys = new Set<string>()
  const events: CalendarEvent[] = []

  for (const recurringEvent of recurringEvents) {
    const occurrenceDates = recurringEvent.repetitionRule.between(windowStart, windowEnd, true)
    for (const occurrenceDate of occurrenceDates) {
      const key = `${recurringEvent.id}|${toDateKey(occurrenceDate)}`
      const override = oneOffByKey.get(key)
      if (override) {
        matchedKeys.add(key)
        if (override.cancelled) {
          events.push({ ...toBaseEvent(recurringEvent), date: occurrenceDate, cancelled: true, cancelReason: override.cancelReason })
        }
        else {
          const { id, date, cancelled, cancelReason, ...patch } = override
          events.push({ ...toBaseEvent(recurringEvent), ...patch, date: occurrenceDate })
        }
      }
      else {
        events.push({ ...toBaseEvent(recurringEvent), date: occurrenceDate })
      }
    }
  }

  for (const oneOff of oneOffs) {
    const key = `${oneOff.id}|${oneOff.date}`
    if (!matchedKeys.has(key)) {
      const occurrenceDate = parseDateKey(oneOff.date)
      if (occurrenceDate >= windowStart && occurrenceDate <= windowEnd) {
        const { id, date, cancelled, cancelReason, ...rest } = oneOff
        events.push({ ...rest, id, date: occurrenceDate } as CalendarEvent)
      }
    }
  }

  return events
}

export function rollingWindow(now: Date = new Date(), backMonths = 2, forwardMonths = 12): [Date, Date] {
  const start = new Date(now)
  start.setMonth(start.getMonth() - backMonths)
  start.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setMonth(end.getMonth() + forwardMonths)
  end.setHours(23, 59, 59, 999)
  return [start, end]
}

export function loadEvents(windowStart: Date, windowEnd: Date): CalendarEvent[] {
  const recurringFile = v.parse(v.object({ events: v.array(recurringSchema) }), recurringRaw)
  const oneOffFile = v.parse(v.object({ events: v.array(oneOffSchema) }), oneOffRaw)
  const parsedRecurring: ParsedRecurring[] = recurringFile.events.map(event => ({ ...event, repetitionRule: parseRrule(event.rrule) }))
  return mergeEvents(parsedRecurring, oneOffFile.events, windowStart, windowEnd)
}

export function getEventsByDate(events: CalendarEvent[], key: string): CalendarEvent[] {
  return events.filter(event => toDateKey(event.date) === key)
}
