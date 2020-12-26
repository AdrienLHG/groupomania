<template>


    <!-- Accès à la création d'un compte -->
    <b-row align-h="center" class="mt-4">
      <b-col md="6" class="text-center">
        <h2 class="my-3 pt-3">Pas encore inscrit ?</h2>
        <b-button
          variant="dark"
          size="lg"
          @click.prevent="$router.push('signup')"
        >
          Créez votre compte 
        </b-button>
      </b-col>
    </b-row>
</template>

<script>
export default {
  name: "HomeSignup",

};
</script>

<style>

</style>