<template>
  <b-container>

    <Header v-if="user.id !== null" v-bind:username="user.username" />

    <AddPublication v-if="user.id !== null" />

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
import Header from "../components/Header";
import AddPublication from "../components/AddPublication";
import axios from "axios";
import { mapState } from "vuex";
import Vue from 'vue';


export default {
  name: "Wall",

  components: {
    Header,
    AddPublication,
  },

  data() {
    return {
      publications: [],
      destroyPublication: "",
    };
  },

  computed: {
    ...mapState(["user"]),
  },

  mounted() {
    this.getPublications();
  },

  methods: {
    /*
    Récupération de toutes les publications :
      - requête l'API,
      - récupère les données Publications / User,
      - si token absent ou invalide -> modal d'avertissement puis retour page de connexion
    */
    getPublications() {
      let authorization = Vue.$cookies.get('user_session')
      axios.get("messages", {
          headers: {
            Authorization: "Bearer " + authorization.token,
          },
        })
        .then((response) => {
          this.publications = response.data;
          this.$store.dispatch("getUserData");
        })
        .catch((error) => {
          this.$bvModal
            .msgBoxOk(error.response.data.message, {
              title: "Accès non autorisé !",
              okVariant: "info",
              centered: true,
            })
            .then(() => {
              this.$router.push({ path: "/" });
            });
        });
    },

    /*
    Suppression d'une publication :
      - Modal demandant confirmation,
      - envoie la requête si OUI puis rafraîchit la liste.
    */
    alertDestroy(publication) {
      this.destroyPublication = "";
      this.$bvModal
        .msgBoxConfirm("Voulez-vous vraiment supprimer cette publication ?", {
          title: "Attention",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "OUI",
          cancelTitle: "NON",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          this.destroyPublication = value;
          if (this.destroyPublication == true) {
            this.$http
              .delete("publications/" + publication.id, {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              })
              .then(() => {
                this.getPublications();
              })
              .catch((error) => {
                console.log(error.message);
              });
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
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