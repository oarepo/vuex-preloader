import chai, { expect } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { registerPreloader } from '@/library/preloader'
import sinonChai from 'sinon-chai'

import sinon from 'sinon'

chai.use(sinonChai)

const sandbox = sinon.createSandbox()

describe('No options to store', () => {

    afterEach(() => {
        sandbox.restore()
    })

    it('Calls store', async () => {
        const route = {
            name: 'home',
            meta: {
                preloader: {
                    params: {
                        'articleId': 'articleId'
                    }
                }
            },
            path: '/:articleId',
            hash: '',
            query: {},
            params: {
                articleId: 1
            },
            fullPath: '/',
            matched: [
                {
                    path: '',
                    regex: '',
                    components: {},
                    instances: {},
                    name: 'home',
                    meta: {
                        preloader: {
                            params: {
                                'articleId': 'articleId'
                            }}
                    },
                    props: {}
                }
            ]
        }
        const dispatch = sinon.stub().returns({})
        const next = sinon.stub()
        const router = sinon.stub({beforeEach() {}})
        const { beforeEachHandler } = registerPreloader(router, { state: {}, dispatch }, {
            debug: false
        })
        await beforeEachHandler(route, route, next)
        // console.log('Dispatch call', dispatch.getCall(0).args)
        expect(dispatch).to.have.been.calledOnce
        expect(dispatch).to.have.been.calledWith('load', { articleId: 1})
        expect(next).to.have.been.calledOnce
        expect(next).to.have.been.calledWith()
    })
})
