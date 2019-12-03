import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { registerPreloader } from './library/preloader'

Vue.config.productionTip = false

registerPreloader(router, store, {
    injection: true,
    debug: false
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
