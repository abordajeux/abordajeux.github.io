import { describe, expect, it, vi } from 'vitest'
import type { ApiFetch, ApiFetchOptions } from './useApiFetch'
import { useVerifyToken } from './useVerifyToken'

function createFetcher(handler: (path: string, options?: ApiFetchOptions) => unknown): ApiFetch {
  return <T,>(path: string, options?: ApiFetchOptions): Promise<T> => {
    const result = handler(path, options)
    if (result instanceof Error) {
      return Promise.reject(result)
    }
    return Promise.resolve(result as T)
  }
}

function apiError(statusCode: number): Error & { statusCode: number } {
  return Object.assign(new Error('api error'), { statusCode })
}

describe('useVerifyToken', () => {
  it('starts invalid when the token is absent', () => {
    const verify = useVerifyToken(() => '', createFetcher(() => ({})))
    expect(verify.status.value).toBe('invalid')
  })

  it('confirms a seated signup on POST /verify', async () => {
    const handler = vi.fn(() => ({ status: 'confirmed', activity_id: 'a1', waitlisted: false }))
    const verify = useVerifyToken(() => 'tok', createFetcher(handler))
    await verify.confirm()
    expect(handler).toHaveBeenCalledWith('/verify', { method: 'POST', body: { token: 'tok' } })
    expect(verify.status.value).toBe('confirmed')
  })

  it('reports the waitlist variant', async () => {
    const verify = useVerifyToken(() => 'tok', createFetcher(() => ({
      status: 'confirmed', activity_id: 'a1', waitlisted: true,
    })))
    await verify.confirm()
    expect(verify.status.value).toBe('waitlisted')
  })

  it('maps 404 to invalid and 410 to expired', async () => {
    const invalid = useVerifyToken(() => 'tok', createFetcher(() => apiError(404)))
    await invalid.confirm()
    expect(invalid.status.value).toBe('invalid')
    const expired = useVerifyToken(() => 'tok', createFetcher(() => apiError(410)))
    await expired.confirm()
    expect(expired.status.value).toBe('expired')
  })

  it('network failure yields the retryable error state', async () => {
    const verify = useVerifyToken(() => 'tok', createFetcher(() => new Error('down')))
    await verify.confirm()
    expect(verify.status.value).toBe('error')
  })
})
