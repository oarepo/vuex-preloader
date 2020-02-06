import Vue from 'vue'
import Vuex from 'vuex'
import { moduleArticles } from './articles'
import { moduleArticle } from './article'
import { moduleVueQS } from './vueqs'

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        'articles': moduleArticles,
        'article': moduleArticle,
        'qs': moduleVueQS
    },
    strict: process.env.NODE_ENV !== 'production'
})
