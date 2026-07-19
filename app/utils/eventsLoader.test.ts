import { describe, expect, it } from 'vitest'
import { RRule } from 'rrule'
import {
  ASSOCIATION_LOCAL_ADDRESS,
  type CalendarEvent,
  type OneOffEvent,
  type ParsedRecurring,
  type RecurringEvent,
  categorize,
  getEventsByDate,
  loadEvents,
  mergeEvents,
  parseDateKey,
  parseRrule,
  toDateKey,
  topCategory,
} from './eventsLoader'

const JULY_START = new Date('2026-07-01T00:00:00Z')
const JULY_END = new Date('2026-07-31T23:59:59Z')

function buildRecurring(id: string, rrule: string, extra: Partial<RecurringEvent> = {}): ParsedRecurring {
  return {
    id,
    title: 'Test',
    rrule,
    hours: ['19:00', '23:00'],
    isPublic: true,
    location: ASSOCIATION_LOCAL_ADDRESS,
    prices: {},
    ...extra,
    repetitionRule: parseRrule(rrule),
  }
}

describe('date keys (TZ-pinned to Europe/Zurich)', () => {
  it('maps a Date to a canonical YYYY-MM-DD', () => {
    expect(toDateKey(new Date('2026-07-15T12:00:00Z'))).toBe('2026-07-15')
  })

  it('respects the Zurich offset near midnight (does not flip in UTC)', () => {
    expect(toDateKey(new Date('2026-07-15T23:00:00Z'))).toBe('2026-07-16')
  })

  it('round-trips parseDateKey -> toDateKey', () => {
    expect(toDateKey(parseDateKey('2026-07-15'))).toBe('2026-07-15')
  })
})

describe('categorize', () => {
  it('classifies local events as open/closed by isPublic', () => {
    expect(categorize({ location: ASSOCIATION_LOCAL_ADDRESS, isPublic: true })).toBe('local-open')
    expect(categorize({ location: ASSOCIATION_LOCAL_ADDRESS, isPublic: false })).toBe('local-closed')
  })

  it('classifies external events as open/closed too (not collapsed)', () => {
    expect(categorize({ location: 'a bar', isPublic: true })).toBe('external-open')
    expect(categorize({ location: 'a bar', isPublic: false })).toBe('external-closed')
  })

  it('survives case/whitespace drift in the local address', () => {
    expect(categorize({ location: '  Rue de la GARE 4, 2034 Peseux', isPublic: true })).toBe('local-open')
  })

  it('treats a missing location as external', () => {
    expect(categorize({ location: undefined, isPublic: true })).toBe('external-open')
  })

  it('returns cancelled regardless of venue/access', () => {
    expect(categorize({ location: ASSOCIATION_LOCAL_ADDRESS, isPublic: true, cancelled: true })).toBe('cancelled')
  })
})

describe('topCategory (live events beat cancelled)', () => {
  const live = { location: 'a bar', isPublic: true, date: parseDateKey('2026-07-15') } as CalendarEvent
  const cancelled = { location: ASSOCIATION_LOCAL_ADDRESS, isPublic: true, cancelled: true, date: parseDateKey('2026-07-15') } as CalendarEvent

  it('returns undefined for an empty day', () => {
    expect(topCategory([])).toBeUndefined()
  })

  it('prefers a live event over a cancelled one', () => {
    expect(topCategory([cancelled, live])).toBe('external-open')
  })

  it('falls back to cancelled when only a cancelled event is present', () => {
    expect(topCategory([cancelled])).toBe('cancelled')
  })
})

describe('parseRrule', () => {
  it('parses a valid rrule string', () => {
    expect(parseRrule('FREQ=WEEKLY;BYDAY=WE')).toBeInstanceOf(RRule)
  })

  it('throws on a malformed rrule (fail loud, not silent empty calendar)', () => {
    expect(() => parseRrule('totally not an rrule')).toThrow()
  })
})

