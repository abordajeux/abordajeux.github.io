<script setup lang="ts">
import * as v from 'valibot'
import type { ApiFetch } from '~/composables/useApiFetch'
import { useSignupForm } from '~/composables/useSignupForm'
import { activityTintClass, formatPresqueSchedule, getActivityImage, type PresqueActivity } from '~/utils/presqueProgram'
import { getAvailable, getCapacityBadge, type ActivityCapacity } from '~/utils/subscriptionLogic'

const props = defineProps<{
  open: boolean
  activity: PresqueActivity | null
  capacity?: ActivityCapacity
  fetcher?: ApiFetch
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'refresh': []
}>()

const email = ref('')
const step = ref<'detail' | 'form'>('detail')

const {
  persons,
  status,
  error,
  success,
  mode,
  canAdd,
  canSubmit,
  addPerson,
  removePerson,
  setPerson,
  reset,
  submit,
} = useSignupForm({
  activityId: () => props.activity?.id ?? '',
  capacity: () => props.capacity,
  onCapacityChanged: () => emit('refresh'),
  fetcher: props.fetcher,
})

const badge = computed(() => getCapacityBadge(props.capacity))
const tintClass = computed(() => {
  if (!props.activity) {
    return undefined
  }
  return activityTintClass(props.activity)
})
const modalUi = computed(() => {
  if (!tintClass.value) {
    return undefined
  }
  return { content: tintClass.value }
})
const activityImage = computed(() => {
  if (!props.activity) {
    return null
  }
  return getActivityImage(props.activity)
})

const capacityLine = computed(() => {
  if (!props.capacity) {
    return 'Places disponibles : information momentanément indisponible.'
  }
  if (mode.value === 'none') {
    return ''
  }
  if (mode.value === 'waiting_list') {
    return 'Cette activité est complète : inscrivez-vous sur la liste d\'attente.'
  }
  const available = getAvailable(props.capacity)
  const plural = available > 1 ? 's' : ''
  return `${available} place${plural} disponible${plural} sur ${props.capacity.max}.`
})

const pendingLine = computed(() => {
  if (!props.capacity || props.capacity.pending === 0) {
    return ''
  }
  return `${props.capacity.confirmed} inscription${props.capacity.confirmed > 1 ? 's' : ''} confirmée${props.capacity.confirmed > 1 ? 's' : ''}, ${props.capacity.pending} en attente de confirmation.`
})

const ctaLabel = computed(() => (mode.value === 'waiting_list' ? 'Être mis sur liste d\'attente' : 'S\'inscrire'))

const formErrors = reactive<{ contact_email: string | null, persons: Record<number, string | null> }>({
  contact_email: null,
  persons: {},
})

const submitSchema = v.object({
  contact_email: v.pipe(v.string(), v.email('Adresse email invalide')),
  persons: v.array(v.pipe(v.string(), v.trim(), v.minLength(1, 'Nom requis'), v.maxLength(50, '50 caractères maximum'))),
})

watch(() => props.open, (open) => {
  if (open) {
    step.value = 'detail'
    email.value = ''
    reset()
  }
})

function openForm() {
  reset()
  email.value = ''
  step.value = 'form'
}

function goBack() {
  step.value = 'detail'
}

