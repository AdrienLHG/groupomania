<template>
  <b-container>

    <HeaderMessage v-if="user.id !== null" v-bind:username="user.username" />

    <AddPublication v-if="user.id !== null" />

    <b-row align-h="center">
      <b-col sm="8" v-for="publication in publications" :key="publication.id" class="my-3">
        <!-- Carte de publication -->
        <b-card header-tag="header" footer-tag="footer" class="content" tag="article">
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
              <b-img v-if="publication.attachment !== null" :src="publication.attachment" fluid alt=""></b-img>
            </b-col>
          </b-row>

          <!-- Bouton supprimer -->
          <b-row>
            <b-col class="text-right" v-if="user.isAdmin === true || user.id == publication.userId" >
              <b-button class="mt-3" variant="danger" size="sm" v-b-tooltip.hover title="Supprimer"
                @click="Destroy(publication)">
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
import AddPublication from "../components/AddPublication";
import axios from "axios";
import { mapState } from "vuex";


export default {
  name: "Wall",

  components: {
    HeaderMessage,
    AddPublication,
  },

  data() {
    return {
      publications: [],
      destroyPublication: "",
      userId: localStorage.getItem("UserId"),
      admin: localStorage.getItem("admin"),

    };
  },

  computed: {
    ...mapState(["user"]),
  },

  mounted() {
    this.getPublications();
  },

  methods: {

    getPublications() {
      let authorization = localStorage.getItem("token")
      axios.get("http://localhost:3000/api/messages", {
          headers: {
            Authorization: "Bearer " + authorization,
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

    Destroy(publication) {
      let authorization = localStorage.getItem("token")
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
            axios.delete("http://localhost:3000/api/messages/" + publication.id, {
                headers: {
                  Authorization: "Bearer " + authorization,
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
  color: black;
  padding-left: 0.7em;
}
.br {
  white-space: pre-wrap;
}
</style>