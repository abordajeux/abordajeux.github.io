import { describe, expect, it } from 'vitest'
import { buildAvailabilityRows } from './presqueAvailability'
import type { PresqueActivity } from './presqueProgram'

function buildActivity(overrides: Partial<PresqueActivity> = {}): PresqueActivity {
  return {
    id: 'presque-dnd-001',
    title: 'Donjons & Dragons',
    category: 'jdr',
    start: '2026-11-14T10:00:00+01:00',
    end: '2026-11-14T14:00:00+01:00',
    max_participants: 5,
    ...overrides,
  }
}

describe('buildAvailabilityRows', () => {
  it('builds sorted upcoming rows with deep links and schedules', () => {
    const late = buildActivity({ id: 'late', start: '2026-11-15T14:00:00+01:00', end: '2026-11-15T18:00:00+01:00' })
    const early = buildActivity({ id: 'early', start: '2026-11-14T10:00:00+01:00', end: '2026-11-14T12:00:00+01:00' })
    const rows = buildAvailabilityRows([late, early], {}, new Date('2026-11-14T08:00:00+01:00'))
    expect(rows.map(row => row.id)).toEqual(['early', 'late'])
    expect(rows[0]!.link).toBe('/presque/programme?id=early')
    expect(rows[0]!.title).toBe('Donjons & Dragons')
    expect(rows[0]!.schedule).toBe('samedi de 10:00 à 12:00')
  })

  it('joins capacities into badges and counters', () => {
    const rows = buildAvailabilityRows(
      [buildActivity({ id: 'a', max_participants: 10 })],
      { a: { max: 10, confirmed: 3, pending: 2, waitlisted: 0 } },
      new Date('2026-11-14T08:00:00+01:00'),
    )
    expect(rows[0]!.badge).toEqual({ label: '5 places sur 10', color: 'success' })
    expect(rows[0]!.counters).toEqual({ confirmed: '3', pending: '2', waitlisted: '0' })
  })

  it('shows placeholders when the capacity is unknown', () => {
    const rows = buildAvailabilityRows([buildActivity()], {}, new Date('2026-11-14T08:00:00+01:00'))
    expect(rows[0]!.badge).toEqual({ label: 'Places : ?', color: 'neutral' })
    expect(rows[0]!.counters).toEqual({ confirmed: '—', pending: '—', waitlisted: '—' })
  })

  it('marks no-signup activities without counters', () => {
    const rows = buildAvailabilityRows(
      [buildActivity({ max_participants: 0 })],
      { 'presque-dnd-001': { max: 0, confirmed: 0, pending: 0, waitlisted: 0 } },
      new Date('2026-11-14T08:00:00+01:00'),
    )
    expect(rows[0]!.badge).toEqual({ label: 'Sans inscription', color: 'neutral' })
    expect(rows[0]!.counters).toEqual({ confirmed: '—', pending: '—', waitlisted: '—' })
  })

  it('hides activities that have already started or finished', () => {
    const started = buildActivity({ id: 'started', start: '2026-11-14T09:00:00+01:00' })
    const boundary = buildActivity({ id: 'boundary', start: '2026-11-14T10:00:00+01:00' })
    const upcoming = buildActivity({ id: 'upcoming', start: '2026-11-14T11:00:00+01:00' })
    const rows = buildAvailabilityRows([started, boundary, upcoming], {}, new Date('2026-11-14T10:00:00+01:00'))
    expect(rows.map(row => row.id)).toEqual(['upcoming'])
  })
})
