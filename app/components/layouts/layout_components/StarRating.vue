<script setup lang="ts">
const model = defineModel<number>({ default: 0 })

const max = 5

function setRating(value: number) {
  model.value = value
}
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="star in max"
      :key="star"
      type="button"
      class="text-3xl transition-opacity"
      :class="star <= model ? 'opacity-100' : 'opacity-40'"
      @click="setRating(star)"
    >
      ★
    </button>
  </div>
</template>
