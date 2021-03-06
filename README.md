# @oarepo/vuex-preloader

A url-parameters based preloader for vuex stores

<p align="center">
    <a href="https://travis-ci.org/oarepo/vuex-preloader" target="_blank">
        <img src="https://img.shields.io/travis/oarepo/vuex-preloader"
            alt="travis build stat"></a>
    <a href="https://www.npmjs.com/package/@oarepo/vuex-preloader" target="_blank">
        <img src="https://img.shields.io/npm/v/@oarepo/vuex-preloader"
            alt="npm version"></a>
</p>

<!-- toc -->

- [What it does](#what-it-does)
- [Installation](#installation)
- [Configuration](#configuration)
- [Multiple loaders on one path](#multiple-loaders-on-one-path)
- [Single store on multiple paths](#single-store-on-multiple-paths)
- [Reloading](#reloading)
- [Store name injection](#store-name-injection)
- [Project setup](#project-setup)
- [Sample application](#sample-application)
  * [Compile the library](#compile-the-library)

<!-- tocstop -->

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
import VuexPreloader from '@oarepo/vuex-preloader'

function errorHandler({router, route, pathSegment, exception}) { 
    console.error('Exception detected')
    return '/error/404'
}
Vue.use(
    VuexPreloader, 
    {
        router, store, 
        errorHandler, 
        debug: true
    }
)
```  

In routes, make sure that *routes are named* and add the ``meta`` sections:

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
   * ``props`` - extra static props that will be passed to the store
   * ``reload`` - if set to ``true``, always dispatch the ``action``. 
      If set to ``false`` (default), dispatch the ``action`` only when the parameters
      to the ``action`` call have changed.
   * ``expiration`` - if set, store will not be reloaded if expiration (in seconds) 
      has not passed since the last load
   * ``reloadInterval`` - if set, store will be reloaded automatically each reloadInterval
     (if the path still matches)

      

The path is changed only if all actions succeed in loading. If they do not,
an error handler is called with object ``{router, route, pathSegment, exception}``.
The handler can return:

   * ``true`` to continue loading
   * ``false`` to stop path change. The handler is responsible 
      for communicating the error and/or calling ``router.navigate``
   * ``new route`` to use it as the ``next`` url - page will be changed to this
     (for example, 404 page) 

## Multiple loaders on one path

The library supports multiple preloaders on a single route. Just put the loaders
into an array, such as in:

```javascript
const routes = [
    {
        path: '/:articleId',
        name: 'article',
        component: () => Article,
        meta: {
            preloader: [{
                'store': 'article',
                'action': 'loadArticle',
                'params': {
                    articleId: 'id'
                }
            },
            {
                'store': 'comments',
                'action': 'loadArticleComments',
                'params': {
                    articleId: 'id'
                }
            }]
        }
    }
]
```

## Single store on multiple paths

For cases where two paths reference the same loader, the loader would not reload as the remembered
previous state is recorded on each path and so the loader does not know that a store
content's has changed.

To fix this issue, manually set on all preloaders the same ``key`` property, such as:

```javascript
const routes = [
    {
        path: '/:articleId',
        name: 'article1',
        component: () => Article1,
        meta: {
            preloader: {
                'key': 'article',
                // extra params here
            }
        }
    },
    {
        path: '/:articleId',
        name: 'article2',
        component: () => Article2,
        meta: {
            preloader: {
                'key': 'article',
                // extra params here
            }
        }
    }
]
```


## Reloading

In the default settings, store is only reloaded if the params for the fetch
method have changed (i.e. the params in the url for the given route has changed). 
This setting can be overridden on many levels:

``reload``

if this option is set to true, the store will reload anytime the url is hit

``expiration``

if this option is set, the reload will happen on url change whenever
the current time is greater than the time of the last fetch + expiration.

``reloadInterval``

if the route is shown to the user, the store will reload every ``reloadInterval``
seconds

``store.reloadNeeded``

additionally if there is a property on the store called ``reloadNeeded`` and
it is set to true, the store will be reloaded when the url is hit.

## Store name injection

The library can also inject actual store name and additional properties into the component
responsible for the path segment. To use this functionality (for example in case of isolated
stores), register:

```javascript

registerPreloader(router, store, erorrHandler, {injection: true})

```

Implicitly ``storeName`` is injected into the component's props. When using isolated factory,
all properties returned by the factory are injected as well.

## ``vue-query-synchronizer`` integration

It is possible to use this library together with ``vue-query-synchronizer``. This way
the default values (such as pageSize=10, if not found in query) are stored in one place
in query synchronizer. An example ('1' is the default value of ``filter``):

```javascript
routePart = {
        path: '/vue-query-synchronizer',
        name: 'vueqs',
        component: VueQS,
        meta: {
            preloader: {
                'store': 'qs',
            }
        },
        props: query([
            'string:filter:1',
        ], {}, {
            passParams: true,
        })
    }
```

The library can also enable you to store/retrieve the default value to localStorage/server
so that when user opens the application he sees his previous preset values (such as
default number of table rows):

```javascript
routePart = {
        path: '/vue-query-synchronizer',
        name: 'vueqs',
        component: VueQS,
        meta: {
            preloader: {
                'store': 'qs',
            }
        },
        props: query([
            'number:pageSize',
        ], {}, {
            passParams: true,
            onInit (params) {
                params[0].defaultValue = window.localStorage.getItem('pageSize') || '10'
                return params
            },
            onChange (newQuery, query) {
                window.localStorage.setItem('pageSize', query.pageSize || '')
            }
        })
    }
```

See https://github.com/oarepo/vue-query-synchronizer for details on using this library. 


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
