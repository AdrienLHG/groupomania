<template>
    <nav class="navbar fixed-top">
	<router-link to="/" class="nav-link"> 
	</router-link>	
	<div>
	<ul class="nav mr-auto">
	<li v-if="!currentUser"  class="nav-item"> 
	<router-link to="/" class="nav-link"> Connexion</router-link>
	</li>
	<li v-if="!currentUser"  class="nav-item">
	<router-link to="/signup" class="nav-link"> créer un compte</router-link>
	</li>
	</ul>
	</div>		
    </nav>
</template>
<script>
export default {
    name: "Nav",

    methods: {

    },
};
</script>
<style lang="scss" scoped>
.navbar {
    background-color: #122442;
    height: 120px;
}

a {
    font-weight: bold;
    color: #ffff;
}

@media screen and (max-width: 1000px) {
    #navbar {
        display: flex;

        background-color: #122442;
        height: 190px;
    }
}
</style>