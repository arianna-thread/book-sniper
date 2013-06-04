itunes = require '../../../lib/pluginManager/plugins/itunes/itunes.js'
Q = require 'q'
pluginError = '../../errors/pluginError'
uri = 'http://books.google.fr/books?id=swsZuHxsJDwC&printsec=frontcover&dq=isbn:9782709638821&hl=&cd=1&source=gbs_api'
uri1 = 'http://books.google.fr/books/about/Steve_Jobs.html?hl=&id=swsZuHxsJDwC'
itunesLookup = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11'
invaliditunesLookup = 'https://itunes.apple.com/us/book/steve-jobs/id4316asd17578?mt=11';
uriitunes = 'https://itunes.apple.com/us/book/the-fifth-witness/id395519191?mt=11&uo=4'
isbn = '9780316069359'

describe 'itunesPlugin', ()->

    it 'should be defined', () ->
        expect(itunes).toBeDefined()

    describe 'getByUri',() ->
        it 'should return a promise ', (done) ->
            expect(Q.isPromise(itunes.getByURI(itunesLookup))).toBe(true)
            done()
        # it 'should retrieve the right book', (done) ->
        #     itunes.getByURI(uriitunes).then (dataURI) ->
        #         expect(dataURI.title).toBe('The Fifth Witness')
        #         done()
        it 'should return invalidURI', (done) ->
            itunes.getByURI('foobar').then (data) ->
                expect(1).not.toBe(1)
                done() 
            .fail (data) ->
                expect(data.code).toBe(1)
                done()


    describe 'GetByISBN',() ->
        it 'should return a promise', (done) ->
            expect(Q.isPromise(itunes.getByISBN(isbn))).toBe(true)
            done()
        # it 'should retrieve the right book (same title)', (done) ->
        #     itunes.getByISBN(isbn).then (dataISBN) ->
        #         itunes.getByURI(dataISBN.uri).then (dataURI) ->
        #             expect(dataURI.title).toBe(dataISBN.title)
        #             done()
        #         .fail (err) ->
        #             console.error 'err:', err
        #             expect(1).toBe(2)
        #             done()
        #     .fail (data) ->
        #         console.error 'errr:', data
        #         expect(1).toBe(2)
        #         done()
                
        it 'should return invalidISBN', (done) ->
            itunes.getByISBN('foobar').then (data) ->
                expect(1).not.toBe(1)
                done()
            .fail (data) ->
                expect(data.code).toBe(0)
                done()    

    describe 'raiseHand', () ->
        it 'should raise his hand', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (boolean,data)->
            itunes.raiseHand(itunesLookup,cb)
            expect(cb).toHaveBeenCalledWith(true,'itunes')

        it 'should not raise his hand', () ->
            cb = jasmine.createSpy('this is the callback of raiseHand')
            cb.andCallFake (boolean,data)->
            itunes.raiseHand('foobar',cb)
            expect(cb).toHaveBeenCalledWith(false)
