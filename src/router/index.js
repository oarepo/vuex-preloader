import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
import Comments from '../views/Comments.vue'
import {commentStoreFactory} from '../store/comments'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            preloader: {
                'store': 'articles',
            }
        },
        props: true
    },
    {
        path: '/:articleId',
        name: 'article',
        component: Article,
        meta: {
            preloader: {
                'store': 'article',
                'action': 'loadArticle',
                'params': {
                    articleId: 'id'
                },
                'expiration': 20
            }
        },
        children: [
            {
                path: 'comments',
                name: 'comments',
                component: Comments,
                props: true,
                meta: {
                    preloader: {
                        'isolated': commentStoreFactory,
                        'action': 'loadComments',
                        'params': {
                            articleId: 'articleId'
                        },
                        'reloadInterval': 1
                    }
                }
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
