import Vue from 'vue'

function extractActionParams (preloader, match, route, extraProps) {
    let actionParams = {}
    const params = preloader.params || null
    if (params) {
        Object.keys(params).forEach(k => {
            actionParams[params[k]] = route.params[k] || extraProps[k]
        })
    } else {
        actionParams = {
            ...extraProps,
            ...route.params
        }
    }
    if (preloader.query) {
        actionParams['query'] = route.query
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

    const lastLoaded = {}

    const reloaderTimers = {}

    if (!errorHandler) {
        errorHandler = function ({ router, route, pathSegment, exception }) {
            console.error('Exception detected')
            return false
        }
    }

    async function runPreloader (match, storedActionParams, actionParams, preloader, from, to) {
        let injects = {}

        const name = match.name
        const reload = preloader.reload || false
        let storeModule = preloader.store || ''
        const expiration = preloader.expiration
        const reloadInterval = preloader.reloadInterval
        const action = preloader.action || 'load'
        const isolated = preloader.isolated || ''

        const key = preloader.key || [name, storeModule, action].filter(x => !!x).map(x => x.toString()).join(':')
        if (debug) {
            console.log(`preloader will use key ${key} for route segment`, match)
        }

        const serializedParams = JSON.stringify(actionParams)
        if (debug) {
            console.log('checking if reload is needed: serialized params ',
                serializedParams, 'stored params', storedActionParams[key],
                'reload', reload)
        }
        let skipReloading = !reload
        if (storedActionParams[key] === undefined) {
            skipReloading = false
        } else if (storedActionParams[key] !== serializedParams) {
            skipReloading = false
        }
        let storeState = store.state
        if (storeModule.length) {
            storeState = storeState[storeModule]
        }
        if (storeState['reloadNeeded']) {
            skipReloading = false
        }
        if (expiration && lastLoaded[key] &&
            new Date(lastLoaded[key].getTime() + expiration * 1000) < new Date()) {
            skipReloading = false
        }
        if (skipReloading) {
            return { [key]: storedActionParams[key] }
        }

        if (isolated) {
            const storeModuleDef = await isolated({ store, match, route: to, router })
            await Vue.nextTick()
            storeModule = storeModuleDef.store
            delete storeModuleDef[store]
            injects = {
                ...injects,
                ...storeModuleDef
            }
            isolates[key] = storeModule
        }

        async function runReload () {
            injects['storeModule'] = storeModule
            const namespacedAction = storeModule ? `${storeModule}/${action}` : action
            if (debug) {
                console.log('dispatch', namespacedAction, actionParams, 'from', from, 'to', to)
            }
            await store.dispatch(namespacedAction, actionParams)
            lastLoaded[key] = new Date()
        }

        await runReload()
        if (reloadInterval) {
            if (reloaderTimers[key] !== undefined) {
                clearInterval(reloaderTimers[key])
            }
            reloaderTimers[key] = setInterval(runReload, reloadInterval * 1000)
        }
        if (injection) {
            Object.keys(injects).forEach(k => {
                to.params[k] = injects[k]
            })
        }
        if (debug) {
            console.log(`Called store ${name}, returning`, { [key]: serializedParams })
        }
        return { [key]: serializedParams }
    }

    async function beforeEachHandler (to, from, next) {
        const storedActionParams = storedActionParamsContainer[0]
        const newActionParams = {}
        // for each route segment, check if there is a preloader and run it
        for (const match of to.matched) {
            const preloaders = match.meta && match.meta.preloader
            if (preloaders === undefined) {
                continue
            }
            let extraProps = {}
            if (match.props) {
                if (match.props.default instanceof Function) {
                    extraProps = { ...match.props.default(to) }
                } else if (Object(match.props.default) === match.props.default) {
                    extraProps = { ...match.props.default }
                }
            }
            // the ``preloaders`` are either a single object or an array. If a single object, cast it to an array
            for (const preloader of (Array.isArray(preloaders) ? preloaders : [preloaders])) {

                const actionParams = extractActionParams(preloader, match, to, {
                    ...(preloader.props || {}),
                    ...extraProps
                })
                try {
                    // run the preloader. It returns an object {key: actionParams} as a retval.
                    // Extend the new action params with the retval - this way we know which actions
                    // has been found on the path
                    Object.assign(newActionParams,
                        await runPreloader(match, storedActionParams, actionParams, preloader, from, to))
                } catch (e) {
                    // in case of error run the error handler and call its next
                    console.error(e)
                    const res = errorHandler(router, to, match, e) || false
                    if (res !== true) {
                        next(res)
                        return
                    }
                }
            }
        }

        if (debug) {
            console.log('about tpo remove isolates and timers, current action params', newActionParams)
        }
        // clean up isolates that are no more used in path segments
        Object.keys(isolates).forEach(key => {
            if (newActionParams[key] === undefined) {
                if (debug) {
                    console.log('Removing isolated store', key)
                }
                store.unregisterModule(isolates[key])
                delete isolates[key]
                // remove stored params as the isolated store has been destroyed
                if (storedActionParamsContainer[0][key] !== undefined) {
                    delete storedActionParamsContainer[0][key]
                }
            }
        })

        // clean up all timers that are no more used in path segments
        Object.keys(reloaderTimers).forEach(key => {
            if (newActionParams[key] === undefined) {
                if (debug) {
                    console.log('Removing timer', key)
                }
                clearInterval(reloaderTimers[key])
                delete reloaderTimers[key]
            }
        })

        // store parameters for the next route change
        storedActionParamsContainer[0] = { ...storedActionParams, ...newActionParams }
        if (debug) {
            console.log('calling next, stored action params', storedActionParamsContainer[0])
        }

        next()
    }

    router.beforeEach(beforeEachHandler)
    return {
        beforeEachHandler
    }
}

export { registerPreloader }
