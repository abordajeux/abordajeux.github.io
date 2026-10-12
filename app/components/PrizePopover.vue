<script setup lang="ts">
import type { PresquePrizes } from '~/utils/presqueProgram'

const props = withDefaults(defineProps<{
  prizes: PresquePrizes
  showLabel?: boolean
}>(), { showLabel: false })

const entries = computed(() => {
  if (typeof props.prizes === 'string') {
    return []
  }
  return Object.entries(props.prizes)
})
</script>

<template>
  <UPopover :ui="{ content: 'presque-prize-popover' }">
    <UButton
      icon="i-lucide-trophy"
      size="xs"
      color="secondary"
      variant="solid"
      aria-label="Voir les lots"
      :label="showLabel ? 'Voir les lots' : undefined"
      @click.stop
    />
    <template #content>
      <div tabindex="-1" class="p-3 max-w-xs max-h-[50vh] overflow-y-auto text-left focus:outline-none">
        <div class="flex items-center gap-1 font-semibold mb-2">
          <UIcon name="i-lucide-trophy" />
          Que peut on gagner ici
        </div>
        <p v-if="typeof prizes === 'string'">
          {{ prizes }}
        </p>
        <div v-else class="flex flex-col gap-1">
          <div v-for="[rank, prize] in entries" :key="rank">
            <span class="font-semibold">{{ rank }}</span> — {{ prize }}
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
