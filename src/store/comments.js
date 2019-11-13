function commentStoreFactory ({ store }) {
    const name = `comments-${Math.random()}`
    store.registerModule(name, {
        // module declaration
        namespaced: true,
        state: {
            loaded: false,
            comments: []
        },
        mutations: {
            loading (state) {
                state.loaded = false
            },
            loaded (state, { comments }) {
                state.loaded = true
                state.comments = comments
            }
        },
        actions: {
            loadComments (context, { articleId }) {
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
                }, 1000)
            }
        }
    })
    return {
        store: name
    }
}

export { commentStoreFactory }
