<template>
    <!-- Formulaire de connexion -->
    <b-row align-h="center">
      <b-col md="6" class="text-center">
        <h2 class="my-3">Connectez-vous</h2>
        <b-form>

          <!-- Champ email -->
          <b-input-group class="mb-3">
            <b-input-group-prepend is-text>
              <b-icon icon="at" aria-label="Email"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              v-model="signin.email"
              type="email"
              required
              placeholder="Entrez votre email"
            ></b-form-input>
          </b-input-group>

          <!-- Champ mot de passe -->
          <b-input-group class="mb-3">
            <b-input-group-prepend is-text>
              <b-icon icon="key-fill" aria-label="Mot de passe"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              type="password"
              v-model="signin.password"
              required
              placeholder="Entrez votre mot de passe"
            ></b-form-input>
          </b-input-group>

          <!-- Alerte sur erreur de connexion -->
          <b-alert
            class="textcenter"
            v-model="signinError"
            variant="danger"
            dismissible
            fade
          >
            <p class="h4 mb-2">
              <b-icon icon="patch-exclamation-fill"></b-icon> Erreur
            </p>
            <p>{{ problem }}</p>
          </b-alert>

          <!-- Bouton "valider" -->
          <b-col class="text-center">
            <b-button
              v-if="signinError == false"
              type="submit"
              variant="success"
              size="lg"
              pill
              v-b-tooltip.hover
              title="Valider"
              @click.prevent="login"
            >
              <b-icon
                icon="power"
                font-scale="1.5"
                animation="fade"
                aria-label="Valider"
              ></b-icon>
            </b-button>
          </b-col>
        </b-form>
      </b-col>
    </b-row>
</template>

<script>

export default {
  name: "HomeLogin",

  data() {
    return {
      signin: {
        email: null,
        password: null,
      },
      signinError: false,
      problem: "L'email etou le mot de passe ne sont pas valides",
    }
  },

  methods: {
    login() {
      let userLogInfo = {}
      if (this.username == '') {
        userLogInfo = {
        email: this.email,
        password: this.password
        }
      } else {
        userLogInfo = {
        username: this.username,
        password: this.password
        }
      }
      this.$store.dispatch('userLogin', userLogInfo)
      .then((res) => {
        console.log(res)
        this.$bvToast.toast(`${this.username, this.email} logged in !`, {
          title: 'Success',
          variant: 'success',
          autoHideDelay: 5000 
          }
        )
       // setTimeout(function() { window.location.pathname = '/messages'; }, 6000)
      })
      .catch((error) => {
        console.log(error)
        console.log(error.response)
        let errorArray = error.response.data.errors
        
        if (!errorArray) {
          this.$bvToast.toast(`${error.response.data.error}`, {
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 5000 
          })
        } 
        else {
          this.$bvToast.toast(`Error at ${errorArray[0].param} field`, {
          title: errorArray[0].msg,
          variant: 'danger',
          autoHideDelay: 5000 
          })
        }
      })
    },
  }   
}
</script>

<style scoped>

.textleft {
  text-align: left;
}
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
@media screen and (max-width: 768px) {
  h1 {
    font-size: 1.6em;
  }
  h2 {
    font-size: 1.2em;
  }
  img {
    width: 100%;
  }
}

</style>