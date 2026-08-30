<script setup lang="ts">
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center text-center p-3 max-w-3xl mx-auto">

    <h1 class="text-4xl font-bold text-primary p-3">
      Rendez visite à l'équipage
    </h1>

    <p class="text-xl text-neutral p-3">
      Le 12 Septembre dès 11h30, l'équipage ouvre les portes de son local à tous ceux qui souhaitent jouer quelques parties, manger quelques crêpes, et rencontrer quelques personnes.
    </p>

    <p class="text-xs text-neutral p-3">
      On m'annonce dans l'oreillette qu'il y aura aussi une initiation au jeu de rôle, pour ceux qui sont intéressés. Je ne sais pas encore à quelle heure, du coup je vous conseille d'arriver tôt pour réserver votre place :).
    </p>

    <img :src="resolveImage('portesouvertes.jpeg')" alt="" class="max-h-100 w-auto rounded my-6 opacity-80">

    <div class="flex flex-col items-center gap-2 text-neutral">
      <UIcon name="i-lucide-ship-wheel" class="text-4xl text-primary" />
      <p class="text-lg">
        Vous trouverez une carte pour accéder au local dans la section "informations"
        </p>      <p class="text-lg text-xs">
          (Non, j'avais pas du tout la flemme de remettre la carte ici)
      </p>
    </div>
  </div>
</template>
