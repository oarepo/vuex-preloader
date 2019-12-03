function commentStoreFactory ({ store }) {
    const name = `comments_${Math.floor(Math.random() * 100000)}`
    console.log('Registering store', name)
    store.registerModule(name, {
        // module declaration
        namespaced: true,
        state: {
            loaded: false,
            comments: [],
            loadedCount: 0,
            loadedAt: null
        },
        mutations: {
            loading (state) {
                state.loaded = false
            },
            loaded (state, { comments }) {
                state.loaded = true
                state.comments = comments
                state.loadedCount++
                state.loadedAt = new Date()
            }
        },
        actions: {
            loadComments (context, { articleId }) {
                return new Promise((resolve, reject) => {
                    context.commit('loading')
                    setTimeout(() => {
                        context.commit('loaded',
                            {
                                comments: [
                                    `first comment on article ${articleId}`,
                                    `second comment on article ${articleId}`,
                                    `third comment on article ${articleId}`
                                ]
                            })
                        resolve()
                    }, 100)
                })
            }
        }
    })
    return {
        store: name
    }
}

export { commentStoreFactory }
