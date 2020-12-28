<template>
  <b-container>
    <HomeSignupHeader v-bind:titre="titre" />
    <HomeLogin />
    <HomeSignup />

  </b-container>
</template>

<script>
import HomeSignupHeader from "../components/HomeSignupHeader";
import HomeLogin from "../components/HomeLogin";
import HomeSignup from "../components/HomeSignup";



export default {
  name: "Home",

  data() {
    return {
      titre: "Bienvenue sur notre réseau social !",
    }
  },

  components: {
    HomeSignupHeader,
    HomeLogin,
    HomeSignup,
    }

};
</script>

<style>

</style>
