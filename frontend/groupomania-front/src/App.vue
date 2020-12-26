<template>
  <body>
    <b-container id="app">
      <router-view />
    </b-container>
  </body>
</template>

<script>
export default {};
</script>

<style>
body {
  background: linear-gradient(160deg, #ffffff 35%, #bebebe 80%, #091f43 97%);
  background-attachment: fixed;
  position: absolute;
  margin: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
</style>
