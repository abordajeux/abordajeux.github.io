import { mapApiFormError } from '~/utils/apiFormClient'
import {
  canAddPerson,
  getAllowedPeople,
  getSignupMode,
  type ActivityCapacity,
  type SignupMode,
} from '~/utils/subscriptionLogic'
import type { ApiFetch } from './useApiFetch'

export type SignupStatus = 'idle' | 'loading' | 'success' | 'error'

interface SignupOkResponse {
  status: string
  verification_required: boolean
  waitlisted: boolean
  message: string
}

export interface SignupSuccess {
  waitlisted: boolean
  message: string
}

export interface SignupFormOptions {
  activityId: () => string
  capacity: () => ActivityCapacity | undefined
  onCapacityChanged?: () => void | Promise<void>
  fetcher?: ApiFetch
}

export function useSignupForm(options: SignupFormOptions) {
  const api = options.fetcher ?? useApiFetch()
  const persons = ref<string[]>([''])
  const status = ref<SignupStatus>('idle')
  const error = ref<string | null>(null)
  const success = ref<SignupSuccess | null>(null)

  const capacity = computed(options.capacity)
  const allowedPeople = computed(() => {
    if (capacity.value === undefined) {
      return 1
    }
    return getAllowedPeople(capacity.value)
  })
  const mode = computed<SignupMode>(() => {
    if (capacity.value === undefined) {
      return 'subscription'
    }
    return getSignupMode(capacity.value)
  })
  const canAdd = computed(() => {
    if (capacity.value === undefined) {
      return false
    }
    return canAddPerson(persons.value.length, capacity.value)
  })
  const canSubmit = computed(() =>
    status.value !== 'loading'
    && persons.value.length >= 1
    && persons.value.every(name => name.trim().length > 0))

  watch(allowedPeople, (allowed) => {
    if (persons.value.length > allowed) {
      persons.value = persons.value.slice(0, allowed)
    }
    if (persons.value.length < 1) {
      persons.value = ['']
    }
  })

  function addPerson() {
    if (!canAdd.value) {
      return
    }
    persons.value = [...persons.value, '']
  }

  function removePerson(index: number) {
    if (persons.value.length <= 1) {
      persons.value = ['']
      return
    }
    persons.value = persons.value.filter((_, position) => position !== index)
  }

  function setPerson(index: number, name: string) {
    persons.value = persons.value.map((current, position) => (position === index ? name : current))
  }

  function reset() {
    persons.value = ['']
    status.value = 'idle'
    error.value = null
    success.value = null
  }

  async function submit(contactEmail: string) {
    if (status.value === 'loading') {
      return
    }
    status.value = 'loading'
    error.value = null
    try {
      const result = await api<SignupOkResponse>(`/activities/${options.activityId()}/signup`, {
        method: 'POST',
        body: {
          contact_email: contactEmail,
          participants: persons.value.map(name => ({ name: name.trim() })),
        },
      })
      status.value = 'success'
      success.value = {
        waitlisted: Boolean(result.waitlisted),
        message: typeof result.message === 'string' ? result.message : '',
      }
    } catch (err: unknown) {
      status.value = 'error'
      error.value = mapApiFormError(err)
    }
    await options.onCapacityChanged?.()
  }

  return {
    persons,
    status,
    error,
    success,
    mode,
    allowedPeople,
    canAdd,
    canSubmit,
    addPerson,
    removePerson,
    setPerson,
    reset,
    submit,
  }
}
