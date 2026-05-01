<script setup lang="ts">
    import clickMe from '@/assets/images/clickme_small.png'
    import logo from '@/assets/images/abordajeux_ship_small.png'

    import { usePirateStore} from '@/stores/appStore';

const pirateStore = usePirateStore()

  const isMobile = computed(() => pirateStore.isMobile)
  const headerButtons = computed(() => pirateStore.navigationButtons)

  onMounted(() => {
    pirateStore.changeProject(window.location.pathname.split('/').toReversed()[0])

      window.addEventListener('resize', onResize);
  })

  function onResize(){
    pirateStore.isMobile = innerWidth < 771 // at which size we start to think it might be good to restrict some elements
  }
</script>

<template>
  <UHeader :ui="{
    center: 'md:flex items-center justify-center',
    body:  'w-64 max-w-full',
  }">
 <!-- Left logo -->
    <template #left>
    <img :src="logo"/>
    </template>

      <!-- Desktop navigation -->
    <template #default>
      <div class="invisible md:visible items-center gap-2">
        <UNavigationMenu :items="headerButtons" color="neutral"/>
      </div>
    </template>

      <!-- Mobile button -->


 <template #right>
  <a href="/info#JOIN"> <img :src="clickMe"/></a>
</template>
      <template #body>
      <div class="p-4">
        <UNavigationMenu
          :items="headerButtons"
          orientation="vertical"
          :ui="{
      link: 'flex-col gap-1',
      linkLabel: 'block text-xl text-center ',
    }"
        />
        </div>

    </template>

  </UHeader>
</template>
