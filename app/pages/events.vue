<script setup lang="ts">

import  {buildInitialCalendarIndex} from '~/components/layouts/composables/EventsHandler.composable'
    import beerImage from '@/assets/images/beeroclock.png'
import type { datedEvent } from '~/types/navigation'
import EventSlideOver from '~/components/layouts/composables/eventSlideOver.vue'

const overlay = useOverlay()
const slideover = overlay.create(EventSlideOver)

async function  open(activity: datedEvent) {
  const instance = slideover.open({
    activity
  })

  await instance.result

  return

}

const events: Record<string, datedEvent[]> = buildInitialCalendarIndex(new Date('2026-01-01'), new Date('2026-12-31'))



function getEventsByDate(date: Date, verbose: boolean = false): datedEvent[] {

  const event: datedEvent[] = []
    Object.values(events).forEach((all_events: datedEvent[]) =>{
        if(verbose) {
    console.error(all_events)
  }
      const activity = all_events.find((act) => act.date.getDate() === date.getDate() && act.date.getFullYear() === date.getFullYear() && act.date.getMonth() === date.getMonth())
      if(activity) {
        event.push(activity)
      }
    })

    return event
}
function getColorByDate(date: Date) {

  const eventsForDate = getEventsByDate(date)

  if (eventsForDate.length > 0) {
    return 'success'
  }

  return undefined
}

function showSlide(date) {
  if(date && date.year && date.month && date.day){
  const eventsForTheDay = getEventsByDate(new Date(date.year, date.month -1, date.day))
    // for now: we show only the first
  if (eventsForTheDay.length > 0) {
    open(eventsForTheDay[0]!)
  }
  else {
    console.error("THERE IS A PROBLEM")
  }
}

}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-1">
    <h1 class="text-4xl font-bold text-primary p-3">
      Calendrier des événements
    </h1>

  <UCalendar :year-controls="false" >
    <template #day="{ day }">
      <div id="bruh" @click="showSlide(day)">
      <UChip :show="!!getColorByDate(day.toDate('UTC'))" :color="getColorByDate(day.toDate('UTC'))" size="2xs">
        {{ day.day }}
      </UChip>
      </div>

    </template>

  </UCalendar>
  </div>
</template>
