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
  background: linear-gradient(#1B4F72 10%, #F9EBEA 80%, #ffffff 90%);
  background-attachment: fixed;
  position: absolute;
  margin: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
</style>
