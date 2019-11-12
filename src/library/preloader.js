const registerPreloader = function (router, store, errorHandler) {
    const storedParamsContainer = [{}]

    async function handler (to, from, next) {
        const newParams = {}
        const storedParams = storedParamsContainer[0]
        for (const match of to.matched) {
            const preloader = match.meta && match.meta.preloader
            if (preloader !== undefined) {
                const storeModule = preloader.store || ''
                const action = preloader.action || 'load'
                const namespacedAction = storeModule ? `${storeModule}/${action}` : action
                const params = preloader.params || null
                const name = match.name
                const reload = preloader.reload || false
                let actionParams = {}
                if (params) {
                    Object.keys(params).forEach(k => {
                        actionParams[params[k]] = to.params[k]
                    })
                } else {
                    actionParams = {
                        ...to.params
                    }
                }
                if (name) {
                    if (!reload && storedParams[name] !== undefined) {
                        if (JSON.stringify(storedParams[name]) === JSON.stringify(actionParams)) {
                            newParams[name] = storedParams[name]
                            continue        // skip reloading
                        }
                    }
                    newParams[name] = actionParams
                }
                try {
                    await store.dispatch(namespacedAction, actionParams)
                } catch (e) {
                    const res = errorHandler(router, to, match, e) || false
                    if (res !== true) {
                        next(res)
                        return
                    }
                }
            }
        }
        storedParamsContainer[0] = newParams
        next()
    }

    router.beforeEach(handler)
}

export { registerPreloader }
