import { describe, expect, it } from 'vitest'
import {
  type ActivityCapacity,
  canAddPerson,
  getAvailable,
  getAllowedPeople,
  getCapacityBadge,
  getSignupMode,
  isAtCapacity,
} from './subscriptionLogic'

function capacity(overrides: Partial<ActivityCapacity> = {}): ActivityCapacity {
  return { max: 8, confirmed: 0, pending: 0, waitlisted: 0, ...overrides }
}

describe('getAvailable', () => {
  it('subtracts confirmed and pending from max (pessimistic)', () => {
    expect(getAvailable(capacity({ confirmed: 3, pending: 2 }))).toBe(3)
  })
})

describe('isAtCapacity / getSignupMode truth table', () => {
  it('open activity with seats and empty queue → subscription', () => {
    const open = capacity({ max: 8, confirmed: 2, pending: 1, waitlisted: 0 })
    expect(isAtCapacity(open)).toBe(false)
    expect(getSignupMode(open)).toBe('subscription')
  })

  it('no seats left, empty queue → waiting list', () => {
    const full = capacity({ max: 5, confirmed: 4, pending: 1, waitlisted: 0 })
    expect(isAtCapacity(full)).toBe(true)
    expect(getSignupMode(full)).toBe('waiting_list')
  })

  it('seats nominally free but queue exists → waiting list (queue priority)', () => {
    const queued = capacity({ max: 5, confirmed: 4, pending: 0, waitlisted: 2 })
    expect(getAvailable(queued)).toBe(1)
    expect(isAtCapacity(queued)).toBe(true)
    expect(getSignupMode(queued)).toBe('waiting_list')
  })
})

describe('getAllowedPeople / canAddPerson', () => {
  it('subscription mode caps the group at the available seats', () => {
    const open = capacity({ max: 8, confirmed: 3, pending: 0, waitlisted: 0 })
    expect(getAllowedPeople(open)).toBe(5)
    expect(canAddPerson(4, open)).toBe(true)
    expect(canAddPerson(5, open)).toBe(false)
  })

  it('caps the group at the API limit of 10 when many seats remain', () => {
    const wide = capacity({ max: 40, confirmed: 0, pending: 0, waitlisted: 0 })
    expect(getAllowedPeople(wide)).toBe(10)
    expect(canAddPerson(10, wide)).toBe(false)
  })

  it('waiting-list mode allows exactly one person', () => {
    const full = capacity({ max: 5, confirmed: 5, pending: 0, waitlisted: 1 })
    expect(getAllowedPeople(full)).toBe(1)
    expect(canAddPerson(0, full)).toBe(true)
    expect(canAddPerson(1, full)).toBe(false)
  })

  it('queue with a free-looking seat still allows exactly one person', () => {
    const queued = capacity({ max: 5, confirmed: 4, pending: 0, waitlisted: 2 })
    expect(getAllowedPeople(queued)).toBe(1)
    expect(canAddPerson(1, queued)).toBe(false)
  })
})

describe('non-subscribable activities (max = 0)', () => {
  const onsite = capacity({ max: 0, confirmed: 0, pending: 0, waitlisted: 0 })

  it('mode is none — never subscription nor waiting list', () => {
    expect(getSignupMode(onsite)).toBe('none')
  })

  it('allows no participants at all', () => {
    expect(getAllowedPeople(onsite)).toBe(0)
    expect(canAddPerson(0, onsite)).toBe(false)
  })

  it('shows the neutral Sans inscription badge', () => {
    expect(getCapacityBadge(onsite)).toEqual({ label: 'Sans inscription', color: 'neutral' })
  })
})

describe('getCapacityBadge', () => {
  it('unknown capacity → neutral question badge', () => {
    expect(getCapacityBadge(undefined)).toEqual({ label: 'Places : ?', color: 'neutral' })
  })

  it('plenty of seats → success with counts', () => {
    expect(getCapacityBadge(capacity({ max: 8, confirmed: 1 }))).toEqual({
      label: '7 places sur 8',
      color: 'success',
    })
  })

  it('single remaining seat → warning, singular label', () => {
    expect(getCapacityBadge(capacity({ max: 5, confirmed: 4 }))).toEqual({
      label: 'Presque complet — 1 place',
      color: 'warning',
    })
  })

  it('full or queued → error waitlist badge', () => {
    expect(getCapacityBadge(capacity({ max: 5, confirmed: 5 }))).toEqual({
      label: 'Complet — liste d\'attente',
      color: 'error',
    })
    expect(getCapacityBadge(capacity({ max: 5, confirmed: 3, waitlisted: 1 })).color).toBe('error')
  })
})
