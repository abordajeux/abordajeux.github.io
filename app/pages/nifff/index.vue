<script setup lang="ts">
const highestYear = highestEditionYear()
const hasEditions = computed(() => highestYear !== undefined)
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-3 text-center">
    <h1 class="text-4xl font-bold text-primary p-3">
      <template v-if="hasEditions">L'édition {{ highestYear }} est terminée</template>
      <template v-else>Collaboration avec le NIFFF</template>
    </h1>

    <div v-if="hasEditions" class="text-xl text-neutral p-3 max-w-2xl space-y-3">
      <p>
        Nous avons été heureux.ses de vous offrir quelques loisirs en parallèle
        du NIFFF cette année. Nous espérons que vous avez pris autant de plaisir à participer que nous.
      </p>
      <p>
        Nous ne pouvons pas vous garantir que nous serons là l'année prochaine, mais si celà est
        possible, il est certain que nous reviendrons avec plaisir.
        En attendant, n'hésitez pas à nous rendre visite lors de nos autres événements.
      </p>
    </div>
    <div v-else class="text-xl text-neutral p-3">
      Revenez bientôt pour plus d'informations.
    </div>

    <UButton
      v-if="hasEditions"
      to="/nifff/galerie"
      size="lg"
      icon="i-lucide-images"
      class="mt-4"
    >
      Voir les éditions passées
    </UButton>
  </div>
</template>
