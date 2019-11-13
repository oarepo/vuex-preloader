import Vue from 'vue'
import Vuex from 'vuex'
import { moduleArticles } from './articles'
import { moduleArticle } from './article'

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        'articles': moduleArticles,
        'article': moduleArticle
    },
    strict: process.env.NODE_ENV !== 'production'
})
