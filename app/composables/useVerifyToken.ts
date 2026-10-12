import type { ApiFetch } from './useApiFetch'

export type VerifyStatus = 'idle' | 'loading' | 'confirmed' | 'waitlisted' | 'invalid' | 'expired' | 'error'

interface VerifyConfirmedResponse {
  status: string
  activity_id: string
  waitlisted: boolean
}

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

export function useVerifyToken(token: () => string, fetcher?: ApiFetch) {
  const api = fetcher ?? useApiFetch()
  const status = ref<VerifyStatus>(token() === '' ? 'invalid' : 'idle')

  async function confirm() {
    if (status.value === 'loading') {
      return
    }
    status.value = 'loading'
    try {
      const result = await api<VerifyConfirmedResponse>('/verify', {
        method: 'POST',
        body: { token: token() },
      })
      status.value = result.waitlisted ? 'waitlisted' : 'confirmed'
    } catch (err: unknown) {
      const code = statusCodeOf(err)
      if (code === 404) {
        status.value = 'invalid'
        return
      }
      if (code === 410) {
        status.value = 'expired'
        return
      }
      status.value = 'error'
    }
  }

  return { status, confirm }
}
