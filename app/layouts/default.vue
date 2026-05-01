<script setup lang="ts">

import AppHeader from '@/components/layouts/layout_components/AppHeader.vue'
import AppFooter from '@/components/layouts/layout_components/AppFooter.vue'
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader
    />

    <main class="flex-1">
      <div class="max-w-3xl mx-auto px-4 flex flex-col">
        <slot />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
