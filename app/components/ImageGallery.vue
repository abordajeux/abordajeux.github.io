<script setup lang="ts">
const props = defineProps<{
  items: { image: string, copyright?: [string, string] }[]
  columns?: number
}>()

const selectedIndex = ref<number | null>(null)
const isOpen = computed({
  get: () => selectedIndex.value !== null,
  set: (open: boolean) => {
    if (!open) {
      selectedIndex.value = null
    }
  },
})

const selectedItem = computed(() =>
  selectedIndex.value !== null ? props.items[selectedIndex.value] ?? null : null,
)

const canGoPrev = computed(() => (selectedIndex.value ?? 1) > 0)
const canGoNext = computed(() =>
  selectedIndex.value !== null && selectedIndex.value < props.items.length - 1,
)

function openAt(index: number) {
  selectedIndex.value = index
}

function goPrev() {
  if (selectedIndex.value !== null && selectedIndex.value > 0) {
    selectedIndex.value -= 1
  }
}

function goNext() {
  if (selectedIndex.value !== null && selectedIndex.value < props.items.length - 1) {
    selectedIndex.value += 1
  }
}

function onKeydown(event: KeyboardEvent) {
  if (selectedIndex.value === null) {
    return
  }
  if (event.key === 'ArrowLeft') {
    goPrev()
  }
  if (event.key === 'ArrowRight') {
    goNext()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 gap-4"
    :style="columns ? `grid-template-columns: repeat(${columns}, minmax(0, 1fr))` : undefined"
  >
    <div v-for="(item, index) in items" :key="index" class="flex flex-col">
      <button
        type="button"
        class="block w-full bg-transparent border-0 p-0 cursor-zoom-in"
        aria-label="Agrandir l'image"
        @click="openAt(index)"
      >
        <img :src="resolveImage(item.image)" alt="" class="w-full rounded">
      </button>
      <div v-if="item.copyright" class="mt-2">
        <UButton
          icon="i-lucide-brush"
          :to="item.copyright[1]"
          target="_blank"
        >{{ item.copyright[0] }}</UButton>
      </div>
    </div>
  </div>

  <UModal v-model:open="isOpen" :ui="{ content: 'max-w-[90vw] max-h-[90vh]' }">
    <template #body>
      <div v-if="selectedItem" class="flex flex-col items-center">
        <div class="relative flex items-center justify-center">
          <img
            :src="resolveImage(selectedItem.image)"
            alt=""
            class="max-w-[90vw] max-h-[80vh] w-auto h-auto rounded"
          >
          <UButton
            v-if="canGoPrev"
            icon="i-lucide-chevron-left"
            color="neutral"
            variant="solid"
            class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
            aria-label="Image précédente"
            @click="goPrev"
          />
          <UButton
            v-if="canGoNext"
            icon="i-lucide-chevron-right"
            color="neutral"
            variant="solid"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
            aria-label="Image suivante"
            @click="goNext"
          />
        </div>

        <div v-if="selectedItem.copyright" class="mt-4">
          <UButton
            icon="i-lucide-brush"
            :to="selectedItem.copyright[1]"
            target="_blank"
          >{{ selectedItem.copyright[0] }}</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
