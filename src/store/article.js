const moduleArticle = {
    namespaced: true,
    state: {
        loaded: false,
        item: null,
        loadedCount: 0,
        loadedAt: null
    },
    mutations: {
        loading (state) {
            state.loaded = false
        },
        loaded (state, { item }) {
            state.loaded = true
            state.item = item
            state.loadedCount++
            state.loadedAt = new Date()
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
