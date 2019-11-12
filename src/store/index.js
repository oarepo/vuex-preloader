import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const moduleA = {
    namespaced: true,
    state: {
        loaded: false,
        item: null
    },
    mutations: {
        loading(state) {
            state.loading = false
        },
        loaded (state, { item }) {
            state.loaded = true
            state.item = `${item}${new Date()}`
        }
    },
    actions: {
        load (context) {
            context.commit('loading')
            setTimeout(() => {
                context.commit('loaded', { item: 'moduleA item' })
            }, 10)
        }
    }
}

const moduleB = {
    namespaced: true,
    state: {
        loaded: false,
        item: null
    },
    mutations: {
        loading(state) {
            state.loading = false
        },
        loaded (state, { item }) {
            state.loaded = true
            state.item = `${item}${new Date()}`
        }
    },
    actions: {
        load (context, {id}) {
            context.commit('loading')
            setTimeout(() => {
                context.commit('loaded', { item: `moduleB item with ${id}` })
            }, 100)
        }
    }
}

export default new Vuex.Store({
    modules: {
        'a': moduleA,
        'b': moduleB
    },
    strict: process.env.NODE_ENV !== 'production'
})
