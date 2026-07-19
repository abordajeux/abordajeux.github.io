<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import EventSlideOver from '~/components/layouts/composables/eventSlideOver.vue'
import { getEventsByDate, loadEvents, rollingWindow, topCategory } from '~/utils/eventsLoader'
import type { CalendarEvent as AppCalendarEvent, EventCategory } from '~/utils/eventsLoader'

const overlay = useOverlay()
const slideOver = overlay.create(EventSlideOver)

const [windowStart, windowEnd] = rollingWindow()
const events = loadEvents(windowStart, windowEnd)

const minValue = new CalendarDate(windowStart.getFullYear(), windowStart.getMonth() + 1, windowStart.getDate())
const maxValue = new CalendarDate(windowEnd.getFullYear(), windowEnd.getMonth() + 1, windowEnd.getDate())

type CalendarChipColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'

const CATEGORY_COLOR: Record<EventCategory, CalendarChipColor> = {
  'local-open': 'success',
  'local-closed': 'warning',
  'external-open': 'info',
  'external-closed': 'secondary',
  'cancelled': 'error',
  'reservation': 'neutral',
}

const LEGEND_ENTRIES: { label: string, category: EventCategory }[] = [
  { label: 'Événement ayant lieu dans notre local, ouvert à tous', category: 'local-open' },
  { label: 'Événement ayant lieu dans notre local, ouvert aux membres', category: 'local-closed' },
  { label: 'Événement externe au local, ouvert à tous', category: 'external-open' },
  { label: 'Événement externe au local, ouvert aux membres', category: 'external-closed' },
  { label: 'Événement annulé', category: 'cancelled' },
]

type CalendarDay = { year: number, month: number, day: number }

function dayToKey(day: CalendarDay): string {
  return `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`
}

function categoryForDay(day: CalendarDay): EventCategory | undefined {
  return topCategory(getEventsByDate(events, dayToKey(day)))
}

function showSlide(day: CalendarDay) {
  const dayEvents = getEventsByDate(events, dayToKey(day))
  if (dayEvents.length > 0) {
    openEvent(dayEvents[0]!)
  }
}

async function openEvent(activity: AppCalendarEvent) {
  const instance = slideOver.open({ activity })
  await instance.result
}

onUnmounted(() => {
  slideOver?.close()
})
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center p-3">
    <img :src="resolveImage('img_calendar.png')">

    <h1 class="text-4xl font-bold text-primary p-3">
      Calendrier des événements
    </h1>

    <UCalendar
      :min-value="minValue"
      :max-value="maxValue"
      :year-controls="false"
      :ui="{
        root: 'text-lg p-4',
        header: 'text-xl',
        cell: 'h-12 w-12 text-base',
      }"
      locale="fr-FR"
    >
      <template #day="{ day }">
        <div @click="showSlide(day)">
          <UChip
            :show="!!categoryForDay(day)"
            :color="CATEGORY_COLOR[categoryForDay(day) ?? 'reservation']"
            size="2xs"
          >
            <span :class="{ 'line-through': categoryForDay(day) === 'cancelled' }">
              {{ day.day }}
            </span>
          </UChip>
        </div>
      </template>
    </UCalendar>

    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 justify-center p-4 text-sm text-neutral">
      <div v-for="entry in LEGEND_ENTRIES" :key="entry.category" class="flex items-center gap-2">
        <span
          class="inline-block size-3 rounded-full"
          :style="{ backgroundColor: `var(--ui-${CATEGORY_COLOR[entry.category]})` }"
        />
        <span>{{ entry.label }}</span>
      </div>
    </div>
  </div>
</template>
