<script setup lang="ts">
import type { CalendarEvent } from '~/utils/eventsLoader'

// TODO : rework external_link quickly to have an object structure rather than an array

const { activities } = defineProps<{
  activities: CalendarEvent[],
}>()

const currentIndex = ref(0)
const mapShown = ref(false)

const current = computed(() => activities[currentIndex.value]!)

watch(() => activities, () => {
  currentIndex.value = 0
  mapShown.value = false
})

function goToPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    mapShown.value = false
  }
}

function goToNext() {
  if (currentIndex.value < activities.length - 1) {
    currentIndex.value += 1
    mapShown.value = false
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', dateStyle: 'long' }).format(date)
}

function toggleMap() {
  mapShown.value = !mapShown.value
}
</script>

<template>
  <USlideover
    :title="current.title"
    :description="formatDate(current.date)"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <template #body>
      <div class="justify-center items-centers text-center font-display">
        <div v-if="activities.length > 1" class="flex justify-between items-center mb-3">
          <UButton
            icon="i-lucide-chevron-left"
            variant="ghost"
            :disabled="currentIndex === 0"
            @click="goToPrevious"
          />
          <span class="text-sm text-neutral">{{ currentIndex + 1 }} / {{ activities.length }}</span>
          <UButton
            icon="i-lucide-chevron-right"
            variant="ghost"
            :disabled="currentIndex === activities.length - 1"
            @click="goToNext"
          />
        </div>

        <UIcon name="i-lucide-alarm-clock" size="xl" /> {{ `De ${current.hours[0]} à ${current.hours[1]}` }}

        <div v-if="current.cancelled" class="mt-3 p-3 rounded border border-error text-error">
          <UIcon name="i-lucide-circle-x" /> Événement annulé
          <div v-if="current.cancelReason" class="text-sm mt-1">{{ current.cancelReason }}</div>
        </div>

        <div v-for="desc in current.pre_img_description" :key="desc" class="mt-2">
          {{ desc }}
        </div>

        <img :src="resolveImage(current.image_path)">

        <div v-if="current.image_copyright" class="mt-2">
          <UButton
            icon="i-lucide-brush"
            :to="current.image_copyright[1]"
            target="_blank"
          >{{ current.image_copyright[0] }}</UButton>
        </div>

        <div v-for="desc in current.post_img_description" :key="desc" class="mt-2">
          {{ desc }}
        </div>

        <div v-if="!current.cancelled && Object.keys(current.prices).length > 0" class="mt-4">
          <div>Vous voulez participer ?</div>
          <div v-for="value in Object.entries(current.prices)" :key="value[0]">
            {{ `${value[0]} : ${value[1] === 0 ? 'gratuit' : value[1] + ' CHF'}` }}
          </div>
        </div>

        <UButton
          v-if="!current.cancelled && current.external_link"
          class="mt-2"
          :icon="current.external_link[2]"
          :to="current.external_link[0]"
          :target="current.external_link[3]"
        >{{ current.external_link[1] }}</UButton>

        <div v-if="current.location">
          <div>
            <UButton icon="i-lucide-map-pin-house" color="secondary" class="mt-2 mb-2" @click="toggleMap">{{ mapShown ? "Masquer la carte" : current.location }}</UButton>
          </div>
          <div v-if="mapShown && current.coordinates">
            <iframe :src="`https://map.geo.admin.ch/#/embed?lang=en&center=${current.coordinates}&z=10&topic=ech&layers=&bgLayer=ch.swisstopo.pixelkarte-grau&hideEmbedUI&crosshair=cross`" style="border: 0;width: 100%;height: 300px;max-width: 100%;max-height: 100%;" allow="geolocation" />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
