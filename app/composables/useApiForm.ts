import { mapApiFormError } from '~/utils/apiFormClient'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function useApiForm(options: {
  endpoint: string
  onSuccessToast?: { title: string, description?: string }
}) {
  const status = ref<FormStatus>('idle')
  const error = ref<string | null>(null)
  const showForm = ref(true)
  const toast = useToast()
  const config = useRuntimeConfig()

  async function submit(data: Record<string, unknown>) {
    status.value = 'loading'
    error.value = null
    try {
      await $fetch(options.endpoint, {
        method: 'POST',
        baseURL: config.public.apiBase,
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

  return { status, error, showForm, submit }
}
