<script setup lang="ts">
import type { CreditVideo } from '~/utils/creditsLoader'

const props = defineProps<{
  video: CreditVideo
}>()

const thumbnail = computed(() => resolveImage(props.video.thumbnail))
</script>

<template>
  <a
    :href="videoUrl(video)"
    target="_blank"
    rel="noopener noreferrer"
    class="group block rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:ring-2 hover:ring-primary transition"
    :aria-label="`Voir « ${video.title} » sur ${videoProviderLabel(video)}`"
  >
    <div
      class="relative w-full flex items-center justify-center"
      :class="video.kind === 'youtube' ? 'aspect-video' : 'aspect-[9/16]'"
    >
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :alt="video.title"
        class="absolute inset-0 w-full h-full object-cover"
      >
      <div
        v-else
        class="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40"
      />
    </div>
    <div class="flex items-center gap-2 p-2">
      <span class="flex-1 text-sm font-medium text-center line-clamp-2">
        {{ video.title }}
      </span>
      <UIcon name="i-lucide-external-link" class="text-neutral shrink-0 opacity-0 group-hover:opacity-100 transition" />
    </div>
  </a>
</template>
