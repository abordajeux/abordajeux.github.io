<script setup lang="ts">
const items = ["https://www.myludo.fr/img/jeux/1757080426/300/cp/67722.png", "https://www.myludo.fr/img/jeux/1772974595/300/cv/73844.png", "https://www.myludo.fr/img/jeux/1622472867/300/ac/2004.png"]

</script>

<template>
  <div class="min-h-[80vh] items-center justify-center flex flex-col">
    <h1 class="text-4xl font-bold text-primary">
      Nos Jeux
    </h1>
    <div class="justify-center p-3">
      L'association est encore jeune et ne dispose pas d'une collection très étoffée. Cette dernière croît cependant régulièrement, et nos membres nous suggèrent régulièrement des nouveautés, ou des classiques, que nous devrions, à leur avis, posséder.
    </div>
    <div class="justify-center p-3">
      Nous avons également quelques passionnés de jeux de rôles qui proposent régulièrement des campagnes ou des one-shots. Si vous souhaitez être mis au courant du début d'une campagne ou de l'organisation d'un one shot, n'hésitez pas à nous contacter.
    </div>
    <div id="LAST_AQUISITIONS" class="p-3 text-3xl font-bold text-primary ">
      Nos Dernières Acquisitions
    </div>
    <div class="p-3">
     <UCarousel v-slot="{ item }" :items="items" class="w-full max-w-xs mx-auto" loop :autoplay="{ delay: 2000 }">
    <img :src="item" width="320" height="320" class="rounded-lg" loading="lazy">
  </UCarousel>
      <div class="text-xs">
      source des photos: MyLudo (et par conséquent, très certainement, les sites des éditeurs)
    </div>
    <div>

    </div>
  </div>


   <UButton
    to="https://www.myludo.fr/#!/profil/a-l-abordajeux-95567"
    target="_blank"
    icon="i-lucide-dices"
    trailing-icon="i-lucide-dices"
    variant="ghost"
    color="neutral"
    >Allez voir notre collection complète sur MyLudo</UButton>
    </div>
</template>