async function onSubmit() {
  const parsed = v.safeParse(submitSchema, { contact_email: email.value, persons: persons.value })
  formErrors.contact_email = null
  formErrors.persons = {}
  if (!parsed.success) {
    for (const issue of parsed.issues) {
      const path = v.getDotPath(issue)
      if (path === 'contact_email') {
        formErrors.contact_email = issue.message
      }
      if (path?.startsWith('persons.')) {
        const index = Number(path.split('.')[1])
        if (!Number.isNaN(index)) {
          formErrors.persons[index] = issue.message
        }
      }
    }
    return
  }
  await submit(parsed.output.contact_email)
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="props.activity?.title"
    :ui="modalUi"
    class="text-highlighted"
    @update:open="emit('update:open', $event)"
  >
    <template #description>
      <span
        v-if="props.activity?.game"
        class="text-toned flex items-center gap-1"
      >
        <UIcon name="i-lucide-dices" />
        {{ props.activity.game }}
      </span>
    </template>
    <template #body>
      <div v-if="props.activity" tabindex="-1" class="flex flex-col gap-3 focus:outline-none">
        <div v-if="step === 'detail'" class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <UBadge :color="badge.color" variant="solid">
              {{ badge.label }}
            </UBadge>
            <PrizePopover
              v-if="props.activity.prizes"
              :prizes="props.activity.prizes"
              :show-label="true"
            />
          </div>

          <div class="text-sm text flex items-center gap-1">
            <UIcon name="i-lucide-clock" />
            {{ formatPresqueSchedule(props.activity.start, props.activity.end) }}
          </div>
          <div v-if="props.activity.organizer" class="text-sm flex items-center gap-1">
            <UIcon name="i-lucide-contact" />
            <UButton
              v-if="props.activity.organizer[1]"
              :to="props.activity.organizer[1]"
              target="_blank"
              variant="link"
              :label="props.activity.organizer[0]"
            />
            <span v-else>{{ props.activity.organizer[0] }}</span>
          </div>

          <div v-for="desc in props.activity.pre_img_description" :key="desc">
            {{ desc }}
          </div>

          <img
            v-if="activityImage"
            :src="activityImage.src"
            alt=""
            class="rounded max-h-[50vh] w-auto max-w-full mx-auto"
          >

          <div v-if="activityImage" class="mt-2">
            <UButton
              icon="i-lucide-brush"
              :to="activityImage.copyright[1]"
              target="_blank"
              size="sm"
              variant="link"
              :label="activityImage.copyright[0]"
            />
          </div>

          <div v-for="desc in props.activity.post_img_description" :key="desc">
            {{ desc }}
          </div>

          <div v-if="capacityLine">{{ capacityLine }}</div>
          <div v-if="pendingLine" class="text-xs text-muted">
            {{ pendingLine }}
          </div>

          <div class="flex justify-between mt-2">
            <UButton v-if="props.capacity && mode !== 'none'" icon="i-lucide-notebook-pen" @click="openForm">
              {{ ctaLabel }}
            </UButton>
            <UButton v-else-if="!props.capacity" icon="i-lucide-notebook-pen" disabled>
              Inscription indisponible
            </UButton>
          </div>
        </div>

        <div v-else class="flex flex-col gap-3">
          <div v-if="status === 'success' && success" class="flex flex-col items-center gap-3 text-center">
            <UIcon :name="success.waitlisted ? 'i-lucide-hourglass' : 'i-lucide-party-popper'" class="text-4xl text-primary" />
            <p>{{ success.message }}</p>
          </div>

          <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
            <div>{{ capacityLine }}</div>
            <div v-if="pendingLine" class="text-xs text-muted">
              {{ pendingLine }}
            </div>

            <UFormField label="Email de contact" hint="Un seul email pour tout le groupe" :error="formErrors.contact_email ?? undefined">
              <UInput v-model="email" type="email" placeholder="vous@exemple.ch" class="w-full" />
            </UFormField>

            <div class="flex flex-col gap-2">
              <UFormField
                v-for="(person, index) in persons"
                :key="index"
                :label="`Participant·e ${index + 1}`"
                :error="formErrors.persons[index] ?? undefined"
              >
                <div class="flex gap-2 w-full">
                  <UInput
                    :model-value="person"
                    placeholder="Prénom et nom"
                    class="flex-1"
                    @update:model-value="setPerson(index, $event)"
                  />
                  <UButton
                    v-if="persons.length > 1"
                    icon="i-lucide-user-round-x"
                    color="neutral"
                    variant="outline"
                    aria-label="Retirer cette personne"
                    @click="removePerson(index)"
                  />
                </div>
              </UFormField>
            </div>

            <UTooltip
              v-if="mode === 'subscription' && !canAdd"
              text="Impossible d'ajouter davantage de personnes : la capacité de cette activité est atteinte."
              :delay-duration="0"
            >
              <span>
                <UButton icon="i-lucide-user-round-plus" color="neutral" variant="outline" disabled>
                  Ajouter une personne
                </UButton>
              </span>
            </UTooltip>
            <UButton
              v-else-if="mode === 'subscription'"
              icon="i-lucide-user-round-plus"
              color="neutral"
              variant="outline"
              :disabled="!canAdd"
              @click="addPerson"
            >
              Ajouter une personne
            </UButton>

            <div v-if="status === 'error' && error" class="text-error text-sm">
              {{ error }}
            </div>

            <div class="flex justify-between">
              <UButton color="neutral" variant="subtle" @click="goBack">
                Retour
              </UButton>
              <UButton type="submit" icon="i-lucide-notebook-pen" :loading="status === 'loading'" :disabled="!canSubmit">
                {{ ctaLabel }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </template>
  </UModal>
</template>
