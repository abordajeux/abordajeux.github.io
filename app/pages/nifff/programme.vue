<script lang="ts" setup>
import type { datedEvent } from '~/types/navigation'
import EventSlideOver from '~/components/layouts/composables/eventSlideOver.vue';

const overlay = useOverlay()


interface NIFFFEvent extends datedEvent {
    cardDescription: string
}

const today = new Date()
const nifff_begin_date = new Date(2026,6,4)
const nifff_end_date = new Date(2026, 6, 12)
const everyDay: NIFFFEvent =
    {
        id:"nifff-everyday",
        date: today.getTime() < nifff_begin_date.getTime() ? nifff_begin_date : today,
        hours: ["13:00", "19:00"],
        title:"Jeux de sociétés",
        pre_img_description: [
            "Une sélection de jeux de sociétés basés sur les thématiques du NIFFF sont mis à disposition.",
        "N'hésitez pas à demander à nos bénévoles de vous expliquer les règles de ceux qui vous intéressent."],
        post_img_description: ["Il est possible que sur certaines tranches horaires, il n'y ait pas de bénévoles, mais les jeux restent en libre accès."],
        cardDescription: "Une sélection de jeux de sociétés basés sur les thématiques du NIFFF sont mis à disposition et il y a en général des volontaires pour en expliquer les règles.",
        image_path: "nifff_affiche_semaine.jpeg",
        organizer: "L'ABORDAJEUX",
        isPublic: true,
        prices: {},
        "external_link": ["https://nifff.ch/prog/2026/event/jeux-de-societe/", "Voir sur le site du NIFFF", "i-lucide-notebook-pen", "_blank"],

    }

const activities: NIFFFEvent[] = [
    {
        id:"nifff-saturday",
        date: new Date(2026,6,4),
        hours: ["15:00", "18:00"],
        title:"Le Bastion de Gaïa",
        pre_img_description: ["Des combattant·te·x·s d'élite du règne animal ont été choisi·e·x·s par Gaïa pour concevoir un système capable de freiner l'expansion humaine et protéger les non-humains."],
        post_img_description: [],
        cardDescription: "Des combattant·te·x·s d'élite du règne animal ont été choisi·e·x·s par Gaïa pour concevoir un système capable de freiner l'expansion humaine et protéger les non-humains.",
        image_path: "nifff_affiche_samedi.jpeg",
        organizer: "Jilian",
        isPublic: true,
        prices: {},
        "external_link": ["https://nifff.ch/prog/2026/event/jeu-de-role-le-bastion-de-gaia/", "S'inscrire sur le site du NIFFF", "i-lucide-notebook-pen", "_blank"]
    },
    {
        id:"nifff-sunday",
        date: new Date(2026,6,5),
        hours: ["14:00", "18:00"],
        title:"Mission Archéo",
        pre_img_description: ["L'équipe archéologique de la porte de Baldur recherche un petit groupe d'aventuriers pour une première exploration."],
        post_img_description: [],
        cardDescription: "L'équipe archéologique de la porte de Baldur recherche un petit groupe d'aventuriers pour une première exploration.",
        image_copyright: ["© Affiche par Serasuu","https://www.instagram.com/serasuwu"],
        image_path: "nifff_affiche_dimanche.jpeg",
        organizer: "Noah",
        isPublic: true,
        prices: {},
        "external_link": ["https://nifff.ch/prog/2026/event/jeu-de-role-mission-archeo/", "S'inscrire sur le site du NIFFF", "i-lucide-notebook-pen", "_blank"]

    },
    {
        id:"nifff-monday",
        date: new Date(2026,6,6),
        hours: ["15:00", "19:00"],
        title:"Je ne suis déjà mort",
        pre_img_description: ["Des enquêteur·rice·x·s découvrent qu’une technologie futuriste ne transfère peut-être pas réellement la conscience humaine, mais crée simplement des copies parfaites des individus."],
        post_img_description: [],
        cardDescription: "Des enquêteur·rice·x·s découvrent qu’une technologie futuriste ne transfère peut-être pas réellement la conscience humaine, mais crée simplement des copies parfaites des individus.",
        image_path: "nifff_affiche_lundi.jpeg",
        organizer: "Pierre",
        isPublic: true,
        prices: {},
        "external_link": ["https://nifff.ch/prog/2026/event/jeux-de-societe/", "S'inscrire sur le site du NIFFF", "i-lucide-notebook-pen", "_blank"]

    },
    {
        id:"nifff-thursday",
        date: new Date(2026, 6, 9),
        hours: ["14:00", "16:00"],
        title:"Loups Garous: un reste d'humanité",
        pre_img_description: ["La notion de perte de son identité, de perdre le contrôle, est au coeur de la thématique du loup garou. Nous vous proposons de la revisiter sous un angle plus futuriste."],
        post_img_description: ["Ce qui est un bon paquet de blabla pour dire qu'on va appliquer un thème sur le loup garou, hein :)"],
        cardDescription: "La notion de perte de son identité, de perdre le contrôle, est au coeur de la thématique du loup garou. Nous vous proposons de la revisiter sous un angle plus futuriste.",
        image_path: "nifff_affiche_jeudi.png",
        organizer: "L'ABORDAJEUX",
        isPublic: true,
        prices: {},
        "external_link": ["https://nifff.ch/prog/2026/event/loup-garou-geant/", "S'inscrire sur le site du NIFFF", "i-lucide-notebook-pen", "_blank"]

    },
]
const slideover = overlay.create(EventSlideOver)

