<script lang="ts" setup>
    import beerImage from '@/assets/images/beeroclock.png'


</script>

<template>
  <div class="min-h-[400px] flex flex-wrap justify-center items-start gap-6">
  <h1 class="w-full text-4xl font-bold text-primary p-3 text-center">
    En Construction
  </h1>
 <UPageCard
    id="NIFFF"
    class="w-full max-w-md flex-1"
    title="Collaboration avec le NIFFF"
    description="L'abordajeux collabore avec le NIFFF, proposant des jeux de sociétés et des jeux de rôles en rapport avec les thèmes du festival."
    icon="i-lucide-skull"
    to="/nifff"
  >
    <img :src="beerImage" />
  </UPageCard>

  <UPageCard
    id="PNJ"
    class="w-full max-w-md flex-1"
    title="Les Presques 24h du Jeu"
    description="L'abordajeux revient en 2026 avec presques 24h de jeux de sociétés et de rôles. Viendez où je vous pète les genoux :3."
    icon="i-lucide-skull"
    to="/presque"
  >
    <img :src="beerImage" />
  </UPageCard>

</div>
</template>
