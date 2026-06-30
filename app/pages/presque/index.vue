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
      Cette page était en cours, et l'est toujours
    </h1>
    <div class="text-xl text-neutral p-3">
        On va reviendir. On vous donnera des infos

    </div>
  </div>
</template>
