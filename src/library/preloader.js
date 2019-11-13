import Vue from 'vue'

function extractActionParams (preloader, match, route) {
    let actionParams = {}
    const params = preloader.params || null
    if (params) {
        Object.keys(params).forEach(k => {
            actionParams[params[k]] = route.params[k]
        })
    } else {
        actionParams = {
            ...route.params
        }
    }
    return actionParams
}

const registerPreloader = function (router, store, {
    injection,
    errorHandler,
    debug
} = {}) {
    // a container with path segment name => jsonified store action parameters.
    // if these change in navigation, a reload on store is called
    const storedActionParamsContainer = [{}]

    // a path segment name => dynamic store name mapping
    const isolates = {}

    if (!errorHandler) {
        errorHandler = function ({ router, route, pathSegment, exception }) {
            console.error('Exception detected')
            return false
        }
    }

    async function beforeEachHandler (to, from, next) {
        const newActionParams = {}
        const storedActionParams = storedActionParamsContainer[0]
        for (const match of to.matched) {
            const preloader = match.meta && match.meta.preloader
            let injects = {}
            if (preloader !== undefined) {
                const actionParams = extractActionParams(preloader, match, to)

                const name = match.name
                const reload = preloader.reload || false

                if (name) {
                    const serializedParams = JSON.stringify(actionParams)
                    if (!reload && storedActionParams[name] !== undefined) {
                        if (storedActionParams[name] === serializedParams) {
                            newActionParams[name] = storedActionParams[name]
                            continue        // skip reloading
                        }
                    }
                    newActionParams[name] = serializedParams
                } else {
                    console.error(
                        'Preloader works only on named segments, ' +
                        'please add a name: ... property to route segment.')
                }

                const action = preloader.action || 'load'
                let storeModule = preloader.store || ''
                const isolated = preloader.isolated || ''
                if (isolated) {
                    const storeModuleDef = await isolated({ store, match, route: to, router })
                    await Vue.nextTick()
                    storeModule = storeModuleDef.store
                    delete storeModuleDef[store]
                    injects = {
                        ...injects,
                        ...storeModuleDef
                    }
                    isolates[name] = storeModule
                }
                try {
                    injects['storeModule'] = storeModule
                    const namespacedAction = storeModule ? `${storeModule}/${action}` : action
                    if (debug) {
                        console.log('dispatch', namespacedAction, actionParams)
                    }
                    await store.dispatch(namespacedAction, actionParams)
                } catch (e) {
                    console.error(e)
                    const res = errorHandler(router, to, match, e) || false
                    if (res !== true) {
                        next(res)
                        return
                    }
                }
                match.injects = injects
            }
        }
        // clean up isolates that are no more used in path segments
        Object.keys(isolates).forEach(name => {
            if (newActionParams[name] === undefined) {
                store.unregisterModule(isolates[name])
                delete isolates[name]
            }
        })

        // store parameters for the next route change
        storedActionParamsContainer[0] = newActionParams
        console.log('calling next')
        next()
    }

    function afterEachHandler (to, from) {
        Vue.nextTick(function () {
            console.log('after each', to.matched)
            for (const match of to.matched) {
                console.log('Instances', match.instances)
                if (match.instances && match.instances.default && match.injects) {
                    const inst = match.instances.default
                    Object.keys(match.injects).forEach(k => {
                        inst[k] = match.injects[k]
                    })
                    console.log(inst)
                }
            }
        })
    }

    router.beforeEach(beforeEachHandler)

    if (injection) {
        router.afterEach(afterEachHandler)
    }
}

export { registerPreloader }
