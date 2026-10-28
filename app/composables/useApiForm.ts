import { mapApiFormError } from '~/utils/apiFormClient'
import type { ApiFetch } from './useApiFetch'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function useApiForm(options: {
  endpoint: string
  onSuccessToast?: { title: string, description?: string }
  fetcher?: ApiFetch
}) {
  const status = ref<FormStatus>('idle')
  const error = ref<string | null>(null)
  const showForm = ref(true)
  const toast = useToast()
  const api = options.fetcher ?? useApiFetch()

  async function submit(data: Record<string, unknown>) {
    status.value = 'loading'
    error.value = null
    try {
      await api(options.endpoint, {
        method: 'POST',
        body: data,
      })
    } catch (err: unknown) {
      status.value = 'error'
      error.value = mapApiFormError(err)
      return
    }
    status.value = 'success'
    if (options.onSuccessToast) {
      toast.add({ ...options.onSuccessToast, color: 'success' })
    }
    showForm.value = false
  }

  function reset() {
    status.value = 'idle'
    error.value = null
    showForm.value = true
  }

  return { status, error, showForm, submit, reset }
}
