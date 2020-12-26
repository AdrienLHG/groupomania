<template>
  <b-container>
    <HomeSignupHeader v-bind:titre="titre" />
    <SignupForm />
  </b-container>
</template>

<script>
import HomeSignupHeader from "../components/HomeSignupHeader";
import SignupForm from "../components/SignupForm";


export default {
  name: "Signup",

  data() {
    return {
      titre: "Créez votre compte !",
    }
  },

  components: {
    HomeSignupHeader,
    SignupForm,
    }
}
</script>

<style>

</style>
