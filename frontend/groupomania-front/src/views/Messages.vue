<template>
  <b-container>

    <HomeSignupHeader v-bind:titre="titre" />


  </b-container>
</template>

<script>
import HomeSignupHeader from "../components/HomeSignupHeader";

export default {
  name: "Home",

  data() {
    return {
      titre: "Bienvenue sur notre les publications !",
    }
  },

  components: {
    HomeSignupHeader,
    }

};
</script>

<style>

</style>
