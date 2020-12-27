<template>
  <b-container>

    <HeaderMessage />

    <PosterMessage />

    <b-row align-h="center">
      <b-col
        sm="8"
        v-for="publication in publications"
        :key="publication.id"
        class="my-3"
      >
        <!-- Carte de publication -->
        <b-card
          header-tag="header"
          footer-tag="footer"
          class="content"
          tag="article"
        >
          <!-- Entête carte -->
          <template v-slot:header>
            <p class="mb-0">
              <strong>{{ publication.User.username }}</strong>
            </p>
          </template>

          <!-- Texte -->
          <b-card-text class="br">{{ publication.content }}</b-card-text>

          <!-- Image (facultative) -->
          <b-row>
            <b-col class="text-center">
              <b-img
                v-if="publication.imageUrl !== null"
                :src="publication.imageUrl"
                fluid
                alt=""
              ></b-img>
            </b-col>
          </b-row>

          <!-- Bouton supprimer -->
          <b-row>
            <b-col
              class="text-right"
              v-if="user.moderator == 1 || user.id == publication.UserId"
            >
              <b-button
                class="mt-3"
                variant="danger"
                size="sm"
                v-b-tooltip.hover
                title="Supprimer"
                @click="alertDestroy(publication)"
              >
                <b-icon icon="trash"></b-icon>
              </b-button>
            </b-col>
          </b-row>

          <!-- Pied carte -->
          <template v-slot:footer>
            <b-icon icon="calendar2-check"></b-icon>
            <span class="datetime">{{
              publication.createdAt | formatDate
            }}</span>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import HeaderMessage from "../components/HeaderMessage";
import PosterMessage from "../components/PosterMessage";

export default {
  name: "Messages",

  components: {
    HeaderMessage,
    PosterMessage,
  },

  data() {
    return {
  }
},
 methods: {
    
  }
}
</script>

<style>
.content {
  box-shadow: 0px 0px 10px 4px grey;
}
.datetime {
  font-size: 0.85em;
  color: slategrey;
  padding-left: 0.7em;
}
.br {
  white-space: pre-wrap;
}
</style>