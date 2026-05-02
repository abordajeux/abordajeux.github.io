<script setup lang="ts">

</script>
<template>
  <UFooter >
    <template #right>
      <div>
        © 2026 À L'ABORDAJEUX
      </div>
</template>
          <template #default>
            <div class="w-48">
<UMarquee pause-on-hover  :overlay="false">
          <UButton
            key="discord"
            to="https://discord.gg/4ZchWcxJek"
            icon="i-simple-icons-discord"
            target="_blank"
            variant="ghost"
          >
            Discord
          </UButton>
          <UButton
          key="Instagram"
          to="https://www.instagram.com/alabordajeux?igsh=MWlxZWp5ZjBwd2ZoNg=="
          icon="i-simple-icons-instagram"
            target="_blank"
          variant="ghost"
          >
          Instagram
        </UButton>
                  <UButton
          key="Whatsapp"
          to="https://chat.whatsapp.com/LxTac3q6Z7b2YIysWuZ2jL"
          icon="i-simple-icons-whatsapp"
            target="_blank"
          variant="ghost"
          >
          Whatsapp
        </UButton>
                  <UButton
          key="facebook"
          to="https://www.facebook.com/share/18cotPgLuL/"
          icon="i-simple-icons-facebook"
            target="_blank"
          variant="ghost"
          >
          Facebook
        </UButton>
                  <UButton
          key="mail"
          to="mailto:association.alabordajeux@gmail.com"
          icon="i-lucide-mail"
            target="_blank"
          variant="ghost"
          >
          Mail
        </UButton>

        </UMarquee>
            </div>


    </template>


  </UFooter>

</template>
