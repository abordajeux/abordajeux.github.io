<script setup lang="ts">
    import clickMe from '@/assets/images/clickme_small.png'
    import logo from '@/assets/images/abordajeux_ship_small.png'

    import { usePirateStore} from '@/stores/appStore';

const pirateStore = usePirateStore()
const isOpen = ref(false)

  const isMobile = computed(() => pirateStore.isMobile)
  const headerButtons = computed(() => pirateStore.navigationButtons)
  onMounted(() => {
    console.error(window.location.pathname.split('/').toReversed()[0])
    pirateStore.changeProject(window.location.pathname.split('/').toReversed()[0])
  })
</script>

<template>
  <UHeader :ui="{
    center: 'flex items-center justify-center'
  }">
 <!-- Left logo -->
    <template #left>
    <img :src="logo"/>
    </template>

      <!-- Desktop navigation -->
    <template #default>
      <div class="md:flex items-center gap-2">
        <UButton
        v-if="!isMobile"
          v-for="button in headerButtons"
          :key="button.to"
          :to="button.to"
          :icon="button.icon"
          variant="ghost"
        >
          {{ button.label }}
        </UButton>
        <UButton
        v-if="isMobile"
        @click="isOpen = !isOpen"
        icon="i-lucide-menu"
        variant="ghost"
      ></UButton>
      </div>
    </template>

      <!-- Mobile button -->


 <template #right>
  <a href="/info#JOIN"> <img :src="clickMe"/></a>


    </template>

  </UHeader>
</template>
