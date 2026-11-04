<script setup lang="ts">
import { formatMenuItemPrice } from '~/utils/presqueMenu'

const menu = loadPresqueMenu()
</script>

<template>
  <div class="min-h-[60vh] p-3 max-w-3xl mx-auto">
    <UPage>
      <UPageHeader
        headline="Les Presques 24h du Jeu — 14 et 15 novembre 2026"
        title="La Carte"
        description="Que peut-on manger et boire pendant l'événement ?"
      />

      <div v-if="menu.length === 0" class="flex flex-col items-center gap-3 p-6 text-neutral text-center">
        <UIcon name="i-lucide-utensils" class="text-4xl" />
        <p class="text-lg">La carte sera publiée prochainement.</p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 mt-6">
        <section
          v-for="section in menu"
          :key="section.title"
          class="p-5 rounded-lg border border-neutral-300 dark:border-neutral-700 flex flex-col gap-3"
        >
          <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
            <UIcon :name="section.icon ?? 'i-lucide-utensils'" />
            {{ section.title }}
          </h2>

          <ul class="flex flex-col gap-3">
            <li v-for="item in section.items" :key="item.name">
              <div class="flex items-baseline gap-2">
                <span class="font-medium">{{ item.name }}</span>
                <span class="flex-1 border-b border-dotted border-neutral-400 dark:border-neutral-600" />
                <span v-if="item.price != null" class="text-neutral whitespace-nowrap">{{ formatMenuItemPrice(item.price) }}</span>
              </div>
              <p v-if="item.description" class="text-sm text-neutral mt-1">
                {{ item.description }}
              </p>
            </li>
          </ul>
        </section>
      </div>

      <p class="text-sm text-neutral text-center mt-8">
        Dans la limite des stocks. Tous les plats sont préparés par nos bénévoles. Le menu est susceptible de changer avant l'événement.
      </p>
    </UPage>
  </div>
</template>
