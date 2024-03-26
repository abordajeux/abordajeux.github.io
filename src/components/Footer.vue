<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const onPhone = ref(window.innerHeight > window.innerWidth);

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
function resizeHandler() {
  onPhone.value = window.innerHeight > window.innerWidth;
}
</script>
<template>
  <div id="footer">
    <div id="social-network">
      <a href="https://www.instagram.com/alabordajeux/" target="_blank"
        ><img src="../assets/Instagram_logo.png" class="social-network"
      /></a>

      <a
        href="https://www.facebook.com/people/A-LABORDAJEUX/61553334539310/"
        target="_blank"
        ><img src="../assets/Facebook_logo.png" class="social-network"
      /></a>
      <a href="mailto:association.alabordajeux@gmail.com" target="_blank"
        ><img src="../assets/Mail_logo.png" class="social-network"
      /></a>
      <a href="discord" target="_blank"
        ><img src="../assets/Discord_logo.png" class="social-network"
      /></a>
    </div>
  </div>
</template>

<style scoped>
#footer {
  margin-top: auto;
  position: sticky;
  width: 100%;
  display: flex;
  grid-row-start: 1;
  grid-row-end: 4;
  height: 20vh;
  background-color: #010124; /* Example background color */
  bottom: 0;
}
#social-network {
  margin: 1rem auto 2rem;
}
</style>
