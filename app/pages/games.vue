<script setup lang="ts">
import { buildGameUrl, loadRecentGames } from '~/utils/gamesLoader'

const RECENT_GAME_COUNT = 8
const items = loadRecentGames(RECENT_GAME_COUNT)

function formatAcquisitionDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
}

function blurAfterClick(event: MouseEvent) {
  const target = event.currentTarget
  if (target instanceof HTMLElement) {
    target.blur()
  }
}
</script>

<template>
  <div class="min-h-[80vh] items-center flex flex-col text-xl">
    <h1 class="text-4xl font-bold text-primary">
      Nos Jeux
    </h1>
    <div class="justify-center p-3">
      L'association est encore jeune et ne dispose pas d'une collection très étoffée. Cette dernière croît tous les mois, et nos membres nous suggèrent des nouveautés, ou des classiques, que nous devrions, à leur avis, posséder. Il arrive même parfois que nous les écoutions.
    </div>
    <div class="justify-center p-3">
      Nous proposons aussi régulièrement des campagnes ou des one-shots de jeu de rôle. Si vous souhaitez être mis au courant du début d'une campagne ou de l'organisation d'un one shot, n'hésitez pas à nous contacter.
    </div>
    <UButton
      to="https://www.myludo.fr/#!/profil/a-l-abordajeux-95567"
      target="_blank"
      icon="i-lucide-dices"
      trailing-icon="i-lucide-dices"
      color="neutral"
      size="xl"
      variant="ghost"
      class="p-5 text-xl"
    >Allez voir notre collection complète sur MyLudo</UButton>

    <div id="LAST_AQUISITIONS" class="p-3 text-3xl font-bold text-primary">
      Nos Dernières Acquisitions
    </div>

    <div class="p-3 w-full max-w-md mx-auto">
      <UCarousel
        v-if="items.length > 0"
        v-slot="{ item }"
        :items="items"
        class="w-full"
        loop
        :autoplay="{ delay: 2000 }"
      >
        <div class="flex flex-col items-center text-center px-2">
          <div v-if="item.image_url">
            <img
              :src="resolveImage(item.image_url)"
              :alt="item.titre"
              width="300"
              height="300"
              class="rounded-lg"
              loading="lazy"
            >
          </div>
          <div
            v-else
            class="w-[300px] h-[300px] max-w-full flex items-center justify-center bg-primary/10 rounded-lg p-4"
          >
            <span class="text-sm text-neutral">{{ item.titre }}</span>
          </div>
          <div class="text-sm font-semibold mt-2 text-primary">
            {{ item.titre }}
          </div>
          <div v-if="item.sous_titre" class="text-xs text-neutral">
            {{ item.sous_titre }}
          </div>
          <div class="text-xs text-neutral mt-1">
            Acquis le {{ formatAcquisitionDate(item.date_acquisition) }}
          </div>
          <UButton
            :to="buildGameUrl(item)"
            target="_blank"
            size="xs"
            variant="ghost"
            icon="i-lucide-external-link"
            class="mt-2"
            @click="blurAfterClick"
          >
            Voir la fiche du jeu
          </UButton>
        </div>
      </UCarousel>
      <div v-else class="text-neutral text-center p-4">
        Aucune acquisition à afficher pour le moment.
      </div>

      <div class="text-xs text-center mt-3">
        source des photos: BoardGameGeek (et par conséquent, très certainement, les sites des éditeurs)
      </div>
    </div>
  </div>
</template>
