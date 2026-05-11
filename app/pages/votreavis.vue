<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { Forminit } from 'forminit';
import StarRating from '~/components/layouts/layout_components/StarRating.vue';

const forminit = new Forminit({ proxyUrl: 'https://forminit.com/f/ulekc1cw41t' });

const possibleEvents: string[]= ["Soirée jeu du mercredi", "Game O'Clock", "One shot de jeu de rôle", "Événement au NIFFF", "Autre"]

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const error = ref<string | null>(null);

const schema= v.object({
  "fi-text-event": v.string(),
  "fi-sender-email": v.pipe(v.string(), v.email('Invalid email')),
  "fi-text-message": v.string(),
  "fi-number-planning": v.number(),
  "fi-number-welcome": v.number()
})


type Schema = v.InferOutput<typeof schema>


const state = reactive({
  "fi-text-event": '',
  "fi-sender-email": '',
  "fi-text-message": '',
  "fi-number-planning": 0,
  "fi-number-welcome": 0,
})

const toast = useToast()
const showForm = ref(true)


async function onSubmit(event: FormSubmitEvent<Schema>) {
  await handleSubmit(event)
  toast.add({ title: 'Success', description: 'Votre demande a été transmise avec succès', color: 'success' })
  showForm.value = false
}

async function handleSubmit(e: FormSubmitEvent<Schema>) {
  e.preventDefault();
  status.value = 'loading';
  error.value = null;

  const form = e.data;
  const formData = new FormData()
  Object.entries(form).forEach(([keyof, value]) =>
  formData.append(keyof, value))
  const { data, error: submitError } = await forminit.submit( 'ulekc1cw41t' , formData);

  if (submitError) {
    status.value = 'error';
    error.value = submitError.message;
    return;
  }

  status.value = 'success';
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center p-3">

    <h1 class="text-4xl font-bold text-primary p-3">
      {{ status === 'success' ? "Merci de votre retour" : "Donnez votre avis sur un événement" }}
    </h1>

    <UTheme
    :ui="{
      formField: {
        root: 'flex max-sm:flex-col justify-between gap-8 [&>*]:flex-1'      },
    }">
      <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit" v-if="showForm">

        <UFormField label="Sur quel événement souhaitez vous faire un retour ?" name="subject" >
            <UInputMenu v-model="state['fi-text-event']" :items="possibleEvents" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state['fi-sender-email']" class="w-full"/>
        </UFormField>

        <UFormField label="Message" name="message">
          <UTextarea v-model="state['fi-text-message']" type="textarea" class="w-full"/>
        </UFormField>

            <UFormField label="Comment était l'accueil ?" name="rating">
        <StarRating v-model="state['fi-number-welcome']" />
        </UFormField>

        <UFormField label="Comment était l'organisation?" name="rating">
      <StarRating  v-model="state['fi-number-planning']"  />
    </UFormField>

        <div v-if="status === 'error'">
          {{  error }}
        </div>

        <UFormField label="" name ="submit">
          <UButton type="submit" :disabled="status === 'success' || status === 'error'">
            {{ status === 'loading' ? 'Envoi en cours' : status === 'success' ? 'Merci de votre message' : 'Envoyer'}}
          </UButton>
        </UFormField>

      </UForm>
    </UTheme>

</div>
</template>
