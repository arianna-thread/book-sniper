amazon = require '../../../lib/pluginManager/plugins/amazon/amazon.js'
Q = require 'q'
pluginError = '../../errors/pluginError'
isbn = '9782709638821'
uri = 'http://www.amazon.com/gp/product/1579654924/ref=s9_al_bw_g14_ir04?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-3&pf_rd_r=189D4777EEA342BC85AF&pf_rd_t=101&pf_rd_p=1546559002&pf_rd_i=390919011'

describe 'amazon', ()->

    it 'should be defined', () ->
        expect(amazon).toBeDefined()

    describe 'getByUri',() ->
        it 'should return a promise with diffent uris', (done) ->
            expect(Q.isPromise(amazon.getByURI(uri))).toBe(true)
            done()
        # it 'should retrieve the right book', (done) ->
        #     amazon.getByURI(uri).then (dataURI) ->
        #         amazon.getByISBN(dataURI.isbn).then (dataISBN) ->
                 
        #             expect(dataURI).toEqual(dataISBN)
        #             done()
        #         .fail (data) ->
        #             expect(1).toBe(2)
        #             done()
        #     .fail (data) ->
        #         expect(1).toBe(2)
        #         done()
        it 'should return invalidURI if invalid uri is given', (done) ->
            amazon.getByURI('foobar').then (data) ->
                expect(1).not.toBe(1)
                done() 
            .fail (data) ->
                expect(data.code).toBe(1)
                done()


    describe 'GetByISBN',() ->
        it 'should return a promise', (done) ->
            expect(Q.isPromise(amazon.getByISBN(isbn))).toBe(true)
            done()
        # it 'should retrieve the right book', (done) ->
        #     amazon.getByISBN(isbn).then (dataISBN) ->
        #         amazon.getByURI(dataISBN.uri).then (dataURI) ->
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
        it 'should return invalidISBN if invalid isbn is given', (done) ->
            amazon.getByISBN('foobar').then (data) ->
                expect(1).not.toBe(1)
                done()
            .fail (data) ->
                expect(data.code).toBe(0)
                done()    

    describe 'raiseHand', () ->
        it 'should raise his hand if it is called', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (boolean,data)->

            amazon.raiseHand(uri,cb)
            expect(cb).toHaveBeenCalledWith(true,'amazon')

        it 'should not raise his hand if it isn t called', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (boolean,data)->
            amazon.raiseHand('foobar',cb)
            expect(cb).toHaveBeenCalledWith(false)