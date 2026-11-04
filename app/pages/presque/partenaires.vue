<script setup lang="ts">
import type { PresquePartner, PresqueSponsor } from '~/utils/presquePartners'

const { sponsors, partners } = loadPresquePartners()

function sponsorLogo(sponsor: PresqueSponsor) {
  return resolveImage(sponsor.logo)
}

function partnerLogo(partner: PresquePartner) {
  return resolveImage(partner.logo)
}
</script>

<template>
  <div class="min-h-[60vh] p-3 max-w-3xl mx-auto">
    <UPage>
      <UPageHeader
        headline="Les Presques 24h du Jeu — 14 et 15 novembre 2026"
        title="Sponsors et Partenaires"
        description="Un grand merci à celles et ceux qui soutiennent l'événement."
      />

      <div v-if="sponsors.length === 0 && partners.length === 0" class="flex flex-col items-center gap-3 p-6 text-neutral text-center">
        <UIcon name="i-lucide-heart-handshake" class="text-4xl" />
        <p class="text-lg">Cette page sera publiée prochainement.</p>
      </div>

      <div v-else class="flex flex-col gap-10 mt-6">

        <section v-if="partners.length > 0">
          <h2 class="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-heart-handshake" />
            Nos partenaires
          </h2>
          <div class="grid gap-6 sm:grid-cols-2">
            <div
              v-for="partner in partners"
              :key="partner.name"
              class="flex flex-col items-center text-center gap-2 p-4 rounded-lg border border-neutral-300 dark:border-neutral-700"
            >
              <a
                :href="partner.website"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center h-25 w-25 rounded transition hover:ring-2 hover:ring-primary"
                :aria-label="`Visiter le site de ${partner.name}`"
              >
                <img
                  v-if="partnerLogo(partner)"
                  :src="partnerLogo(partner)"
                  :alt="partner.name"
                  class="max-w-25 max-h-25 w-auto h-auto object-contain"
                >
                <span v-else class="text-sm text-neutral">{{ partner.name }}</span>
              </a>
              <div class="text-lg font-semibold">{{ partner.name }}</div>
              <p class="text-sm text-neutral">{{ partner.description }}</p>
            </div>
          </div>
        </section>
        <section v-if="sponsors.length > 0">
          <h2 class="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-badge-dollar-sign" />
            Nos sponsors
          </h2>
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="sponsor in sponsors" :key="sponsor.name" class="flex items-center justify-center h-50 w-50">
              <img
                v-if="sponsorLogo(sponsor)"
                :src="sponsorLogo(sponsor)"
                :alt="sponsor.name"
                class="max-w-50 max-h-50 w-auto h-auto object-contain"
              >
              <span v-else class="text-sm text-neutral text-center">{{ sponsor.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </UPage>
  </div>
</template>
