<template>
<div class="home">
    <h1>Articles</h1>
    <div v-if="!loaded">Loading ...</div>
    <div v-for="article of articles" :key="article.code">
        <router-link :to="{name: 'article', params: {articleId: article.code}}">{{article.title}}</router-link>
    </div>
    <div><router-link :to="{name: 'vueqs'}">vue-query-synchronizer integration demo</router-link></div>
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'home',
    components: {},
    computed: {
        ...mapState('articles', {
            loaded: state => state.loaded,
            articles: state => state.articles
        })
    }
}
</script>
