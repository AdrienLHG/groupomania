<template>
  <!-- Entête pages de connexion et d'inscription -->
  <b-row align-h="center">
    <b-col md="8" class="text-center">
      <img class="mt-3" src="../assets/logo.png" alt="Groupomania logo" />
      <h1>{{ titre }}</h1>
      <hr />
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "HomeSignupHeader",

  props: {
    titre: {
      type: String,
    },
  },
};
</script>