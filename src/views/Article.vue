<template>
<div class="home">
    <h1>Article</h1>
    <div v-if="!loaded">Loading ...</div>
    <div v-else>
        Author: {{ item.author }} <br>
        Title: {{ item.title }}<br>
        <router-link :to="{name: 'comments', params: {articleId: item.code}}">Load comments</router-link>
    </div>
    <router-view></router-view>
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'myarticle',
    components: {},
    computed: {
        ...mapState('article', {
            loaded: state => state.loaded,
            item: state => state.item
        })
    }
}
</script>
