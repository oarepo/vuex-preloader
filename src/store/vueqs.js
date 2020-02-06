const moduleVueQS = {
    namespaced: true,
    state: {
        query: null,
    },
    mutations: {
        loaded (state, { query }) {
            state.query = JSON.parse(JSON.stringify(query))
        }
    },
    actions: {
        load (context, { query }) {
            context.commit('loaded', {
                query: query || ''
            })
        }
    }
}

export { moduleVueQS }
