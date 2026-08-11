<script setup lang="ts">
const editions = loadNifffEditions()
const selectedYear = ref<number | undefined>(highestEditionYear())

function selectYear(year: number) {
  selectedYear.value = year
}

const selectedEdition = computed(() =>
  editions.find(edition => edition.year === selectedYear.value),
)

const galleryItems = computed(() =>
  selectedYear.value !== undefined ? buildYearGalleryItems(selectedYear.value) : [],
)
</script>

<template>
  <div class="min-h-[400px] p-3">
    <h1 class="text-3xl font-bold text-primary mb-6 text-center">
      Galerie des éditions passées
    </h1>

    <div v-if="editions.length === 0" class="text-xl text-neutral text-center p-6">
      Aucune édition passée à afficher pour le moment.
    </div>

    <div v-else>
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <UButton
          v-for="edition in editions"
          :key="edition.year"
          :label="String(edition.year)"
          :color="edition.year === selectedYear ? 'primary' : 'neutral'"
          :variant="edition.year === selectedYear ? 'solid' : 'outline'"
          @click="selectYear(edition.year)"
        />
      </div>

      <div v-if="selectedEdition?.year_copyright" class="text-xs text-neutral mb-4 italic text-center">
        {{ selectedEdition.year_copyright }}
      </div>

      <ImageGallery :items="galleryItems" />
    </div>
  </div>
</template>
