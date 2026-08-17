<script setup lang="ts">
const artists = loadArtists()
const videos = loadVideos()

const featuredVideo = videos.find(video => video.featured) ?? null
const otherVideos = videos.filter(video => video !== featuredVideo)

function artistImage(image: string | undefined) {
  return resolveImage(image)
}
</script>

<template>
  <div class="min-h-[80vh] max-w-4xl mx-auto flex flex-col items-center text-center p-3">
    <h1 class="text-4xl font-bold text-primary p-3">
      Un coin avec un peu d'art.
    </h1>
    <p class="text-xl text-neutral p-3">
      Ici, vous pourrez voir qui sont les artistes que l'on a convaincu de travailler pour nous, et les vidéos produites par notre fantastique équipe de communication, sur laquelle je n'ai évidemment rien à redire, je vous jure, je vais très bien, pas besoin d'appeler la police.
    </p>

    <section v-if="artists.length > 0" class="w-full p-3">
      <h2 class="text-2xl font-bold text-primary mb-4">
        Les artistes qui nous ont fourni de belles illustrations
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="artist in artists"
          :key="artist.name"
          class="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-300 dark:border-neutral-700"
        >
          <img
            v-if="artistImage(artist.image)"
            :src="artistImage(artist.image)"
            :alt="artist.name"
            class="w-20 h-20 rounded-full object-cover"
          >
          <span
            v-else
            class="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10"
          >
            <UIcon name="i-lucide-brush" class="text-3xl text-primary" />
          </span>
          <div class="text-lg font-semibold">
            {{ artist.name }}
          </div>
          <div class="text-neutral">
            {{ artist.contribution }}
          </div>
          <UButton
            v-if="artist.link"
            icon="i-lucide-brush"
            :to="artist.link"
            target="_blank"
            size="sm"
            variant="outline"
          >
            Voir son travail
          </UButton>
        </div>
      </div>
    </section>

    <section v-if="videos.length > 0" class="w-full p-3">
      <h2 class="text-2xl font-bold text-primary mb-4">
        Les trésors d'un pirate
      </h2>
      <div>
        Régulièrement, des membres d'équipage vous présentent un des trésors qu'ils ont découvert au fil des années.
      </div>
      <div class="text-xs mb-1">Cliquer sur une vidéo ouvrira un nouvel onglet avec la vidéo.</div>
      <div v-if="featuredVideo" id="featured" class="max-w-2xl w-full mx-auto mb-4" >
        <VideoLinkCard :video="featuredVideo" />
      </div>
      <div
        v-if="otherVideos.length > 0"
        class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
      >
        <VideoLinkCard
          v-for="video in otherVideos"
          :key="`${video.kind}-${video.id}`"
          :video="video"
        />
      </div>
    </section>
  </div>
</template>
