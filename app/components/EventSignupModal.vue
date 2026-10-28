<script setup lang="ts">
import * as v from 'valibot'
import type { ApiFetch } from '~/composables/useApiFetch'
import { formatFrenchDate, type CalendarEvent } from '~/utils/eventsLoader'

const props = defineProps<{
  open: boolean
  event: CalendarEvent | null
  fetcher?: ApiFetch
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const email = ref('')
const message = ref('')

const { status, error, showForm, submit, reset } = useApiForm({
  endpoint: '/forms/contact',
  onSuccessToast: { title: 'Envoyé', description: 'Votre demande a été transmise avec succès' },
  fetcher: props.fetcher,
})

const subject = computed(() => {
  if (!props.event) {
    return ''
  }
  return `${props.event.title} du ${formatFrenchDate(props.event.date)}`
})

const submitSchema = v.object({
  sender_email: v.pipe(v.string(), v.email('Adresse email invalide')),
  message: v.pipe(v.string(), v.trim(), v.minLength(1, 'Message requis')),
})

const formErrors = reactive<{ sender_email: string | null, message: string | null }>({
  sender_email: null,
  message: null,
})

watch(() => props.open, (open) => {
  if (open) {
    email.value = ''
    message.value = ''
    formErrors.sender_email = null
    formErrors.message = null
    reset()
  }
})

async function onSubmit() {
  const parsed = v.safeParse(submitSchema, { sender_email: email.value, message: message.value })
  formErrors.sender_email = null
  formErrors.message = null
  if (!parsed.success) {
    for (const issue of parsed.issues) {
      const path = v.getDotPath(issue)
      if (path === 'sender_email') {
        formErrors.sender_email = issue.message
      }
      if (path === 'message') {
        formErrors.message = issue.message
      }
    }
    return
  }
  await submit({
    subject: subject.value,
    sender_email: parsed.output.sender_email,
    message: parsed.output.message,
  })
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="props.event?.title"
    :description="props.event ? formatFrenchDate(props.event.date) : undefined"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div v-if="props.event" class="flex flex-col gap-3">
        <form v-if="showForm" class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <UFormField label="Sujet" name="subject" help="Sujet envoyé automatiquement avec votre message.">
            <UInput :model-value="subject" disabled class="w-full" />
          </UFormField>

          <UFormField
            label="Email"
            name="sender_email"
            :error="formErrors.sender_email ?? undefined"
          >
            <UInput v-model="email" type="email" placeholder="vous@exemple.ch" class="w-full" />
          </UFormField>

          <UFormField
            label="Message"
            name="message"
            :error="formErrors.message ?? undefined"
          >
            <UTextarea
              v-model="message"
              :rows="4"
              placeholder="Par exemple : je m'appelle Gaston, je suis le meilleur à tous les jeux, et j'aimerais vous rejoindre ce soir là."
              class="w-full"
            />
          </UFormField>

          <div v-if="status === 'error' && error" class="text-error text-sm">
            {{ error }}
          </div>

          <div class="flex justify-end">
            <UButton type="submit" icon="i-lucide-notebook-pen" :loading="status === 'loading'">
              Envoyer
            </UButton>
          </div>
        </form>

        <div v-else class="flex flex-col items-center gap-3 text-center">
          <UIcon name="i-lucide-party-popper" class="text-4xl text-primary" />
          <p>Merci de votre message ! Nous reviendrons vers vous rapidement.</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
