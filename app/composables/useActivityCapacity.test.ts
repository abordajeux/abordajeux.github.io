import { describe, expect, it } from 'vitest'
import type { ApiFetch, ApiFetchOptions } from './useApiFetch'
import { useActivityCapacity } from './useActivityCapacity'

function createFetcher(handler: (path: string, options?: ApiFetchOptions) => unknown): ApiFetch {
  return <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
    const result = handler(path, options)
    if (result instanceof Error) {
      return Promise.reject(result)
    }
    return Promise.resolve(result as T)
  }
}

describe('useActivityCapacity', () => {
  it('loadAll maps entries by id and skips null ids', async () => {
    const capacity = useActivityCapacity(createFetcher(() => ({
      activities: [
        { id: 'a', max: 5, confirmed: 2, pending: 1, waitlisted: 0 },
        { id: 'b', max: 16, confirmed: 16, pending: 0, waitlisted: 3 },
        { id: null, max: 0, confirmed: 0, pending: 0, waitlisted: 0 },
      ],
    })))
    await capacity.loadAll()
    expect(capacity.status.value).toBe('ready')
    expect(Object.keys(capacity.capacities.value).sort()).toEqual(['a', 'b'])
    expect(capacity.capacities.value.a).toEqual({ max: 5, confirmed: 2, pending: 1, waitlisted: 0 })
  })

  it('loadAll failure yields the error status with an empty map', async () => {
    const capacity = useActivityCapacity(createFetcher(() => new Error('down')))
    await capacity.loadAll()
    expect(capacity.status.value).toBe('error')
    expect(capacity.capacities.value).toEqual({})
  })

  it('refresh updates a single activity without dropping the others', async () => {
    const capacity = useActivityCapacity(createFetcher(() => ({
      activities: [{ id: 'a', max: 5, confirmed: 0, pending: 0, waitlisted: 0 }],
    })))
    await capacity.loadAll()
    const refreshing = useActivityCapacity(createFetcher(() => ({
      id: 'a', max: 5, confirmed: 4, pending: 1, waitlisted: 0,
    })))
    capacity.capacities.value.b = { max: 9, confirmed: 0, pending: 0, waitlisted: 0 }
    await refreshing.refresh('a')
    expect(refreshing.capacities.value.a).toEqual({ max: 5, confirmed: 4, pending: 1, waitlisted: 0 })
  })

  it('refresh failure keeps the current data untouched', async () => {
    const capacity = useActivityCapacity(createFetcher(() => ({
      id: 'a', max: 5, confirmed: 1, pending: 0, waitlisted: 0,
    })))
    await capacity.refresh('a')
    const failing = useActivityCapacity(createFetcher(() => Object.assign(new Error('x'), { statusCode: 404 })))
    await failing.refresh('a')
    expect(failing.capacities.value).toEqual({})
    expect(capacity.capacities.value.a).toEqual({ max: 5, confirmed: 1, pending: 0, waitlisted: 0 })
  })
})
