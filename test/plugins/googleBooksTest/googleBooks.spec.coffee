gb = require '../../../lib/pluginManager/plugins/googleBooks/googleBooks.js'
Q = require 'q'
pluginError = '../../../lib/errors/pluginError'
isbn = '9782709638821'
uri = 'http://books.google.fr/books?id=swsZuHxsJDwC&printsec=frontcover&dq=isbn:9782709638821&hl=&cd=1&source=gbs_api'
uri1 = 'http://books.google.fr/books/about/Steve_Jobs.html?hl=&id=swsZuHxsJDwC'
foo
    cb = (data) ->
    return



describe 'googleBooks', ()->

    it 'should be defined', () ->
        expect(gb).toBeDefined()
    describe 'getByUri',() ->
        it 'should return a promise with diffent uris', () ->
            expect(Q.isPromise(gb.getByURI(uri))).toBe(true)
            expect(Q.isPromise(gb.getByURI(uri1))).toBe(true)
        it 'should retrieve the right book', (done) ->
            gb.getByURI(uri).then (dataURI) ->
                gb.getByISBN(isbn).then (dataISBN) ->
                    # dataURI.key.forEach (e)->
                    #     expect(dataURI[e]).toBe(dataISBN[e])
                    expect(dataURI).toEqual(dataISBN)
                    # expect(1).toBe(2)
                    done()
                .fail (data) ->
                    expect(1).toBe(2)
                    done()
            .fail (data) ->
                expect(1).toBe(2)
                done()
        it 'should return invalidURI', () ->
        gb.getByURI('foobar').then (data) ->
            expect(1).not.toBe(1) 
        .fail (data) ->
            expect(data).toEqual(pluginError.factory('invalidURI'))  

    describe 'GetByISBN',() ->
        it 'should return a promise', () ->
            expect(Q.isPromise(gb.getByISBN(isbn))).toBe(true)
        it 'should retrieve the right book', (done) ->
            gb.getByISBN(isbn).then (dataURI) ->
                gb.getByURI(uri).then (dataISBN) ->
                    # dataURI.key.forEach (e)->
                    #     expect(dataURI[e]).toBe(dataISBN[e])
                    expect(dataURI).toEqual(dataISBN)
                    # expect(1).toBe(2)
                    done()
                .fail (data) ->
                    expect(1).toBe(2)
                    done()
            .fail (data) ->
                expect(1).toBe(2)
                done()
        it 'should return invalidISBN', () ->
        gb.getByISBN('foobar').then (data) ->
            expect(1).not.toBe(1) 
        .fail (data) ->
            expect(data).toEqual(pluginError.factory('invalidISBN'))     

    describe 'raiseHand', () ->
        it 'should raise his hand', () ->
            






