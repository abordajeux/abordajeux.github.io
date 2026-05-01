<script>
import { tempFakeStore } from '~/stores/appStore';

const headerButtons = tempFakeStore.base
</script>
<template>
<div class="md:hidden border-t">

  <nav class="flex flex-col p-4 gap-4">

     <div class="md:flex items-center gap-2">
        <UButton
          v-for="button in headerButtons"
          :key="button.to"
          :to="button.to"
          :icon="button.icon"
          variant="ghost"
        >
          {{ button.label }}
        </UButton>
        </div>

  </nav>

</div>
</template>
