export interface ApiFetchOptions {
  method?: 'GET' | 'POST'
  body?: Record<string, unknown>
}

export type ApiFetch = <T>(path: string, options?: ApiFetchOptions) => Promise<T>

export function useApiFetch(): ApiFetch {
  const config = useRuntimeConfig()
  return <T>(path: string, options: ApiFetchOptions = {}) =>
    $fetch<T>(path, { baseURL: config.public.apiBase, ...options })
}
