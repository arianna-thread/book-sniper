gb = require '../../../lib/pluginManager/plugins/ebay/ebay.js'
Q = require 'q'
pluginError = '../../errors/pluginError'
isbn = '9781451648539'  
uri = 'http://product.half.ebay.com/Steve-Jobs-by-Walter-Isaacson-2011-Hardcover/109073110&tg=info'
uri2 = 'http://product.half.ebay.com/Steve-Jobs-by-Walter-Isaacson-2011-Hardcover?pr=109073110&tg=info'

describe 'ebay', ()->

    it 'should be defined', () ->
        expect(gb).toBeDefined()

    describe 'getByUri',() ->
        it 'should return a promise with different uris', (done) ->
            expect(Q.isPromise(gb.getByURI(uri))).toBe(true)
            expect(Q.isPromise(gb.getByURI(uri2))).toBe(true)  
            done()
        # it 'should retrieve the right book', (done) ->
        #     gb.getByURI(uri).then (dataURI) ->
        #         gb.getByISBN(dataURI.isbn).then (dataISBN) ->
        #             expect(dataURI).toEqual(dataISBN)
        #             done()
        #         .fail (data) ->
        #             expect(1).toBe(2)
        #             done()
        #     .fail (data) ->
        #         expect(1).toBe(2)
        #         done()
        it 'should return invalidURI if invalid uri is given', (done) ->
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
        #     gb.getByISBN(isbn).then (dataISBN) ->
        #         gb.getByURI(dataISBN.uri).then (dataURI) ->       
        #             expect(dataURI).toEqual(dataISBN)
        #             done()
        #         .fail (data) ->
        #             expect(1).toBe(2)
        #             done()
        #     .fail (data) ->
        #         expect(1).toBe(2)
        #         done()
        it 'should return invalidISBN if invalid isbn is given', (done) ->
            gb.getByISBN('foobar').then (data) ->
                expect(1).not.toBe(1)
                done()
            .fail (data) ->
                expect(data.code).toBe(0)
                done()    

    describe 'raiseHand', () ->
        it 'should raise his hand if it is called', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (boolean,data)->
            gb.raiseHand(uri,cb)
            expect(cb).toHaveBeenCalledWith(true,'ebay')

        it 'should not raise his hand if it isn t called', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (boolean,data)->
            gb.raiseHand('foobar',cb)
            expect(cb).toHaveBeenCalledWith(false)