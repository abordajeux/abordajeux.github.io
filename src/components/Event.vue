<script setup>
import useStore from "vuex";
const store = useStore();
const events = computed(() => {
  store.state.general.events;
});
</script>

<template>
  <div class="event" v-for="(eventName, event) in events">
    <div class="title">
      {{ eventName }}
    </div>
    <div class="content">
      <div class="description">{{ event.description }}</div>
      <div class="schedule"></div>
      <div class="prices"></div>
      <div class="location"></div>
      <ul class="games" v-for="(gameName, game) in events.games">
        <li>"{{ gameName }} :"</li>
      </ul>
    </div>
  </div>
</template>
