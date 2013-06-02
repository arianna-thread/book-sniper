gb = require '../../../lib/pluginManager/plugins/googleBooks/googleBooks.js'
Q = require 'q'
pluginError = '../../errors/pluginError'
isbn = '9782709638821'
uri = 'http://books.google.fr/books?id=swsZuHxsJDwC&printsec=frontcover&dq=isbn:9782709638821&hl=&cd=1&source=gbs_api'
uri1 = 'http://books.google.fr/books/about/Steve_Jobs.html?hl=&id=swsZuHxsJDwC'

describe 'googleBooks', ()->

    it 'should be defined', () ->
        expect(gb).toBeDefined()

    describe 'getByUri',() ->
        it 'should return a promise with diffent uris', (done) ->
            expect(Q.isPromise(gb.getByURI(uri))).toBe(true)
            expect(Q.isPromise(gb.getByURI(uri1))).toBe(true)
            done()
        # it 'should retrieve the right book', (done) ->
        #     gb.getByURI(uri).then (dataURI) ->
        #         gb.getByISBN(isbn).then (dataISBN) ->
        #             # dataURI.key.forEach (e)->
        #             #     expect(dataURI[e]).toBe(dataISBN[e])
        #             expect(dataURI).toEqual(dataISBN)
        #             # expect(1).toBe(2)
        #             done()
        #         .fail (data) ->
        #             expect(1).toBe(2)
        #             done()
        #     .fail (data) ->
        #         expect(1).toBe(2)
        #         done()
        it 'should return invalidURI', (done) ->
            gb.getByURI('foobar').then (data) ->
                expect(1).not.toBe(1)
                done() 
            .fail (data) ->
                expect(data.code).toBe(1)
                done()


    describe 'GetByISBN',() ->
        it 'should return a promise', (done) ->
            expect(Q.isPromise(gb.getByISBN(isbn))).toBe(true)
            done()
        # it 'should retrieve the right book', (done) ->
        #     gb.getByISBN(isbn).then (dataURI) ->
        #         gb.getByURI(uri).then (dataISBN) ->
        #             # dataURI.key.forEach (e)->
        #             #     expect(dataURI[e]).toBe(dataISBN[e])
        #             expect(dataURI).toEqual(dataISBN)
        #             # expect(1).toBe(2)
        #             done()
        #         .fail (data) ->
        #             expect(1).toBe(2)
        #             done()
        #     .fail (data) ->
        #         expect(1).toBe(2)
        #         done()
        it 'should return invalidISBN', (done) ->
            gb.getByISBN('foobar').then (data) ->
                expect(1).not.toBe(1)
                done()
            .fail (data) ->
                expect(data.code).toBe(0)
                done()    

    describe 'raiseHand', () ->
        it 'should raise his hand', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (data)->
                return
            gb.raiseHand(uri,cb)
            expect(cb).toHaveBeenCalled()

        it 'should not raise his hand', () ->
            cb = jasmine.createSpy()
            cb.andCallFake (data)->
                return
            gb.raiseHand('fooobar',cb)
            expect(cb).not.toHaveBeenCalled()