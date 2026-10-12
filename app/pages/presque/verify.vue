<script setup lang="ts">
const route = useRoute()

const token = computed(() => {
  const value = route.query.token
  return typeof value === 'string' ? value : ''
})

const { status, confirm } = useVerifyToken(() => token.value)
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center p-3 max-w-xl mx-auto text-center">
    <h1 class="text-3xl font-bold text-primary p-3">
      Confirmation d'inscription
    </h1>

    <div v-if="status === 'confirmed'" class="flex flex-col items-center gap-3">
      <UIcon name="i-lucide-party-popper" class="text-5xl text-primary" />
      <p class="text-lg">
        Votre inscription est confirmée. Au plaisir de vous accueillir lors des Presques 24h du Jeu !
      </p>
      <UButton to="/presque/programme" icon="i-lucide-calendar-check-2" variant="outline">
        Voir le programme
      </UButton>
    </div>

    <div v-else-if="status === 'waitlisted'" class="flex flex-col items-center gap-3">
      <UIcon name="i-lucide-hourglass" class="text-5xl text-primary" />
      <p class="text-lg">
        Votre intérêt est confirmé : vous êtes sur la liste d'attente de cette activité.
        Si une place se libère, nous vous enverrons un email.
      </p>
      <UButton to="/presque/programme" icon="i-lucide-calendar-check-2" variant="outline">
        Voir le programme
      </UButton>
    </div>

    <div v-else-if="status === 'invalid' || status === 'expired'" class="flex flex-col items-center gap-3">
      <UIcon name="i-lucide-circle-x" class="text-5xl text-error" />
      <p class="text-lg">
        Ce lien de confirmation est invalide ou a expiré.
      </p>
      <UButton to="/presque/programme" icon="i-lucide-calendar-check-2" variant="outline">
        Voir le programme
      </UButton>
    </div>

    <div v-else class="flex flex-col items-center gap-4">
      <p class="text-lg">
        Cliquez sur le bouton ci-dessous pour confirmer votre inscription aux Presques 24h du Jeu.
      </p>
      <UButton size="xl" icon="i-lucide-check-check" :loading="status === 'loading'" @click="confirm">
        Confirmer mon inscription
      </UButton>
      <p v-if="status === 'error'" class="text-error text-sm">
        Service momentanément indisponible. Réessayez dans un instant.
      </p>
    </div>
  </div>
</template>
