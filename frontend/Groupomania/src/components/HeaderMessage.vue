<template>
  <!-- Header profile -->
  <b-container class="my-4">
    <b-row align-h="center">

      <!-- logo -->
      <b-col sm="8" class="text-center">
        <img class="px-3 imgsize" alt="Groupomania-logo" src="../assets/icon-left-font-monochrome-white.png"  />
        <h1 class="my-3">Réseau social interne</h1>
      </b-col>

      <!-- Partie utilisateur -->
      <b-col>
        <div class="user-box">
          <p id="welcome" class="m-3 profile">
            <b-icon icon="person-circle"></b-icon> {{ Bienvenue }}
          </p>
          <div class="m-3">
            <b-button type="button" size="sm" variant="warning" @click="disconnect">
              <b-icon icon="door-open" aria-hidden="true"></b-icon>
              Déconnexion
            </b-button>
          </div>
          <div class="m-3">
            <b-button type="button" size="sm" variant="danger" @click="desinscription">
              <b-icon icon="exclamation-circle" aria-hidden="true"></b-icon>
              Désinscription
            </b-button>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {

  name: "HeaderMessage",

  data() {
    return {
      unsubscribeUser: "",
      Bienvenue: 'Bienvenue'
    };
  },

    computed: {
    ...mapState(["user"]),
  },

  methods: {

    disconnect() {
      localStorage.clear();
      this.$store.replaceState({
        user: {
          id: null,
          username: "",
          email: "",
          isAdmin: "",
        },
      });
      setTimeout(function() { window.location.pathname = '/'; }, 500)
    },

    desinscription() {
      let authorization = localStorage.getItem("token")
      this.unsubscribeUser = "";
      this.$bvModal
        .msgBoxConfirm(
          "Voulez-vous vraiment supprimer votre compte ? Cette opération supprimera également toutes vos publications.",
          {
            title: "Attention",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "OUI",
            cancelTitle: "NON",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          this.unsubscribeUser = value;
          if (this.unsubscribeUser == true) {
            axios.delete("http://localhost:3000/api/users/profile/" + localStorage.getItem("UserId"), {
                headers: {
                  Authorization: "Bearer " + authorization,
                },
              })
              .then(() => {
                this.disconnect();
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
#welcome {
  font-size: 1.2em;
}
.imgsize {
  width: 60%;
}
h1 {
  font-size: 1.6em;
}

.profile {
  color: white;
}
.user-box {
  border-left: 1px solid gray;
}

@media screen and (max-width: 768px) {
  .user-box {
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    border-left: none;
  }
  h1 {
    font-size: 1.4em;
  }
  .imgsize {
    width: 100%;
  }
}
</style>