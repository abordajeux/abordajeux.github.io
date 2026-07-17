<script lang="ts" setup>
    import placeholder from '@/assets/images/placeholder.png'


</script>

<template>
  <div class="min-h-[400px] flex flex-wrap justify-center items-start gap-6">
  <h1 class="w-full text-4xl font-bold text-primary p-3 text-center">
    En Construction
  </h1>
 <UPageCard
    id="NIFFF"
    class="w-full max-w-md flex-1"
    title="Collaboration avec le NIFFF - 2026"
    description="L'abordajeux collabore avec le NIFFF, proposant des jeux de sociétés et des jeux de rôles en rapport avec les thèmes du festival."
    icon="i-lucide-skull"
    to="/nifff"
  >
    <img :src="resolveImage('nifff_affiche_semaine.jpeg')" class="max-h-100 w-auto">
  </UPageCard>

  <UPageCard
    id="PNJ"
    class="w-full max-w-md flex-1"
    title="Les Presques 24h du Jeu 2026"
    description="L'abordajeux revient en 2026 avec presques 24h de jeux de sociétés et de rôles. Viendez tous:3."
    icon="i-lucide-skull"
    to="/presque"
  >
    <img :src="placeholder" class="max-h-100 w-auto">
    <div class="text-xs">
        <UIcon name="i-lucide-brush" class="text-xl"/> placeholder par JonGriffon
    </div>
  </UPageCard>
</div>
</template>
