<script lang="ts" setup>
import { usePirateStore } from '@/stores/appStore';

const pirateStore = usePirateStore()
onBeforeMount(() => {
        pirateStore.changeProject(window.location.pathname.split('/').toReversed()[Number(!!window.location.pathname.endsWith('/'))])

})
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-1">
    <h1 class="text-4xl font-bold text-primary p-3">
      Cette page fut en cours de Construction
    </h1>
    <div class="text-xl text-neutral p-3">
        Personne  de  tous  genres,  soyez  les  bienvenu·es  dans  notre  petite  animation  en  marge  du  NIFFF.
        Si  vous  ne  connaissez  pas  le  NIFFF,  le  mieux  est  encore  de  vous  rendre  sur  <a href="https://nifff.ch" class="text-primary">leur site internet.</a>
    </div>
    <div class="text-xl text-neutral p-3">
        Durant cette semaine dédiée au cinéma, diverses thématiques forment autant de fils rouges autour de la sélection de films et l'abordajeux s'invite afin de proposer
        quelques parties de jeux de rôles, ainsi que des jeux de sociétés, issus des mêmes thématiques.
    </div>
    <div class="text-xl text-neutral p-3">
        Ma responsable de communication ayant menacé de me virer si mon introduction ne faisait pas cliquer les gens sur le programme. Alors même si on a aucun moyen de vérifier qui clique dessus, si vous pouviez le faire, ce serait chouette.
    </div>
    <div class="text-xl text-neutral p-3">
        En vous souhaitant évidemment de passer un agréable moment en notre compagnie.
    </div>


  </div>
</template>
