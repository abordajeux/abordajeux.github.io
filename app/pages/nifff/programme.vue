<script lang="ts" setup>
import type { datedEvent } from '~/types/navigation'
import EventSlideOver from '~/components/layouts/composables/eventSlideOver.vue'
import { parseDateKey } from '~/utils/eventsLoader'
import type { NifffEditionEvent } from '~/utils/nifffLoader'

interface NIFFFEvent extends datedEvent {
    cardDescription: string
}

const overlay = useOverlay()

const latestEvents = loadNifffLatest()

function toNIFFFEvent(event: NifffEditionEvent): NIFFFEvent {
    const { date: rawDate, ...rest } = event
    return {
        ...rest,
        date: rawDate ? parseDateKey(rawDate) : new Date(),
    }
}

const events: NIFFFEvent[] = latestEvents.map(toNIFFFEvent)
const everyDay = events.find(event => event.id === 'nifff-everyday')
const activities = events.filter(event => event.id !== 'nifff-everyday')

const slideover = overlay.create(EventSlideOver)

async function openPanel(activity: datedEvent) {
    const instance = slideover.open({
        activities: [activity],
    })

    await instance.result
}

onBeforeUnmount(() => {
    slideover?.close()
})
</script>

<template>
    <div class="min-h-[400px] flex flex-wrap justify-center items-start gap-6 p-3">
        <div v-if="events.length > 0" class="text-xl text-neutral p-3">
            <UPage>
                <UPageHeader headline="Activités à venir" />

                <UPageCard
                    v-if="everyDay"
                    :id="everyDay.id"
                    :title="everyDay.title"
                    @click="openPanel(everyDay)"
                >
                    <template #default>
                        <div class="flex gap-4">
                            <img
                                :src="resolveImage(everyDay.image_path)"
                                class="h-48 w-auto flex-shrink-0 rounded"
                            >
                            <div class="flex flex-col flex-1">
                                <p class="mt-2 text-sm">
                                    {{ everyDay.cardDescription }}
                                </p>
                                <div v-if="everyDay.organizer" class="mt-4 text-xs">
                                    <UIcon name="i-lucide-contact" class="text-xl" />
                                    {{ everyDay.organizer }}
                                </div>
                                <div v-if="everyDay.hours.length === 2" class="text-xs">
                                    <UIcon name="i-lucide-clock" class="text-xl" />
                                    Tous les jours, de {{ everyDay.hours[0] }} à {{ everyDay.hours[1] }}
                                </div>
                            </div>
                        </div>
                    </template>
                </UPageCard>

                <UPageCard
                    v-for="activity in activities"
                    :id="activity.id"
                    :key="activity.id"
                    :title="activity.title"
                    :description="activity.cardDescription"
                    @click="openPanel(activity)"
                >
                    <template #default>
                        <div class="flex gap-4">
                            <img
                                :src="resolveImage(activity.image_path)"
                                class="h-48 w-auto flex-shrink-0 rounded"
                            >
                            <div class="flex flex-col flex-1">
                                <p class="mt-2 text-sm">
                                    {{ activity.cardDescription }}
                                </p>
                                <div v-if="activity.organizer" class="mt-4 text-xs">
                                    <UIcon name="i-lucide-contact" class="text-xl" />
                                    {{ activity.organizer }}
                                </div>
                                <div v-if="activity.hours.length === 2" class="text-xs">
                                    <UIcon name="i-lucide-clock" class="text-xl" />
                                    Le {{ activity.date.toLocaleDateString('fr-FR') }}, de {{ activity.hours[0] }} à {{ activity.hours[1] }}
                                </div>
                                <div v-if="activity.image_copyright" class="text-xs">
                                    <UIcon name="i-lucide-brush" class="text-xl" />
                                    {{ activity.image_copyright[0] }}
                                </div>
                            </div>
                        </div>
                    </template>
                </UPageCard>
            </UPage>
        </div>

        <div v-else class="text-xl text-neutral text-center p-6 flex flex-col items-center gap-4">
            <p>Pas de programme à venir pour le moment.</p>
            <UButton to="/nifff/galerie" icon="i-lucide-images" size="lg">
                Voir les éditions passées
            </UButton>
        </div>
    </div>
</template>
