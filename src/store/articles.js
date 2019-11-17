const moduleArticles = {
    namespaced: true,
    state: {
        loaded: false,
        articles: [],
        loadedCount: 0,
        loadedAt: null
    },
    mutations: {
        loading (state) {
            state.loaded = false
        },
        loaded (state, { articles }) {
            state.loaded = true
            state.articles = articles
            state.loadedCount++
            state.loadedAt = new Date()
        }
    },
    actions: {
        load (context) {
            context.commit('loading')
            setTimeout(() => {
                context.commit('loaded',
                    {
                        articles: [
                            {
                                code: '1',
                                title: 'First article'
                            },
                            {
                                code: '2',
                                title: 'Second article'
                            },
                            {
                                code: '3',
                                title: 'Third article'
                            },
                        ]
                    })
            }, 1000)
        }
    }
}

export { moduleArticles }
