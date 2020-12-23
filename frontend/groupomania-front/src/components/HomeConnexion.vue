<template>

<home>
<router-link to="/" class="nav-link"> 
<img class="logo" width="500px" height="500px" alt="groupomania logo" src="@/assets/icon-above-font.png">
</router-link>	
</home>
</template>

<script>
export default {
    name: "HomeConnexion",

    methods: {
       
    },
};
</script>

<style lang="scss" scoped>

home {
    display: flex;
}

img {
    margin-left: auto;
    margin-right: auto;

}
</style>