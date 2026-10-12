import { afterEach, describe, expect, it } from 'vitest'
import type { ApiFetch, ApiFetchOptions } from './useApiFetch'
import { usePresqueProgramme } from './usePresqueProgramme'

function createFetcher(handler: (path: string, options?: ApiFetchOptions) => unknown): ApiFetch {
  return <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
    const result = handler(path, options)
    if (result instanceof Error) {
      return Promise.reject(result)
    }
    return Promise.resolve(result as T)
  }
}

const programmePayload = {
  activities: [
    { id: 'a', title: 'JDR tard', category: 'jdr', start: '2026-11-15T10:00:00+01:00', end: '2026-11-15T12:00:00+01:00', max_participants: 4 },
    { id: 'b', title: 'JDR tôt', category: 'jdr', start: '2026-11-14T10:00:00+01:00', end: '2026-11-14T12:00:00+01:00', max_participants: 4 },
    { id: 'c', title: 'JDS', category: 'jds', start: '2026-11-14T18:00:00+01:00', end: '2026-11-14T23:00:00+01:00', max_participants: 16 },
  ],
}

afterEach(() => {
  window.localStorage.clear()
})

describe('usePresqueProgramme', () => {
  it('loads, splits and sorts the schedule from /schedule', async () => {
    const programme = usePresqueProgramme({ fetcher: createFetcher(() => programmePayload) })
    await programme.load()
    expect(programme.status.value).toBe('ready')
    expect(programme.fromCache.value).toBe(false)
    expect(programme.tabs.value.jdr.map(activity => activity.id)).toEqual(['b', 'a'])
    expect(programme.tabs.value.jds.map(activity => activity.id)).toEqual(['c'])
    expect(window.localStorage.getItem('presque-programme-cache')).toContain('JDR tôt')
  })

  it('reports missing when /schedule answers 404 and no cache exists', async () => {
    const programme = usePresqueProgramme({
      fetcher: createFetcher(() => Object.assign(new Error('x'), { statusCode: 404 })),
    })
    await programme.load()
    expect(programme.status.value).toBe('missing')
  })

  it('falls back to the cached copy on network failure', async () => {
    window.localStorage.setItem('presque-programme-cache', JSON.stringify(programmePayload))
    const programme = usePresqueProgramme({ fetcher: createFetcher(() => new Error('down')) })
    await programme.load()
    expect(programme.status.value).toBe('ready')
    expect(programme.fromCache.value).toBe(true)
    expect(programme.activities.value).toHaveLength(3)
  })

  it('surfaces warnings for invalid entries without failing the load', async () => {
    const warnings: string[] = []
    const programme = usePresqueProgramme({
      fetcher: createFetcher(() => ({ activities: [{ id: 'bad' }] })),
      onWarning: message => warnings.push(message),
    })
    await programme.load()
    expect(programme.status.value).toBe('ready')
    expect(programme.activities.value).toEqual([])
    expect(warnings).toHaveLength(1)
  })
})
