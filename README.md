# @oarepo/vuex-preloader

## What it does

This library provides a preloader that listens on router changes (beforeEach)
and calls action on a vuex store before the execution is passed to target vue component. 

When the route is changed, the preloader looks for ``meta.preloader`` section
of matched route segments (all the way up to the root). For each of the
preloader segment it calls ``load`` method on the appropriate store. The methods
are called in the order from the root down to the end of the matched path.

## Installation

```bash
yarn add @oarepo/vuex-preloader
```

## Configuration

In main.js/quasar boot, register the preloader: 

```javascript
import { registerPreloader } from '@oarepo/vuex-preloader'

function errorHandler({router, route, pathSegment, exception}) { 
    console.error('Exception detected')
    return '/error/404'
}

registerPreloader(router, store, {erorrHandler, debug: true})
```  

In routes, add the ``meta`` sections:

```javascript
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            preloader: {
                'store': 'articles',
            }
        }
    },
    {
        path: '/:articleId',
        name: 'article',
        component: () => Article,
        meta: {
            preloader: {
                'store': 'article',
                'action': 'loadArticle',
                'params': {
                    articleId: 'id'
                }
            }
        },
        children: [
            {
                path: '/comments',
                name: 'comments',
                component: () => Comments,
                meta: {
                    preloader: {
                        'isolated': commentStoreFactory,
                        'action': 'loadComments',
                        'params': {
                            articleId: 'articleId'
                        }
                    }
                }
            }
        ]
    }
]
```

With this configuration, if user navigates to ``/12/comments``, a loading action
is dispatched on two stores - at first on article store and then comment store - 
and after the loading has finished route is changed and ``Comments`` component
is shown.

Parameters inside ``meta.preloader``:
   
   * ``store`` - use this store module. If not filled, use the whole store
   * ``isolated`` - the parameter is a function that returns a vuex ``module``.
      The module is instantiated and registered via store.registerModule with
      a random name (prefixed with ``instantiated_module.vuex_name``)
      When the module is not needed (user navigates out of the path segment), 
      it is automatically removed from the main store. 
   * ``action`` - dispatch this action on the store. Default action is ``load``
   * ``params`` - if filled, pass only these arguments to the store. The key
      is the name of path parameter, the value is the name of the passed parameter
      to the ``action``. If not filled, all path parameters are passed to the store's 
      ``action``.    
   * ``reload`` - if set to ``true``, always dispatch the ``action``. 
      If set to ``false`` (default), dispatch the ``action`` only when the parameters
      to the ``action`` call have changed. Note: to use this feature a ``name`` must be
      set on the segment. 

The path is changed only if all actions succeed in loading. If they do not,
an error handler is called with object ``{router, route, pathSegment, exception}``.
The handler can return:

   * ``true`` to continue loading
   * ``false`` to stop path change. The handler is responsible 
      for communicating the error and/or calling ``router.navigate``
   * ``new route`` to use it as the ``next`` url - page will be changed to this
     (for example, 404 page) 

## Store name injection

*In progress, does not work yet*

The library can also inject actual store name and additional properties into the component
responsible for the path segment. To use this functionality (for example in case of isolated
stores), register:

```javascript

registerPreloader(router, store, erorrHandler, {injection: true})

```

Implicitly ``storeName`` is injected into the component's props. When using isolated factory,
all properties returned by the factory are injected as well.

## Project setup
```
yarn install
```

## Sample application

To see the library in action, run the sample application

```
yarn run serve
```

### Compile the library
```
yarn run build
```
