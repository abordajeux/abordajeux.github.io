<script setup lang="ts">

import AppHeader from '@/components/layouts/layout_components/AppHeader.vue'
import AppFooter from '@/components/layouts/layout_components/AppFooter.vue'

// TODO : on page change, focus on  the page and scroll up
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader
    />

    <main class="flex-1">
      <div class="max-w-3xl mx-auto px-4 flex flex-col h-full max-h-[80vh] overflow-scroll">
        <slot/>

        <img :src="resolveImage('banner_abordajeux.png')" class="opacity-25 bottom-10 w-full max-w-3xl sticky -z-40"/>

      </div>

    </main>

    <AppFooter class="sticky bottom-0"/>
  </div>
</template>

<style>
</style>