describe('mergeEvents', () => {
  it('materializes weekly recurrences within the window', () => {
    const events = mergeEvents([buildRecurring('r1', 'FREQ=WEEKLY;BYDAY=WE')], [], JULY_START, JULY_END)
    expect(events.map(e => toDateKey(e.date)).sort()).toEqual([
      '2026-07-01',
      '2026-07-08',
      '2026-07-15',
      '2026-07-22',
      '2026-07-29',
    ])
  })

  it('a cancelled one-off keeps the occurrence visible with its reason', () => {
    const oneOffs = [{ id: 'r1', date: '2026-07-15', cancelled: true, cancelReason: 'Férié' }] as OneOffEvent[]
    const events = mergeEvents([buildRecurring('r1', 'FREQ=WEEKLY;BYDAY=WE')], oneOffs, JULY_START, JULY_END)
    const jul15 = events.find(e => toDateKey(e.date) === '2026-07-15')!
    expect(jul15.cancelled).toBe(true)
    expect(jul15.cancelReason).toBe('Férié')
    expect(events).toHaveLength(5)
  })

  it('a modify one-off patches the matched occurrence only', () => {
    const oneOffs = [{ id: 'r1', date: '2026-07-15', title: 'Spécial', hours: ['18:00', '22:00'] }] as OneOffEvent[]
    const events = mergeEvents([buildRecurring('r1', 'FREQ=WEEKLY;BYDAY=WE')], oneOffs, JULY_START, JULY_END)
    const jul15 = events.find(e => toDateKey(e.date) === '2026-07-15')!
    expect(jul15.title).toBe('Spécial')
    expect(jul15.hours).toEqual(['18:00', '22:00'])
    expect(jul15.cancelled).toBeUndefined()
    const jul08 = events.find(e => toDateKey(e.date) === '2026-07-08')!
    expect(jul08.title).toBe('Test')
  })

  it('a unique-id one-off is a standalone event', () => {
    const oneOffs = [{ id: 'fete', date: '2026-07-20', title: 'Fête', hours: ['14:00', '20:00'], isPublic: true, location: ASSOCIATION_LOCAL_ADDRESS }] as OneOffEvent[]
    const events = mergeEvents([buildRecurring('r1', 'FREQ=WEEKLY;BYDAY=WE')], oneOffs, JULY_START, JULY_END)
    expect(events).toHaveLength(6)
    const fete = events.find(e => toDateKey(e.date) === '2026-07-20')!
    expect(fete.title).toBe('Fête')
    expect(categorize(fete)).toBe('local-open')
  })

  it('a one-off whose date is not a recurrence becomes standalone (move pattern)', () => {
    const oneOffs = [{ id: 'r1', date: '2026-07-20', title: 'Moved' }] as OneOffEvent[]
    const events = mergeEvents([buildRecurring('r1', 'FREQ=WEEKLY;BYDAY=WE')], oneOffs, JULY_START, JULY_END)
    expect(events.find(e => toDateKey(e.date) === '2026-07-20')?.title).toBe('Moved')
  })
})

describe('loadEvents (production data)', () => {
  it('materializes both seed events for July 2026 with correct categories', () => {
    const events = loadEvents(JULY_START, JULY_END)
    expect(events).toHaveLength(6)
    const jul14 = events.find(e => toDateKey(e.date) === '2026-07-14')!
    expect(jul14.title).toBe('Games O\'Clock')
    expect(categorize(jul14)).toBe('external-open')
    const jul15 = events.find(e => toDateKey(e.date) === '2026-07-15')!
    expect(jul15.title).toBe('Soirée jeux du Mercredi')
    expect(categorize(jul15)).toBe('local-open')
  })

  it('getEventsByDate filters by canonical key', () => {
    const events = loadEvents(JULY_START, JULY_END)
    expect(getEventsByDate(events, '2026-07-15')).toHaveLength(1)
    expect(getEventsByDate(events, '2026-07-31')).toHaveLength(0)
  })
})
