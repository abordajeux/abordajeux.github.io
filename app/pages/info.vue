<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui'
import { Forminit } from 'forminit';
import { isMobile } from '@/stores/appStore';
const UIcon = resolveComponent ('UIcon')
interface Members {
    "Avantage": string,
    "Non membre": boolean,
    "Tarif Réduit": boolean,
    "Tarif Plein": boolean,
    "Tarif Généreux": boolean,
    "Tarif Mécène": boolean}

const membership_features = ref([
  {
    "Avantage": "Venir aux soirées publiques",
    "Non membre": true,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },  {
    "Avantage": "Participer à un one shot de jeu de rôle",
    "Non membre": true,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },  {
    "Avantage": "Participer à une campagne de jeu de rôle",
    "Non membre": false,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Venir aux soirées internes",
    "Non membre": false,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Avoir la priorité pendant les soirées publiques",
    "Non membre": false,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Être prévenu en avance des évènements",
    "Non membre": false,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Profiter du local de l'association",
    "Non membre": false,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Avoir une bonne excuse d'imiter un pirate",
    "Non membre": false,
    "Tarif Réduit": true,
    "Tarif Plein": true,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Avoir une checkmark de plus que les autres",
    "Non membre": false,
    "Tarif Réduit": false,
    "Tarif Plein": false,
    "Tarif Généreux": true,
    "Tarif Mécène": true
  },
    {
    "Avantage": "Et encore une de plus",
    "Non membre": false,
    "Tarif Réduit": false,
    "Tarif Plein": false,
    "Tarif Généreux": false,
    "Tarif Mécène": true
  }

])

const columns: TableColumn<Members>[]=[
  {
    accessorKey: 'Avantage',
    header: 'Avantage',
  },
  {
    accessorKey: 'Non membre',
    header: 'Non membre',
    cell: ({ row }) => {
      return h(UIcon, { name: row.getValue('Non membre') ? 'i-lucide-check' : 'i-lucide-x' })
    }
  },
    {
    accessorKey: 'Tarif Réduit',
    header: 'Tarif Réduit (100.-)',
    cell: ({ row }) => {
      return h(UIcon, { name: row.getValue('Tarif Réduit') ? 'i-lucide-check' : 'i-lucide-x' })
    }
  },
    {
    accessorKey: 'Tarif Plein',
    header: 'Tarif Plein (200.-)',
    cell: ({ row }) => {
      return h(UIcon, { name: row.getValue('Tarif Plein') ? 'i-lucide-check' : 'i-lucide-x' })
    }
  },
  {
    accessorKey: 'Tarif Généreux',
    header: 'Tarif Généreux (300.-)',
    cell: ({ row }) => {
      return h(UIcon, { name: row.getValue('Tarif Généreux') ? 'i-lucide-check' : 'i-lucide-x'})
    }},
{
    accessorKey: 'Tarif Mécène',
    header: 'Tarif Mécène (400.-)',
    cell: ({ row }) => {
      return h(UIcon, { name: row.getValue('Tarif Mécène') ? 'i-lucide-check' : 'i-lucide-x' })
    }
  }
]


const forminit = new Forminit({ proxyUrl: 'https://forminit.com/f/7y9rmra9z9o' });

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const error = ref<string | null>(null);

const currentDate = new Date()
const localGrabDate = new Date(2026, 6, 14)
const schema= v.object({
  "fi-text-subject": v.string(),
  "fi-sender-email": v.pipe(v.string(), v.email('Invalid email')),
  "fi-text-message": v.string(),
})


type Schema = v.InferOutput<typeof schema>


const state = reactive({
  "fi-text-subject": '',
  "fi-sender-email": '',
  "fi-text-message": '',
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
console.error(formData)
  const { data, error: submitError } = await forminit.submit( '7y9rmra9z9o' , formData);

  if (submitError) {
    status.value = 'error';
    error.value = submitError.message;
    return;
  }

  status.value = 'success';
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-1">
    <h1 class="text-4xl font-bold text-primary flex ">
      Informations à nôtre sujet.
    </h1>
    <div id="LOCAL" class="items-center justify-center p-3">
      <div class="text-3xl font-bold text-primary text-center">
        Où Jouons nous ?
      </div>
      <div v-if="localGrabDate < currentDate" class="p-3">
        Situé à la Rue de la Gare 4 à Peseux, le local est le lieu central de l'association,
        quartier général de l'équipage où l'on organise la majorité de nos événements réguliers.
        Il est disponible pour tout membre qui souhaite organiser une petite partie ou deux de jeu,
        même en dehors des activités officielles.
      </div>
      <div v-else class="p-3">
        On squatte à l'hôtel des associations pour le moment.
      </div>
      <iframe src="https://map.geo.admin.ch/#/embed?lang=en&center=2561604.98,1205068.07&z=9.882&topic=ech&layers=KML|https://public.geo.admin.ch/api/kml/files/DqxEqk-0RFSxh3rtO38Z9g&bgLayer=ch.swisstopo.pixelkarte-grau&featureInfo=default&noSimpleZoom=true&hideEmbedUI" style="border: 0;width: 100%;height: 400px;max-width: 100%;max-height: 100%;" allow="geolocation"></iframe>
    </div>

    <div id="JOIN" class="p-3 text-3xl font-bold text-primary ">
      Nous rejoindre ou nous contacter
    </div>
    <UTheme
    :ui="{
      formField: {
        root: 'flex max-sm:flex-col justify-between gap-8 [&>*]:flex-1'      },
    }">
     <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit" v-if="showForm">
      <UFormField label="Pourquoi nous écrivez vous ?" name="subject" >
      <UInput v-model="state['fi-text-subject']" class="w-full"/>
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="state['fi-sender-email']" class="w-full"/>
    </UFormField>

    <UFormField label="Message" name="message">
      <UTextarea v-model="state['fi-text-message']" type="textarea" class="w-full"/>
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
        <div class="text-3xl font-bold text-primary text-center p-3">
        Prix et Avantages des membres
      </div>
      <div class="text-xs p-3">
        Les mineurs entre 10 et 16 ans accompagnés payent la moitié du prix de leur parent
      </div>
  <UTable sticky :data="membership_features"     :columns="columns" v-if="!isMobile">
  </UTable>
  </div>

</template>
