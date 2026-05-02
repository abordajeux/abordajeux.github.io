<script setup lang="ts">

import  {buildInitialCalendarIndex} from '~/components/layouts/composables/EventsHandler.composable'
    import beerImage from '@/assets/images/beeroclock.png'

const selectedDate = ref(null)
const mapShown = ref(false)
const getEventsForDate = (date: Date) => {
  const isoDate = date.toISOString().split('T')[0]
  const weekday = date.getDay()
}

const events = buildInitialCalendarIndex(new Date('2026-01-01'), new Date('2026-12-31'))
console.error(event)

const tempEvent = events['mercredi-soir'][0]
console.error(tempEvent)

function toggleMap() {
  mapShown.value = !mapShown.value
}

</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-1">
    <h1 class="text-4xl font-bold text-primary p-3">
      Calendrier des événements
    </h1>

<USlideover :title="tempEvent?.title" :description="tempEvent?.date.toLocaleDateString('fr-FR')" :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }">
  <UCalendar :year-controls="false"/>

  <template #body>
    <div class="justify-center items-centers text-center font-display">
       <UIcon name="i-lucide-alarm-clock" size="xl"/>  {{ `De ${tempEvent?.hours[0]} à ${tempEvent?.hours[1]}` }}

       <div v-for=" desc in tempEvent?.pre_img_description" class="mt-2">
          {{ desc }}
        </div>

        <img :src="beerImage"/>
        <div v-for=" desc in tempEvent?.post_img_description" class="mt-2">
          {{ desc }}
        </div>
        <div v-if="Object.keys(tempEvent!.prices).length > 0" class="mt-4">
            Vous voulez participer ?
        </div>
        <div v-for="value in Object.entries(tempEvent!.prices)">
          {{ `${value[0]} : ${value[1] === 0 ? 'gratuit' : value[1] +  ' CHF'}` }}
        </div>
        <UButton
        v-if="tempEvent?.external_link"
        :icon="tempEvent.external_link[2]"
        :to="tempEvent.external_link[0]"
        :target="tempEvent.external_link[3]"> {{  tempEvent.external_link[1] }}
      </UButton>
        <div v-if="tempEvent?.location">
          <div>
            <UButton icon="i-lucide-map-pin-house" @click="toggleMap" color="secondary"  class="mt-2 mb-2">{{tempEvent.location}}</UButton>
          </div>
          <div v-if="mapShown && tempEvent?.coordinates">
            {{ tempEvent?.coordinates }}
          </div>

        </div>
      </div>
    </template>
</USlideover>
<div v-if="selectedDate">
  <div
    v-for="event in getEventsForDate(selectedDate)"
    :key="event._path"
    class="mt-4 p-4 border rounded"
  >
    <h2 class="text-xl font-bold">{{ event.title }}</h2>
    <p>{{ event.start }} - {{ event.end }}</p>
    <p>{{ event.location }}</p>
  </div>
</div>
  </div>
</template>
