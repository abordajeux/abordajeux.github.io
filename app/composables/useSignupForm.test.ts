import { describe, expect, it, vi } from 'vitest'
import type { ApiFetch, ApiFetchOptions } from './useApiFetch'
import type { ActivityCapacity } from '~/utils/subscriptionLogic'
import { useSignupForm } from './useSignupForm'

function createFetcher(handler: (path: string, options?: ApiFetchOptions) => unknown) {
  const calls: { path: string, options?: ApiFetchOptions }[] = []
  const fetcher = <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
    calls.push({ path, options })
    const result = handler(path, options)
    if (result instanceof Error) {
      return Promise.reject(result)
    }
    return Promise.resolve(result as T)
  }
  return { calls, fetcher: fetcher as ApiFetch }
}

function apiError(statusCode: number, data: Record<string, unknown>): Error & { statusCode: number, data: unknown } {
  return Object.assign(new Error('api error'), { statusCode, data })
}

const openCapacity: ActivityCapacity = { max: 5, confirmed: 1, pending: 1, waitlisted: 0 }
const fullCapacity: ActivityCapacity = { max: 5, confirmed: 3, pending: 2, waitlisted: 0 }

describe('useSignupForm group handling', () => {
  it('adds people while below availability and stops at the cap', async () => {
    const capacity = ref<ActivityCapacity | undefined>(openCapacity)
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => capacity.value,
      fetcher: createFetcher(() => ({})).fetcher,
    })
    expect(form.persons.value).toEqual([''])
    form.addPerson()
    form.addPerson()
    expect(form.persons.value).toHaveLength(3)
    expect(form.canAdd.value).toBe(false)
    form.addPerson()
    expect(form.persons.value).toHaveLength(3)
  })

  it('waiting-list mode keeps exactly one person and refuses additions', () => {
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => fullCapacity,
      fetcher: createFetcher(() => ({})).fetcher,
    })
    expect(form.mode.value).toBe('waiting_list')
    expect(form.allowedPeople.value).toBe(1)
    form.addPerson()
    expect(form.persons.value).toEqual([''])
    expect(form.canAdd.value).toBe(false)
  })

  it('trims the person list when availability shrinks while filling the form', async () => {
    const capacity = ref<ActivityCapacity | undefined>(openCapacity)
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => capacity.value,
      fetcher: createFetcher(() => ({})).fetcher,
    })
    form.addPerson()
    form.setPerson(1, 'Bob')
    expect(form.persons.value).toHaveLength(2)
    capacity.value = fullCapacity
    await nextTick()
    expect(form.persons.value).toHaveLength(1)
    expect(form.mode.value).toBe('waiting_list')
  })

  it('canSubmit requires every name to be non-blank', () => {
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => openCapacity,
      fetcher: createFetcher(() => ({})).fetcher,
    })
    expect(form.canSubmit.value).toBe(false)
    form.setPerson(0, 'Alice')
    expect(form.canSubmit.value).toBe(true)
    form.setPerson(0, '   ')
    expect(form.canSubmit.value).toBe(false)
  })
})

describe('useSignupForm submit', () => {
  it('posts email plus trimmed participants and records a seated success', async () => {
    const { calls, fetcher } = createFetcher(() => ({
      status: 'ok',
      verification_required: true,
      waitlisted: false,
      message: 'Un email de confirmation a été envoyé à a@example.ch.',
    }))
    const onCapacityChanged = vi.fn()
    const form = useSignupForm({
      activityId: () => 'presque-dnd-001',
      capacity: () => openCapacity,
      onCapacityChanged,
      fetcher,
    })
    form.setPerson(0, '  Alice  ')
    form.addPerson()
    form.setPerson(1, 'Bob')
    await form.submit('a@example.ch')
    expect(calls).toHaveLength(1)
    expect(calls[0]!.path).toBe('/activities/presque-dnd-001/signup')
    expect(calls[0]!.options?.body).toEqual({
      contact_email: 'a@example.ch',
      participants: [{ name: 'Alice' }, { name: 'Bob' }],
    })
    expect(form.status.value).toBe('success')
    expect(form.success.value).toEqual({
      waitlisted: false,
      message: 'Un email de confirmation a été envoyé à a@example.ch.',
    })
    expect(onCapacityChanged).toHaveBeenCalledOnce()
  })

  it('records a waitlisted success with the API message', async () => {
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => fullCapacity,
      fetcher: createFetcher(() => ({
        waitlisted: true,
        message: 'Cette activité est complète : vous avez été ajouté·e à la liste d\'attente.',
      })).fetcher,
    })
    form.setPerson(0, 'Alice')
    await form.submit('a@example.ch')
    expect(form.success.value?.waitlisted).toBe(true)
    expect(form.status.value).toBe('success')
  })

  it('maps a 422 capacity_exceeded to the API message and refreshes capacity', async () => {
    const { fetcher } = createFetcher(() => apiError(422, {
      status: 'capacity_exceeded',
      max: 5,
      confirmed: 3,
      pending: 2,
      available: 0,
      requested: 2,
      message: 'Il ne reste plus de places pour cette activité.',
    }))
    const onCapacityChanged = vi.fn()
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => openCapacity,
      onCapacityChanged,
      fetcher,
    })
    form.setPerson(0, 'Alice')
    await form.submit('a@example.ch')
    expect(form.status.value).toBe('error')
    expect(form.error.value).toBe('Il ne reste plus de places pour cette activité.')
    expect(onCapacityChanged).toHaveBeenCalledOnce()
  })

  it('falls back to the generic French message on a network failure', async () => {
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => openCapacity,
      fetcher: createFetcher(() => new Error('boom')).fetcher,
    })
    form.setPerson(0, 'Alice')
    await form.submit('a@example.ch')
    expect(form.status.value).toBe('error')
    expect(form.error.value).toContain('Impossible d\'envoyer votre demande')
  })

  it('reset clears persons and outcomes', async () => {
    const form = useSignupForm({
      activityId: () => 'a1',
      capacity: () => openCapacity,
      fetcher: createFetcher(() => ({ waitlisted: false, message: 'ok' })).fetcher,
    })
    form.setPerson(0, 'Alice')
    await form.submit('a@example.ch')
    form.reset()
    expect(form.persons.value).toEqual([''])
    expect(form.status.value).toBe('idle')
    expect(form.success.value).toBeNull()
    expect(form.error.value).toBeNull()
  })
})
