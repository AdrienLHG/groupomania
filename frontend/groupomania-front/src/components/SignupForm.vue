<template>
<!-- Formulaire d'inscription -->
    <b-row align-h="center">
      <b-col md="6">
        <h2 class="my-3">Complétez le formulaire ci-dessous</h2>
        <b-card>
          <b-form>

            <!-- Champ nom d'utilisateur -->
            <b-form-group
              label="Entrez un nom d'utilisateur :"
              label-for="input-username"
              :invalid-feedback="invalidUsernameFeedback"
              :valid-feedback="validUsernameFeedback"
              :state="stateUsername"
            >
              <b-form-input
                id="input-username"
                v-model="signup.username"
                required
                aria-describedby="username-help-block"
                trim
              ></b-form-input>
              <b-form-text id="username-help-block">
                Votre nom d'utilisateur doit être composé de 3 à 50 caractères.
              </b-form-text>
            </b-form-group>

            <!-- Champ email -->
            <b-form-group
              label="Entrez un email :"
              label-for="input-email"
              v-bind:invalid-feedback="invalidEmailFeedback"
              v-bind:valid-feedback="validEmailFeedback"
              v-bind:state="stateEmail"
            >
              <b-form-input
                id="input-email"
                v-model="signup.email"
                type="email"
                required
                trim
              ></b-form-input>
            </b-form-group>

            <!-- Champ mot de passe -->
            <b-form-group
              label="Entrez un mot de passe :"
              label-for="input-password"
              v-bind:invalid-feedback="invalidPasswordFeedback"
              v-bind:valid-feedback="validPasswordFeedback"
              :state="statePassword"
            >
              <b-form-input
                id="input-password"
                v-model="signup.password"
                type="password"
                required
                aria-describedby="password-help-block"
                trim
              ></b-form-input>
              <b-form-text id="password-help-block">
                Votre mot de passe doit être composé de 8 à 12 caratère.<br />
                Il doit comporter au moins une lettre et un chiffre.
              </b-form-text>
            </b-form-group>

            <!-- Indication des erreurs -->
            <b-alert
              class="textleft"
              v-model="signupError"
              variant="info"
              dismissible
              fade
            >
              <b-icon icon="info-circle"></b-icon> {{ problem }}
            </b-alert>

            <!-- Bouton de validation -->
            <b-col class="text-center">
              <b-button
                v-if="signupError == false"
                class="my-3"
                type="submit"
                variant="success"
                @click="signUp"
              >
                Envoyer
              </b-button>
            </b-col>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
</template>

<script>
export default {
  name: "SignupForm",

data() {
    return {
      signup: {
        username: "",
        email: "",
        password: "",
      },
      signupOk: "",
      signupError: false,
      problem: "",
      titre: "Inscription",
      emailRegEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      passwordRegEx: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/,
    };
  },

  computed: {
    /*
    Feedback de saisie du nom d'utilisateur
    */
    stateUsername() {
      return this.signup.username.length >= 3 &&
        this.signup.username.length <= 50
        ? true
        : false;
    },
    invalidUsernameFeedback() {
      if (
        this.signup.username.length >= 3 &&
        this.signup.username.length <= 50
      ) {
        return "";
      } else if (
        this.signup.username.length > 0 &&
        this.signup.username.length <= 50
      ) {
        return "Au moins 3 caractères";
      } else if (this.signup.username.length >= 51) {
        return "50 caractères maximum";
      } else {
        return "";
      }
    },
    validUsernameFeedback() {
      return this.stateUsername === true ? "Ok" : "";
    },

    /*
    Feedback de saisie de l'email
    */
    stateEmail() {
      return this.emailRegEx.test(this.signup.email) ? true : false;
    },
    invalidEmailFeedback() {
      if (this.signup.email == "") {
        return "";
      } else if (this.emailRegEx.test(this.signup.email) == false) {
        return "Format incorrect";
      } else {
        return "";
      }
    },
    validEmailFeedback() {
      return this.stateEmail === true ? "Ok" : "";
    },

    /*
    Feedback de saisie du mot de passe
    */
    statePassword() {
      return this.passwordRegEx.test(this.signup.password) ? true : false;
    },
    invalidPasswordFeedback() {
      if (this.signup.password == "") {
        return "";
      } else if (this.passwordRegEx.test(this.signup.password) == false) {
        return "Mot de passe invalide...";
      } else {
        return "";
      }
    },
    validPasswordFeedback() {
      return this.statePassword === true ? "Ok" : "";
    },
  },

  methods: {
    /*
    Création d'un compte utilisateur :
      - envoie la requête si les champs comportent une donnée,
      - redirige vers la page de connexion,
      - informe si le nom d'utilisateur ou l'email sont déjà utilisés.
    */
    signUp() {
    },
  },
}

</script>

<style>
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
  text-align: center;
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