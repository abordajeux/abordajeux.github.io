<script setup lang="ts">
import { discordIcon, faceBookIcon, InstagramIcon } from '@/components/layouts/layout_components/footer/brands_svg';

const socialButtons = [{
    "label":'Mail',
    "to": 'https://perdu.com',
    "icon": 'i-lucide-mail'},
  {
    "label":'Instagram',
    "to": 'https://perdu.com',
    "icon": InstagramIcon},
  {
    "label":'Facebook',
    "to": 'https://perdu.com',
    "icon": faceBookIcon},
  {
    "label":'Discord',
    "to": 'https://perdu.com',
    "icon": discordIcon},]
  // currently no discord icons on lucide

</script>
<template>
  <UFooter >
    <template #right>
      <div>
        © 2026 À L'ABORDAJEUX
      </div>
</template>
          <template #default>
      <div class="md:flex items-center gap-2">
        <UButton
          v-for="button in socialButtons"
          :key="button.to"
          :to="button.to"
          :icon="button.icon"
          target="_blank"
          variant="ghost"
        >
          {{ button.label }}
        </UButton>
      </div>
    </template>


  </UFooter>

</template>
