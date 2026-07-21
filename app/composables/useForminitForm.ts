import { Forminit } from 'forminit'

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const clients = new Map<string, Forminit>()

function getClient(formId: string): Forminit {
  let client = clients.get(formId)
  if (!client) {
    client = new Forminit({ proxyUrl: `https://forminit.com/f/${formId}` })
    clients.set(formId, client)
  }
  return client
}

export function useForminitForm(options: {
  formId: string
  onSuccessToast?: { title: string, description?: string }
}) {
  const status = ref<FormStatus>('idle')
  const error = ref<string | null>(null)
  const showForm = ref(true)
  const toast = useToast()

  async function submit(data: Record<string, unknown>) {
    status.value = 'loading'
    error.value = null

    const formData = new FormData()
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, String(value))
    }
    const { error: submitError } = await getClient(options.formId).submit(options.formId, formData)

    if (submitError) {
      status.value = 'error'
      error.value = submitError.message
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
