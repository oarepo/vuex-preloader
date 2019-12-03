<template>
<div class="home">
    <h2>Comments</h2>
    Received store {{ storeModule }}. <br>
    Stores that were known during the component lifecycle (if it works, should contain just one value comments_xxxx
    where xxxx changes each time the page is visited): {{stores}}
    <br>
    The data in the vuex comments module are reloaded every second and have been reloaded {{loadedCount}} time(s) (after
    leaving this page and returning here,
    the count should go back to 1 as the isolated store is destroyed and a new one is created)
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'home',
    components: {},
    computed: {
        loadedCount () {
            return this.$store.state[this.storeModule].loadedCount
        }
    },
    data: () => ({
        stores: []
    }),
    props: {
        storeModule: String
    },
    watch: {
        storeModule (to, from) {
            this.stores.push(this.storeModule)
        }
    },
    mounted () {
        this.stores.push(this.storeModule)
    }
}
</script>
