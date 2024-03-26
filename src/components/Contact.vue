<script setup>
import ContactForm from "@/components/contact/ContactForm.vue";
let messageSentFlag = false;
/**
 * Further development
 *  add tool for contact
 *  css on contact form
 *  option : post to a google script which makes the necessary steps, then send message
 *  seems nices
 *  success
 */
</script>
<template>
  <div class="title">Engagez vous qu'ils disaient</div>

  <div class="content">
    L'équipage de l'abordajeux recrute, des plus jeunes (pas trop jeunes non
    plus) aux plus âgés, tous sont les bienvenus à bord. Évidemment, la
    traversée est payante, mais cela a pour but de financer nos frais réguliers,
    les achats nécessaires à l'organisation d'événements ainsi que nos projets
    plus ambitieux.
  </div>
  <div class="content">
    Conscients que tout le monde ne dispose pas des même moyens, nous vous
    offrons la possibilité de choisir vous même le palier qui correspond à la
    fois à vos moyens, et à votre volonté de soutenir l'équipage.
  </div>

  <div class="content">
    Devenir membre vous donne accès aux avantages suivants:

    <ul>
      <li>
        Accès aux soirées ludiques hebdomadaires (actuellement le mercredi)
        gratuitement
      </li>
      <li>
        Accès aux dimanche jeux mensuels, dont l'accès est rigoureusement
        interdits aux non-membres
      </li>
      <li>
        Le droit de décider du cap de l'association, en participant à ses
        assemblées générales
      </li>
      <li>
        Des tarifs réduits pour la plupart des événements publics organisés par
        l'association
      </li>
      <li>La reconnaissance annuelle du capitaine</li>
      <li>La reconnaissance éternelle du reste de l'équipage</li>
    </ul>
  </div>
  <div class="content">
    Pour nos aspirants qui sont étudiants, ou bénéficient d'une rente AI ou AVS,
    nous serons heureux de vous accueillir à bord pour moins de 9.- par mois
    (100.- par an) Tout autre aspirant peut, au choix, devenir membre dès 17.-
    par mois (200.- / an), avec la possibilité de contribuer d'avantage (300.-
    ou 400.-) si les projets de l'association vous tiennent particulièrement à
    coeur.
  </div>

  <div class="content">
    Si l'aventure de l'Abordajeux vous intéresse, il ne vous reste plus qu'à
    vous engager
  </div>

  <div class="title">Nous contacter</div>

  <div class="content">
    Vous souhaitez nous rejoindre, organiser un événement ludique avec notre
    soutien ou vous avez une question, n'hésitez pas à nous envoyer un message à
    travers l'un de nos réseaux sociaux ou par mail.
  </div>

  <div class="content" v-if="false">
    <ContactForm />
  </div>
  <div class="content" v-else></div>
</template>
<style scoped></style>
