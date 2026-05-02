<script setup lang="ts">
import type { datedEvent } from '~/types/navigation';

const { activity } = defineProps<{
    activity: datedEvent,
}>()

function toggleMap() {
  mapShown.value = !mapShown.value
}
const mapShown = ref(false)
</script>

<template>
  <USlideover :title="activity.title" :description="activity.date.toLocaleDateString('fr-FR')" :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
      }">
      <template #body>
    <div class="justify-center items-centers text-center font-display">
       <UIcon name="i-lucide-alarm-clock" size="xl"/>  {{ `De ${activity.hours[0]} à ${activity.hours[1]}` }}

       <div v-for=" desc in activity.pre_img_description" class="mt-2">
          {{ desc }}
        </div>

        <img :src="resolveImage(activity.image_path)"/>
        <div v-for=" desc in activity.post_img_description" class="mt-2">
          {{ desc }}
        </div>
        <div v-if="Object.keys(activity!.prices).length > 0" class="mt-4">
            Vous voulez participer ?
        </div>
        <div v-for="value in Object.entries(activity!.prices)">
          {{ `${value[0]} : ${value[1] === 0 ? 'gratuit' : value[1] +  ' CHF'}` }}
        </div>
        <UButton
        v-if="activity.external_link"
        :icon="activity.external_link[2]"
        :to="activity.external_link[0]"
        :target="activity.external_link[3]"
        > {{  activity.external_link[1] }}
      </UButton>
        <div v-if="activity.location">
          <div>
            <UButton icon="i-lucide-map-pin-house" @click="toggleMap" color="secondary"  class="mt-2 mb-2">{{activity.location}}</UButton>
          </div>
          <div v-if="mapShown && activity.coordinates">
            <iframe :src="`https://map.geo.admin.ch/#/embed?lang=en&center=${activity.coordinates}&z=10&topic=ech&layers=&bgLayer=ch.swisstopo.pixelkarte-grau&hideEmbedUI&crosshair=cross`" style="border: 0;width: 250px;height: 300px;max-width: 100%;max-height: 100%;" allow="geolocation"></iframe>
          </div>

        </div>
      </div>
    </template>
    </USlideover>
</template>
