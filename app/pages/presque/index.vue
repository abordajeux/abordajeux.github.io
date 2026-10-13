<script setup lang="ts">

const VENUE_NAME = 'Cité des étudiants, Clos-Brochet 10'
const VENUE_CITY = '2000 Neuchâtel'
const COORDINATES = '2562125.81,1205165.67'


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
      Le programme est en ligne ! Vous pouvez voir les différentes activités et vous inscrire à l'avance.
    </p>

    <UButton to="/presque/programme" icon="i-lucide-calendar-check-2" size="lg" class="mb-4">
      Voir le programme et s'inscrire
    </UButton>
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
        Vous voulez nous aider ? C'est gentil.
      </h2>
      <UButton
        to="/presque/nous-aider"
        icon="i-lucide-heart-handshake"
        color="secondary"
        variant="outline"
        class="mt-4 w-full justify-center"
      >
        Devenez bénévole
      </UButton>
    </div>
  </div>
</template>
