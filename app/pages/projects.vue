<script lang="ts" setup>


</script>

<template>
  <div class="min-h-[400px] flex flex-wrap justify-center items-start gap-6">
  <h1 class="w-full text-4xl font-bold text-primary p-3 text-center">
    Nos Projets
  </h1>
  <div class="text-xl text-neutral p-3">
    De temps en temps, nous avons des projets et des événements plus importants, qui méritent leurs propres pages :)
  </div>
 <UPageCard
    id="NIFFF"
    class="w-full max-w-md flex-1"
    title="Collaboration avec le NIFFF"
    description="L'abordajeux collabore avec le NIFFF, proposant des jeux de sociétés et des jeux de rôles en rapport avec les thèmes du festival."
    icon="i-lucide-skull"
    to="/nifff"
  >
  <div class="relative">
    <img :src="resolveImage('nifff/2026/nifff_affiche_semaine.jpeg')" class="max-h-100 w-auto">
          <UBadge color="neutral" variant="solid" class="absolute top-2 right-2">Déjà Fini</UBadge>
</div>
  </UPageCard>

  <UPageCard
    id="SOON"
    class="w-full max-w-md flex-1"
    title="Quelque chose se prépare..."
    description="L'équipage mijote un plan qui aboutira en Novembre... Mais on vous en reparlera avant"
    icon="i-lucide-hourglass"
    to="/soon"
  >
    <div class="relative">
      <img :src="resolveImage('soon.png')" class="max-h-100 w-auto opacity-80">
      <UBadge color="success" variant="solid" class="absolute top-2 right-2">BIENTÔT</UBadge>
    </div>
  </UPageCard>
</div>
</template>
