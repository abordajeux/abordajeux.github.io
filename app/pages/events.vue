<script setup lang="ts">

const selectedDate = ref(null)
const events: unknown[] = []

const getEventsForDate = (date: Date) => {
  const isoDate = date.toISOString().split('T')[0]
  const weekday = date.getDay()
}

/**
 * WHAT TO DO HERE :
 *
 *  1. take recurring events
 *  2. make an event list and transform fields as necessary
 *  3. take all single events
 *  4. transform / upgrade / replace
 *  5. apply events to dates for calendar
 *
 *  events : apply from -2 to + 2 in months
 */

</script>
<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-1">
    <h1 class="text-4xl font-bold text-primary p-3">
      Calendrier des événements
    </h1>
<UCalendar :year-controls="false"/>

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
