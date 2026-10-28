<script setup lang="ts">
import { activityTintClass, formatPresqueSchedule, type PresqueActivity } from '~/utils/presqueProgram'
import { getCapacityBadge, type ActivityCapacity } from '~/utils/subscriptionLogic'

const props = defineProps<{
  activity: PresqueActivity
  capacity?: ActivityCapacity
}>()

const emit = defineEmits<{
  select: [activity: PresqueActivity]
}>()

const badge = computed(() => getCapacityBadge(props.capacity))
const tintClass = computed(() => activityTintClass(props.activity))
</script>

<template>
  <UPageCard
    :description="props.activity.short_description"
    variant="subtle"
    :class="tintClass"
    @click="emit('select', props.activity)"
  >
    <template #title>
      <div class="flex flex-col">
        <span>{{ props.activity.title }}</span>
        <span
          v-if="props.activity.game"
          class="text-xs text-toned font-normal flex items-center gap-1"
        >
          <UIcon name="i-lucide-dices" />
          {{ props.activity.game }}
        </span>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col gap-2">
        <div class="text-sm text-toned flex items-center gap-1">
          <UIcon name="i-lucide-clock" />
          {{ formatPresqueSchedule(props.activity.start, props.activity.end) }}
        </div>
        <div class="flex items-center gap-2">
          <UBadge :color="badge.color" variant="solid">
            {{ badge.label }}
          </UBadge>
          <PrizePopover
            v-if="props.activity.prizes"
            :prizes="props.activity.prizes"
            :show-label="false"
          />
          <span v-if="props.activity.organizer" class="text-xs text-muted truncate">
            <UIcon name="i-lucide-contact" /> {{ props.activity.organizer[0] }}
          </span>
        </div>
      </div>
    </template>
  </UPageCard>
</template>