async function  openPanel(activity: datedEvent) {
  const instance = slideover.open({
    activity
  })

  await instance.result

  return

}
onBeforeUnmount(() => {
  slideover?.close()

})

</script>

<template>

  <div class="min-h-[400px] flex flex-wrap justify-center items-start gap-6">
    <div class="text-xl text-neutral p-3" v-if="today.getTime() < nifff_end_date.getTime()">
        <UPage>
        <UPageHeader :headline="`Activités du 4 au 9 Juillet 2026`">

        </UPageHeader>

        <UPageCard
            :id="everyDay.id"
            :title="everyDay.title"
            @click="openPanel(everyDay)"
        >
        <template #default>
    <div class="flex gap-4">
      <!-- Left -->
      <img
        :src="resolveImage(everyDay.image_path)"
        class="h-48 w-auto flex-shrink-0 rounded"
      />

      <!-- Right -->
      <div class="flex flex-col flex-1">

        <p class="mt-2 text-sm">
          {{ everyDay.cardDescription }}
        </p>

        <div class="mt-4 text-xs" v-if="everyDay.organizer">
          <UIcon name="i-lucide-contact" class="text-xl" />
          {{ everyDay.organizer }}
        </div>

        <div class="text-xs" v-if="everyDay.hours.length === 2">
          <UIcon name="i-lucide-clock" class="text-xl" />
          Tous les jours, de {{ everyDay.hours[0] }} à {{ everyDay.hours[1] }}
        </div>
      </div>
    </div>
  </template>

        </UPageCard>
        <UPageCard v-for="activity in activities"
            :id="activity.id"
            :key="activity.id"
            :title="activity.title"
            :description="activity.cardDescription"
            @click="openPanel(activity)">


<template #default>
    <div class="flex gap-4">
      <!-- Left -->
      <img
        :src="resolveImage(activity.image_path)"
        class="h-48 w-auto flex-shrink-0 rounded"
      />

      <!-- Right -->
      <div class="flex flex-col flex-1">

        <p class="mt-2 text-sm">
          {{ activity.cardDescription }}
        </p>

        <div class="mt-4 text-xs" v-if="everyDay.organizer">
          <UIcon name="i-lucide-contact" class="text-xl" />
          {{ activity.organizer }}
        </div>

        <div class="text-xs" v-if="everyDay.hours.length === 2">
          <UIcon name="i-lucide-clock" class="text-xl" />
          Le {{ activity.date.toLocaleDateString('FR-fr') }}, de {{ activity.hours[0] }} à {{ activity.hours[1] }}
        </div>
        <div class="text-xs" v-if="activity.image_copyright">
                    <UIcon name="i-lucide-brush" class="text-xl"/> {{activity.image_copyright[0]}}
        </div>
      </div>
    </div>
  </template>


    </UPageCard>
        </UPage>
    </div>
    <div class="text-xl text-neutral p-3" v-else>
        L'événement est fini, merci d'être venu
    </div>
  </div>
</template>
