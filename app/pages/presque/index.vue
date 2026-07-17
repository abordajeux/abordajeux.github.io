<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
    <h1 class="text-4xl font-bold text-primary p-3">
      Les Presques 24h du Jeu
    </h1>

    <div class="text-xl text-neutral p-3 max-w-prose">
      Bon, un jour on vous en dira plus sur cet événement, et ce jour arrive bientôt.
    </div>

    <div class="text-xl text-neutral p-3 max-w-prose">
      Vous pouvez déjà réserver votre week end du 14-15 novembre 2026, de 10h du matin le samedi à 18h (du soir) le dimanche.

    </div>

    <div class="text-xl text-neutral p-3 max-w-prose">
      Si je dis pas de bêtises, ce sera à la cité universitaire, mais je viendrai avec des vraies informations un de ces jours :)
    </div>

    <div class="p-4">
      <UButton
        color="primary"
        variant="outline"
        size="xl"
        icon="i-lucide-calendar-days"
        to="/info#JOIN"
      >
        Contactez nous pour en savoir plus ou devenir bénévoles
      </UButton>
    </div>
  </div>
</template>
