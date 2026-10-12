import type { ActivityCapacity } from '~/utils/subscriptionLogic'
import type { ApiFetch } from './useApiFetch'

interface ApiActivityEntry extends ActivityCapacity {
  id: string | null
}

export type CapacityStatus = 'idle' | 'loading' | 'ready' | 'error'

function toCapacity(entry: ApiActivityEntry): ActivityCapacity {
  return {
    max: entry.max,
    confirmed: entry.confirmed,
    pending: entry.pending,
    waitlisted: entry.waitlisted,
  }
}

export function useActivityCapacity(fetcher?: ApiFetch) {
  const api = fetcher ?? useApiFetch()
  const capacities = ref<Record<string, ActivityCapacity>>({})
  const status = ref<CapacityStatus>('idle')

  async function loadAll() {
    status.value = 'loading'
    try {
      const result = await api<{ activities: ApiActivityEntry[] }>('/activities')
      const map: Record<string, ActivityCapacity> = {}
      for (const entry of result.activities) {
        if (entry.id) {
          map[entry.id] = toCapacity(entry)
        }
      }
      capacities.value = map
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  async function refresh(activityId: string) {
    try {
      const entry = await api<ApiActivityEntry>(`/activities/${activityId}`)
      if (entry.id) {
        capacities.value = { ...capacities.value, [entry.id]: toCapacity(entry) }
      }
    } catch {
      return
    }
  }

  return { capacities, status, loadAll, refresh }
}
