import { registerPreloader } from './library/preloader'

export { registerPreloader }

export default {
    install (Vue, options = {}) {
        const store = options.store
        const router = options.router
        if (store === undefined) {
            throw new Error('Pass store to @oarepo/vuex-preloader')
        }
        if (router === undefined) {
            throw new Error('Pass router to @oarepo/vuex-preloader')
        }
        delete options.store
        delete options.router
        registerPreloader(router, store, options)
    }
}
