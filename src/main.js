import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VuexPreloader from './library'

Vue.config.productionTip = false

Vue.use(VuexPreloader, {
    router, store,
    injection: true,
    debug: false
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
