<template>
<div class="home">
    <h1><a href="https://github.com/oarepo/vue-query-synchronizer">vue-query-synchronizer</a> demo</h1>
    <div>
        <button @click="setFilter(1)" :disabled="query.filter==='1'">filter='1'</button>
        <button @click="setFilter(2)" :disabled="query.filter==='2'">filter='2'</button>
        <button @click="setFilter(3)" :disabled="query.filter==='3'">filter='3'</button>
        <button @click="reload()">Reload to see the value loaded from local storage</button>
    </div>
    <div>
        <button @click="setPage(1)" :disabled="query.page===1">page='1'</button>
        <button @click="setPage(2)" :disabled="query.page===2">page='2'</button>
        <button @click="setPage(3)" :disabled="query.page===3">page='3'</button>
        <button @click="reload()">Reload to see the value loaded from local storage</button>
    </div>
    <br>
    <filter-component :query="query"></filter-component>
    <br>
    <div>Query: {{ query }}, store state (should contain the same query): {{ storeQuery }}</div>
    <br>
</div>
</template>

<script>

import { mapState } from 'vuex'
import FilterComponent from './FilterComponent'

export default {
    name: 'vueqs',
    props: {
        query: Object
    },
    components: {
        FilterComponent
    },
    computed: {
        ...mapState('qs', {
            storeQuery: state => state.query
        })
    },
    methods: {
        setFilter (x) {
            this.query.filter = x.toString()
        },
        setPage (x) {
            this.query.page = x
        },
        reload () {
            this.$router.push({query: {}})
        }
    }
}
</script>
