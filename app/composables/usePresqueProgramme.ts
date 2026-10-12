import { parsePresqueProgram, splitByCategory, type PresqueActivity, type PresqueProgramTabs } from '~/utils/presqueProgram'
import type { ApiFetch } from './useApiFetch'

export type ProgrammeStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error'

const CACHE_KEY = 'presque-programme-cache'

function statusCodeOf(err: unknown): number | undefined {
  const candidate = err as { statusCode?: unknown, status?: unknown }
  if (typeof candidate.statusCode === 'number') {
    return candidate.statusCode
  }
  if (typeof candidate.status === 'number') {
    return candidate.status
  }
  return undefined
}

export function usePresqueProgramme(options: { fetcher?: ApiFetch, onWarning?: (message: string) => void } = {}) {
  const api = options.fetcher ?? useApiFetch()
  const status = ref<ProgrammeStatus>('idle')
  const activities = ref<PresqueActivity[]>([])
  const fromCache = ref(false)

  const tabs = computed<PresqueProgramTabs>(() => splitByCategory(activities.value))

  function readCache(): unknown | null {
    try {
      const cached = window.localStorage.getItem(CACHE_KEY)
      if (cached === null) {
        return null
      }
      return JSON.parse(cached) as unknown
    } catch {
      return null
    }
  }

  function writeCache(raw: unknown) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(raw))
    } catch {
      return
    }
  }

  function applyRaw(raw: unknown) {
    activities.value = parsePresqueProgram(raw, options.onWarning)
  }

  async function load() {
    status.value = 'loading'
    try {
      const raw = await api<unknown>('/schedule')
      writeCache(raw)
      applyRaw(raw)
      fromCache.value = false
      status.value = 'ready'
      return
    } catch (err: unknown) {
      const cached = readCache()
      if (cached !== null) {
        applyRaw(cached)
        fromCache.value = true
        status.value = 'ready'
        return
      }
      status.value = statusCodeOf(err) === 404 ? 'missing' : 'error'
    }
  }

  return { status, activities, tabs, fromCache, load }
}
