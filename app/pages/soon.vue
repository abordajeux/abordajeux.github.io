<script setup lang="ts">
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center text-center p-3 max-w-3xl mx-auto">

    <h1 class="text-4xl font-bold text-primary p-3">
      Quelque chose se prépare...
    </h1>

    <p class="text-xl text-neutral p-3">
      L'équipage mijote un plan qui aboutira en Novembre... Mais on vous en reparlera avant. Si si, promis, un jour vous en saurez plus.
    </p>

    <img :src="resolveImage('soon.png')" alt="" class="max-h-100 w-auto rounded my-6 opacity-80">

    <div class="flex flex-col items-center gap-2 text-neutral">
      <UIcon name="i-lucide-hourglass" class="text-4xl text-primary" />
      <p class="text-lg">
        Coin 14 coin 15 Coin 2026, co-coin coin coin coin coin coin coin coin coin 24 coin coin coin.
        </p>      <p class="text-lg">

        Coin coin coin coin coin, coin coin coin coin coin, coin.
      </p>
    </div>
  </div>
</template>
