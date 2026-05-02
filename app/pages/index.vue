<script setup lang="ts">
import { usePirateStore } from '@/stores/appStore';
    import logo from '@/assets/images/Logo-new.png'

const pirateStore = usePirateStore()
onBeforeMount(() => {
        pirateStore.changeProject(window.location.pathname.split('/').toReversed()[0])

})
</script>
<template>
  <div class="min-h-[400px] flex flex-col items-center justify-center text-xl text-center">
    <img :src="logo" class="p-3"/>
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
  </div>
</template>
