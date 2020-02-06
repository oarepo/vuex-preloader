<template>
<div class="home">
    <h1><a href="https://github.com/oarepo/vue-query-synchronizer">vue-query-synchronizer</a> demo</h1>
    <div>
        <button @click="setFilter(1)" :disabled="query.filter==='1'">filter='1'</button>
        <button @click="setFilter(2)" :disabled="query.filter==='2'">filter='2'</button>
        <button @click="setFilter(3)" :disabled="query.filter==='3'">filter='3'</button>
        <button @click="reload()">Reload to see the value loaded from local storage</button>
    </div>
    <div>Query: {{ query }}, store query: {{ storeQuery }}</div>
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'vueqs',
    props: {
        query: Object
    },
    components: {},
    computed: {
        ...mapState('qs', {
            storeQuery: state => state.query
        })
    },
    methods: {
        setFilter (x) {
            this.query.filter = x.toString()
        },
        reload () {
            this.$router.push({query: {}})
        }
    }
}
</script>
