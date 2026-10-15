<script setup lang="ts">
import { buildAvailabilityRows } from '~/utils/presqueAvailability'

const toast = useToast()

const { status: programmeStatus, activities, fromCache, load } = usePresqueProgramme({
  onWarning: message => toast.add({ title: 'Activité ignorée', description: message, color: 'warning' }),
})
const { status: capacityStatus, capacities, loadAll } = useActivityCapacity()

const POLL_INTERVAL_MS = 30_000
const now = ref(new Date())
const lastRefreshedAt = ref<Date | null>(null)
let timer: number | undefined

const rows = computed(() => buildAvailabilityRows(activities.value, capacities.value, now.value))

const lastRefreshLabel = computed(() => {
  if (!lastRefreshedAt.value) {
    return '—'
  }
  return new Intl.DateTimeFormat('fr-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .format(lastRefreshedAt.value)
})

async function tick() {
  if (document.hidden) {
    return
  }
  await loadAll()
  now.value = new Date()
  if (capacityStatus.value === 'ready') {
    lastRefreshedAt.value = now.value
  }
}

function onVisibilityChange() {
  if (document.hidden) {
    return
  }
  tick()
}

onMounted(() => {
  load()
  tick()
  timer = window.setInterval(tick, POLL_INTERVAL_MS)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (timer !== undefined) {
    window.clearInterval(timer)
  }
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div class="min-h-[60vh] p-3 max-w-5xl mx-auto">
    <UPage>
      <UPageHeader
        headline="Les Presques 24h du Jeu — 14 et 15 novembre 2026"
        title="Suivi des places"
        description="Places restantes en direct, actualisées toutes les 30 secondes. Cliquez sur une activité pour ouvrir son inscription."
      />

      <div v-if="programmeStatus === 'loading' || programmeStatus === 'idle'" class="flex flex-col items-center gap-3 p-6 text-neutral">
        <UIcon name="i-lucide-loader-circle" class="text-3xl animate-spin" />
        <p>Chargement du suivi…</p>
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

        <UAlert
          v-if="capacityStatus === 'error'"
          icon="i-lucide-cloud-off"
          color="warning"
          variant="subtle"
          title="Actualisation en échec"
          description="Les places n'ont pas pu être actualisées : les dernières valeurs connues sont affichées. Nouvelle tentative automatique dans 30 secondes."
        />

        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-muted flex items-center gap-1">
            <UIcon name="i-lucide-clock" />
            Mis à jour à {{ lastRefreshLabel }}
          </p>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted">{{ rows.length }} activité{{ rows.length > 1 ? 's' : '' }} à venir</span>
            <UButton
              icon="i-lucide-refresh-cw"
              variant="outline"
              size="sm"
              :loading="capacityStatus === 'loading'"
              @click="tick"
            >
              Actualiser
            </UButton>
          </div>
        </div>

        <div v-if="rows.length === 0" class="flex flex-col items-center gap-2 p-6 text-neutral text-center">
          <UIcon name="i-lucide-calendar-check" class="text-3xl" />
          <p>Aucune activité à venir pour le moment.</p>
        </div>

        <div v-else class="max-h-[70vh] overflow-auto rounded-lg border border-default">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-muted">
                <th class="sticky top-0 z-10 bg-elevated px-3 py-2 font-semibold whitespace-nowrap">Horaire</th>
                <th class="sticky top-0 z-10 bg-elevated px-3 py-2 font-semibold">Activité</th>
                <th class="sticky top-0 z-10 bg-elevated px-3 py-2 font-semibold whitespace-nowrap">Places</th>
                <th class="sticky top-0 z-10 bg-elevated px-3 py-2 font-semibold text-right whitespace-nowrap">Confirmés</th>
                <th class="sticky top-0 z-10 bg-elevated px-3 py-2 font-semibold text-right whitespace-nowrap">Non Confirmés</th>
                <th class="sticky top-0 z-10 bg-elevated px-3 py-2 font-semibold text-right whitespace-nowrap">Liste d'attente</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id" class="border-t border-default">
                <td class="px-3 py-2 whitespace-nowrap text-toned">{{ row.schedule }}</td>
                <td class="px-3 py-2">
                  <NuxtLink :to="row.link" class="font-medium text-primary hover:underline">
                    {{ row.title }}
                  </NuxtLink>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <UBadge :color="row.badge.color" variant="solid">
                    {{ row.badge.label }}
                  </UBadge>
                </td>
                <td class="px-3 py-2 text-right font-mono">{{ row.counters.confirmed }}</td>
                <td class="px-3 py-2 text-right font-mono">{{ row.counters.pending }}</td>
                <td class="px-3 py-2 text-right font-mono">{{ row.counters.waitlisted }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UPage>
  </div>
</template>
