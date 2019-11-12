import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import { registerPreloader } from '../library'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            preloader: {
                'store': 'a'
            }
        },
        children: [
            {
                path: '/about/:tid',
                name: 'about',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
                meta: {
                    preloader: {
                        'store': 'b',
                        'params': {
                            tid: 'id'
                        }
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
