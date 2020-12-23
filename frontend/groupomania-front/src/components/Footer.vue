<template>
    <div id="footer">
        <p>{{ copyright }} - By Adrien Lehugeur</p>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            companyName: 'Groupomania'
        }
    },
    computed: {
        copyright() {
               const currentYear = new Date().getFullYear()
                return `Copyright ${this.companyName} ${currentYear}`
        }
     
    }
}
</script>   

<style lang="scss">
       #footer {
            margin-top: 50px;
            width: 100%;
            color: gray;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: -10;
    }
</style>