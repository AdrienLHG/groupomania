<template>
  <b-container>

    <!-- <HomeSignupHeader v-bind:titre="titre" /> -->

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
              <b-icon icon="key" aria-label="Mot de passe"></b-icon>
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
            class="textleft"
            v-model="signinError"
            variant="danger"
            dismissible
            fade
          >
            <p class="h4 mb-2">
              <b-icon icon="exclamation-circle"></b-icon> Erreur
            </p>
            <p>{{ problem }}</p>
          </b-alert>

          <!-- Alerte avec compte à rebours sur erreur 429 -->
          <b-alert
            :show="dismissCountDown"
            fade
            variant="danger"
            @dismiss-count-down="countDownChanged"
          >
            <p class="h5 mb-2">
              <b-icon icon="emoji-dizzy"></b-icon>
              Trop de requêtes !
            </p>
            <hr />
            <p>Réessayez dans {{ dismissCountDown }} secondes...</p>
          </b-alert>

          <!-- Bouton "valider" -->
          <b-col class="text-center">
            <b-button
              v-if="signinError == false && dismissCountDown == 0"
              type="submit"
              variant="success"
              size="lg"
              pill
              v-b-tooltip.hover
              title="Valider"
              @click.prevent="signIn"
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

    <!-- Accès à la création d'un compte -->
    <b-row align-h="center" class="mt-4">
      <b-col md="6" class="text-center">
        <h2 class="my-3 pt-3">Pas encore inscrit ?</h2>
        <b-button
          variant="dark"
          size="lg"
          @click.prevent="$router.push('signup')"
        >
          Je crée mon compte
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

</script>

<style>
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
