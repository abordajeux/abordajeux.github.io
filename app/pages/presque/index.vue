<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import placeholder from '@/assets/images/placeholder.png'

const CONTACT_FORM_ID = '7y9rmra9z9o'
const VENUE_NAME = 'Cité des étudiants Clos-Brochet 10'
const VENUE_CITY = '2000 Neuchâtel'
const COORDINATES = '2562125.81,1205165.67'

type IntentValue = 'programme' | 'benevole' | 'both'
type Intent = { value: IntentValue, label: string, subject: string, message: string }

const INTENTS: Intent[] = [
  {
    value: 'programme',
    label: 'Informez-moi du programme',
    subject: 'Presque 24h du Jeu — inscription pour suivre le programme',
    message: 'Je souhaite être tenu·e au courant du programme des Presques 24h du Jeu (14–15 novembre 2026).',
  },
  {
    value: 'benevole',
    label: 'Je souhaite devenir bénévole',
    subject: 'Presque 24h du Jeu — proposition de bénévolat',
    message: 'Je souhaite proposer mon aide en tant que bénévole pour les Presques 24h du Jeu (14–15 novembre 2026).',
  },
  {
    value: 'both',
    label: 'Informez-moi du programme et je souhaite devenir bénévole',
    subject: 'Presque 24h du Jeu — inscription programme + bénévolat',
    message: 'Je souhaite être tenu·e au courant du programme des Presques 24h du Jeu (14–15 novembre 2026) et je propose mon aide en tant que bénévole.',
  },
]

const selectedIntent = ref<IntentValue>('programme')
const selectedConfig = computed(() => INTENTS.find(intent => intent.value === selectedIntent.value)!)

const emailSchema = v.object({
  'fi-sender-email': v.pipe(v.string(), v.email('Adresse email invalide')),
})
type EmailSchema = v.InferOutput<typeof emailSchema>

const emailState = reactive({ 'fi-sender-email': '' })

const { status, error, showForm, submit } = useForminitForm({
  formId: CONTACT_FORM_ID,
  onSuccessToast: { title: 'Envoyé', description: 'Merci, on vous tiendra au courant !' },
})

async function onSubmit(event: FormSubmitEvent<EmailSchema>) {
  event.preventDefault()
  await submit({
    ...event.data,
    'fi-text-subject': selectedConfig.value.subject,
    'fi-text-message': selectedConfig.value.message,
  })
}

const mapShown = ref(false)
function toggleMap() {
  mapShown.value = !mapShown.value
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center p-3 max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold text-primary p-3 text-center">
      Les Presque 24h du Jeu 2026
    </h1>

    <p class="text-xl text-neutral p-3 text-center">
      Presque 24h de jeux de sociétés et de rôles. Viendez tous et invitez vos ami.e.s. Si vous n'avez pas d'amis, rejoignez nous et vous devriez en avoir quelques uns d'ici à la fin de l'évènement.
    </p>
    <p class="text-xl text-neutral p-3 text-center">
    Le programme est en cours d'élaboration et nous devrions vous le donner presque bientôt. Lorsqu'il sera là, vous pourrez voir les différentes activités et vous inscrire à l'avance.
    </p>
    <p class="text-xl text-neutral p-3 text-center">
      Il y aura des jeux de société et des jeux de rôle, du jeu de carte et des jeux sociaux. Des gens qui vous expliquent des règles et des gens qui servent à manger et à boire.
    </p>

    <img :src="resolveImage('presque/affiche_presque_no_sponsor.jpeg')" alt="" class="max-h-100 w-auto rounded my-4">

    <div class="grid md:grid-cols-2 gap-6 w-full mb-8">
      <div class="flex flex-col items-center text-center">
        <UIcon name="i-lucide-calendar-days" class="text-3xl text-primary mb-2" />
        <div class="text-lg font-semibold">
          Samedi 14 — Dimanche 15 Novembre 2026
        </div>
        <div class="text-neutral">
          De 10h (samedi) à 18h (dimanche)
        </div>
      </div>

      <div class="flex flex-col items-center text-center">
        <UIcon name="i-lucide-map-pin-house" class="text-3xl text-primary mb-2" />
        <div class="text-lg font-semibold">
          {{ VENUE_NAME }}
        </div>
        <div class="text-neutral">
          {{ VENUE_CITY }}
        </div>
        <UButton
          color="secondary"
          variant="outline"
          size="sm"
          icon="i-lucide-map"
          class="mt-2"
          @click="toggleMap"
        >
          {{ mapShown ? 'Masquer la carte' : 'Voir sur la carte' }}
        </UButton>
      </div>
    </div>

    <div v-if="mapShown" class="w-full mb-8">
      <iframe
        :src="`https://map.geo.admin.ch/#/embed?lang=fr&center=${COORDINATES}&z=10&topic=ech&layers=&bgLayer=ch.swisstopo.pixelkarte-grau&hideEmbedUI&crosshair=cross`"
        style="border: 0; width: 100%; height: 300px; max-width: 100%; max-height: 100%;"
        allow="geolocation"
      />
    </div>

    <div class="w-full max-w-md">
      <h2 class="text-2xl font-bold text-primary mb-3 text-center">
        Vous voulez Viendre ?
      </h2>
      <p class="text-neutral text-center mb-4">
        Le programme se précisera bientôt et nous cherchons des bénévoles. Dites-nous comment vous impliquer.
      </p>

      <div v-if="status === 'error'" class="text-error text-sm mb-3 text-center">
        {{ error }}
      </div>

      <UForm v-if="showForm" :schema="emailSchema" :state="emailState" class="space-y-4" @submit="onSubmit">
        <UFormField label="Que souhaitez-vous ?" name="intent">
          <USelect
            v-model="selectedIntent"
            :items="INTENTS"
            value-key="value"
            option-attribute="label"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="emailState['fi-sender-email']" type="email" class="w-full" placeholder="vous@exemple.ch" />
        </UFormField>

        <UButton type="submit" :disabled="status === 'loading'" class="w-full justify-center">
          {{ status === 'loading' ? 'Envoi en cours…' : 'Envoyer' }}
        </UButton>
      </UForm>

      <div v-else class="text-center p-4 text-neutral">
        Merci, on vous tiendra au courant !
      </div>
    </div>
  </div>
</template>
