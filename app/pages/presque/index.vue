<script lang="ts" setup>
import { usePirateStore } from '@/stores/appStore';

const pirateStore = usePirateStore()
onBeforeMount(() => {
        pirateStore.changeProject(window.location.pathname.split('/').toReversed()[0])

})
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-1">
    <h1 class="text-4xl font-bold text-primary p-3">
      Cette page est en cours de construction
    </h1>
    <div class="text-xl text-neutral p-3">
        On va reviendir. On vous donnera des infos

    </div>
  </div>
</template>
