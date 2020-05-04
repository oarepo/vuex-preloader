<template>
<div>
    Filter as component:
    <select v-model="query.filter">
        <option value="1">filter='1'</option>
        <option value="2">filter='2'</option>
        <option value="3">filter='3'</option>
    </select>
    <select v-model="query.page">
        <option value="1">page='1'</option>
        <option value="2">page='2'</option>
        <option value="3">page='3'</option>
    </select>
    <br>
    Note: page3 will automatically go to page 1
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'filter-component',
    props: {
        query: Object
    },

    watch: {
        'query.page': function (newPage, oldPage) {
            if (newPage === 3) {
                this.query.page = 1
            }
        }
    }
}
</script>
