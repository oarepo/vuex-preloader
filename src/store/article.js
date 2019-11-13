const moduleArticle = {
    namespaced: true,
    state: {
        loaded: false,
        item: null
    },
    mutations: {
        loading (state) {
            state.loaded = false
        },
        loaded (state, { item }) {
            state.loaded = true
            state.item = item
        }
    },
    actions: {
        loadArticle (context, { id }) {
            context.commit('loading')
            setTimeout(() => {
                context.commit('loaded', {
                    item: {
                        author: `Author ${id}`,
                        title: `Article ${id}`,
                        code: id
                    }
                })
            }, 100)
        }
    }
}

export { moduleArticle }
