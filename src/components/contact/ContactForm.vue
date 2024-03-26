<script setup>
import { ref } from "vue";

const messageSent = ref(false);
const selected = ref("Je souhaite rejoindre votre association");
const message = ref(null);
const name = ref(null);
const email = ref(null);

const options = ref([
  {
    text: "Je souhaite rejoindre votre association",
    value: "Je souhaite rejoindre votre association",
  },
  {
    text: "Je souhaite organiser un événement avec votre association",
    value: "Je souhaite organiser un événement avec votre association",
  },
  {
    text: "Je souhaite contacter votre association pour une autre raison",
    value: "Je souhaite contacter votre association pour une autre raison",
  },
]);
function sendMail() {
  if (!messageSent.value && message.value && name.value && email.value) {
    const itemToSend = sanitizeInput();
    console.log(itemToSend);
    messageSent.value = true;
  }
}

function sanitizeInput() {
  // TO DO : ensure there is nothing special in the form. Seems to work
  return {
    message: message.value,
    name: name.value,
    email: email.value,
    subject: selected.value,
  };
}
</script>
<template>
  <form id="contact-form" v-if="!messageSent">
    <div class="top">
      <label>Votre Nom</label>
      <input v-model="name" placeholder="Votre Nom" />
      <label>Votre E-mail</label>
      <input v-model="email" placeholder="Votre E Mail" />
    </div>
    <div class="middle">
      <label>Pour quelle raison souhaitez vous nous contacter ?</label>
      <select v-model="selected">
        <option v-for="option in options" :value="option.text">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div class="bottom">
      <textarea v-model="message" placeholder="Votre message ici"></textarea>
      <button @click="sendMail">Envoyer votre Message</button>
    </div>
  </form>
  <div v-if="messageSent">{{ selected }}, {{ message }}</div>
</template>
<style lang="scss" scoped></style>
