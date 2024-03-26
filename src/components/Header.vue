<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const hideStatuts = ref(window.innerHeight > window.innerWidth);

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
function resizeHandler() {
  console.log("HENLO");
  console.log(window.innerHeight);
  console.log(window.innerWidth);
  hideStatuts.value = window.innerHeight > window.innerWidth;
}
</script>
<template>
  <div id="header">
    <div class="logo-and-links">
      <div class="logo"><img src="../assets/abordajeux_300.jpg" /></div>
      <div class="links">
        <div><router-link to="/">Bienvenue</router-link></div>
        <div><router-link to="/projects">Projets</router-link></div>
        <div><router-link to="/events">Événements</router-link></div>
        <div><router-link to="/contact">Rejoindre l'équipage</router-link></div>
        <div v-if="!hideStatuts">
          <router-link to="/statuts">Statuts</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#header {
  position: sticky;
  top: 0px;
  height: 20vh;
  background-color: #010124; /* Example background color */
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 20px;
  display: grid;
  grid-row-start: 1;
  grid-row-end: 5;
  font-size: large;
}
a {
  text-decoration: none;
  color: rgb(2, 140, 158);
  transition: 0.4s;
  padding: 3px;
}
.logo {
  height: 20vh;
  width: auto;
}
img {
  height: 20vh;
  width: auto;
}
.logo-and-links {
  left: 0;
  right: 25%;
  display: flex;
}
.links {
  float: left;
  right: 0;
}
.nav {
  justify-content: space-around; /* Horizontally align links */
  align-items: center;
  height: 100%;
}

.nav-list {
  display: grid;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-right: 10px; /* Adjust spacing between links */
}

.nav-list li:last-child {
  margin-right: 0; /* Remove margin from last link */
}

.nav-list li a {
  color: #fff; /* Example text color */
  text-decoration: none;
}
</style>
