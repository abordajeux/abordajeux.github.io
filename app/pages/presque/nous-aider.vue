<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const emailSchema = v.object({
  'sender_email': v.pipe(v.string(), v.email('Adresse email invalide')),
})
type EmailSchema = v.InferOutput<typeof emailSchema>

const emailState = reactive({ 'sender_email': '' })

const { status, error, showForm, submit } = useApiForm({
  endpoint: '/forms/benevole',
  onSuccessToast: { title: 'Envoyé', description: 'Merci ! Vérifiez votre boîte mail pour la suite.' },
})

async function onSubmit(event: FormSubmitEvent<EmailSchema>) {
  event.preventDefault()
  await submit(event.data)
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center p-3 max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold text-primary p-3 text-center">
      Nous aider
    </h1>

    <p class="text-xl text-neutral p-3 text-center">
      Organiser un événement demande beaucoup de travail en amont, mais aussi sur place.
      Si rejoindre l'équipage le temps d'un week end vous tente, si le jeu de société est votre passion,
      si vous avez envie d'offrir un peu de temps en échange d'un repas, de l'entrée et de quelques boissons,
      nous serons heureux de vous accueillir comme il se doit.
    </p>

    <div class="w-full max-w-md">
      <h2 class="text-2xl font-bold text-primary mb-3 text-center">
        Devenir bénévole
      </h2>
      <p class="text-neutral text-center mb-4">
        Laissez votre adresse email : nous vous enverrons directement la marche à suivre pour rejoindre l'équipe.
      </p>

      <div v-if="status === 'error'" class="text-error text-sm mb-3 text-center">
        {{ error }}
      </div>

      <UForm v-if="showForm" :schema="emailSchema" :state="emailState" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput v-model="emailState.sender_email" type="email" class="w-full" placeholder="vous@exemple.ch" />
        </UFormField>

        <UButton type="submit" :disabled="status === 'loading'" icon="i-lucide-heart-handshake" class="w-full justify-center">
          {{ status === 'loading' ? 'Envoi en cours…' : 'Devenir bénévole' }}
        </UButton>
      </UForm>

      <div v-else class="text-center p-4 text-neutral">
        Merci ! Un email vient de vous être envoyé avec la marche à suivre pour rejoindre l'équipage.
        Pensez à vérifier vos spams.
      </div>
    </div>
  </div>
</template>
