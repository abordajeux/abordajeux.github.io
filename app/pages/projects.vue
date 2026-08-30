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
    id="portesouvertes"
    class="w-full max-w-md flex-1"
    title="Les Portes Ouvertes"
    description="L'équipage veut vous recruter. Et la meilleur façon de faire, c'est encore de vous inviter à bord. Avec un peu de chance, vous aurez envie de rester."
    icon="i-lucide-ship-wheel"
    to="/portesouvertes"
  >
    <div class="relative">
      <img :src="resolveImage('portesouvertes.jpeg')" class="max-h-100 w-auto opacity-80">
      <UBadge color="success" variant="solid" class="absolute top-2 right-2">SEPTEMBRE 2026</UBadge>
    </div>
  </UPageCard>
  <UPageCard
    id="presque"
    class="w-full max-w-md flex-1"
    title="Quelque chose se prépare..."
    description="L'équipage mijote un plan qui aboutira en Novembre... Et on vous en parle maintenant."
    icon="i-lucide-skull"
    to="/presque"
  >
    <div class="relative">
      <img :src="resolveImage('presque/affiche_presque_no_sponsor.jpeg')" class="max-h-100 w-auto opacity-80">
      <UBadge color="success" variant="solid" class="absolute top-2 right-2">NOVEMBRE 2026</UBadge>
    </div>
  </UPageCard>
</div>
</template>
