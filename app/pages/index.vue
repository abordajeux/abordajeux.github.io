<script setup lang="ts">
    import logo from '@/assets/images/Logo-new.png'
</script>
<template>
  <div class="min-h-[80vh] flex flex-col items-center text-xl text-center">
    <img :src="logo" class="p-3">
    <div class="p-3">
      Oyez Oyez braves matelots !
    </div>
    <div class="p-3 ">
      Bienvenue sur le site de A L'ABORDAJEUX.
    </div>
    <div class="p-3">
      Nous sommes une asssociation de fiers pirates sur Neuchâtel et nous organisons des soirées jeux de sociétés et jeux de rôles toutes les semaines.
    </div>
    <div class="p-3">
      Ici, tu pourras retrouver toutes les informations sur les évènements a venir, nos projets, nos jeux et comment nous contacter.
    </div>
    <div class="p-3.5">
      Petite nouvelle: les presques 24h sont bientôt de retour.

      <UButton
          to="/presque"
          icon="i-lucide-skull"
          color="secondary"
          variant="outline"
          class="mt-4 w-full justify-center"
        >
          Aller sur la page de l'événement
      </UButton>
      <UButton
          to="/presque/nous-aider"
          icon="i-lucide-heart-handshake"
          color="secondary"
          variant="outline"
          class="mt-4 w-full justify-center"
        >
          Envie de nous aider ? Devenez bénévole
      </UButton>

    </div>

  </div>
  </template>
