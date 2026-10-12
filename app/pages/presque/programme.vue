<script setup lang="ts">
import { getDeepLinkId, groupByDay, type PresqueActivity } from '~/utils/presqueProgram'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { status: programmeStatus, activities, tabs, fromCache, load } = usePresqueProgramme({
  onWarning: message => toast.add({ title: 'Activité ignorée', description: message, color: 'warning' }),
})
const { capacities, loadAll, refresh } = useActivityCapacity()

const selected = ref<PresqueActivity | null>(null)
const modalOpen = ref(false)
const activeCategory = ref('jds')
const deepLinkId = ref(getDeepLinkId(route.query.id))

const tabItems = [
    { label: 'Jeux de société', value: 'jds', icon: 'i-lucide-dice-5' },

  { label: 'Jeux de rôle', value: 'jdr', icon: 'i-simple-icons-redragon' },
]

const displayedDays = computed(() =>
  groupByDay(activeCategory.value === 'jdr' ? tabs.value.jdr : tabs.value.jds))

onMounted(() => {
  load()
  loadAll()
})

function openActivity(activity: PresqueActivity) {
  selected.value = activity
  modalOpen.value = true
  refresh(activity.id)
}

watch(programmeStatus, (status) => {
  if (status !== 'ready' || deepLinkId.value === '') {
    return
  }
  const target = activities.value.find(activity => activity.id === deepLinkId.value)
  deepLinkId.value = ''
  router.replace({ query: { ...route.query, id: undefined } })
  if (target) {
    openActivity(target)
  }
}, { immediate: true })

async function refreshSelected() {
  if (selected.value) {
    await refresh(selected.value.id)
  }
}

const selectedCapacity = computed(() => {
  if (!selected.value) {
    return undefined
  }
  return capacities.value[selected.value.id]
})
</script>

<template>
  <div class="min-h-[60vh] p-3 max-w-5xl mx-auto">
    <UPage>
      <UPageHeader
        headline="Les Presques 24h du Jeu — 14 et 15 novembre 2026"
        title="Le Programme"
        description="Cliquez sur une activité pour voir les détails et vous inscrire."
      />

      <div v-if="programmeStatus === 'loading' || programmeStatus === 'idle'" class="flex flex-col items-center gap-3 p-6 text-neutral">
        <UIcon name="i-lucide-loader-circle" class="text-3xl animate-spin" />
        <p>Chargement du programme…</p>
      </div>

      <div v-else-if="programmeStatus === 'missing'" class="flex flex-col items-center gap-3 p-6 text-neutral text-center">
        <UIcon name="i-lucide-calendar-off" class="text-4xl" />
        <p class="text-lg">Le programme n'est pas encore publié. Revenez bientôt !</p>
        <UButton to="/presque" icon="i-lucide-presentation" variant="outline">
          L'Événement en Bref
        </UButton>
      </div>

      <div v-else-if="programmeStatus === 'error'" class="flex flex-col items-center gap-3 p-6 text-neutral text-center">
        <UIcon name="i-lucide-cloud-off" class="text-4xl" />
        <p class="text-lg">Service momentanément indisponible. Réessayez dans un instant.</p>
        <UButton icon="i-lucide-refresh-cw" variant="outline" @click="load">
          Réessayer
        </UButton>
      </div>

      <div v-else class="flex flex-col gap-4">
        <UAlert
          v-if="fromCache"
          icon="i-lucide-database-backup"
          color="warning"
          variant="subtle"
          title="Version en cache"
          description="Le programme n'a pas pu être rechargé : la dernière version connue est affichée, elle date peut-être."
        />

        <UTabs v-model="activeCategory" :items="tabItems" :default-value="'jdr'">
          <template #content>
            <section v-for="day in displayedDays" :key="day.key" class="flex flex-col gap-3 mt-4">
              <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
                <UIcon name="i-lucide-calendar-days" />
                {{ day.label }}
              </h2>
              <div class="grid gap-4 md:grid-cols-2">
                <ActivityCard
                  v-for="item in day.activities"
                  :key="item.id"
                  :activity="item"
                  :capacity="capacities[item.id]"
                  @select="openActivity"
                />
              </div>
            </section>

            <div v-if="displayedDays.length === 0" class="flex flex-col items-center gap-2 p-6 text-neutral text-center">
              <UIcon name="i-lucide-cat" class="text-3xl" />
              <p>Aucune activité dans cette catégorie pour le moment.</p>
            </div>
          </template>
        </UTabs>
      </div>
    </UPage>

    <ActivitySignupModal
      v-model:open="modalOpen"
      :activity="selected"
      :capacity="selectedCapacity"
      @refresh="refreshSelected"
    />
  </div>
</template>
