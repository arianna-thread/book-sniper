di = require 'di'
m = new di.Module()
Q = require 'q'
config = 
    dbName: 'book-sniper-test'
    dbHost: '127.0.0.1'
    dbPort: 27017
db = require '../../lib/models/db'
injector = null
books = null
baseModelMock = null
m.value 'config', config
m.factory 'db', db
m.factory 'baseModel', require './mocks/baseModel'
m.factory 'books', require '../../lib/models/books'

describe 'books module', () ->

    beforeEach () -> 
        this.addMatchers
            toBeAnArray: () ->
                actual = @actual;
                notText =  if @isNot then ' not' else ''

                @message = () -> 
                    "Expected #{actual}#{notText} to be an Array"
                

                return Array.isArray(actual);
            toBeAPromise: () ->
                actual = @actual
                notText = if @isNot then ' not' else ''

                @message = () ->
                     "Expected #{actual}#{notText} to be a Q promise"

                Q.isPromise actual
        injector = new di.Injector [m];
        books = injector.get 'books'
        baseModelMock = injector.get 'baseModel'

    it 'should be defined', () ->
        expect(books).toBeDefined()


    it 'should expose a getAll method', () ->
        expect(books.getAll).toBeDefined()
        expect(typeof books.getAll).toBe 'function'

    it 'should expose a getByUri method', () ->
        expect(books.getByUri).toBeDefined()
        expect(typeof books.getByUri).toBe 'function'

    it 'should expose a getByISBN method', () ->
        expect(books.getByISBN).toBeDefined()
        expect(typeof books.getByISBN).toBe 'function'
    
    describe 'getAll method', () ->
        beforeEach () ->
            baseModelMock.expectGet 'books', {}

        it 'should return a promise', () ->
            expect(books.getAll()).toBeAPromise()

        it 'should make a _getAll on "books" collection', () ->
            spyOn(baseModelMock, '_getAll').andCallThrough()
            books.getAll()
            expect(baseModelMock._getAll).toHaveBeenCalledWith('books', {}, undefined)

    describe 'getByUri method', () ->
            

        it 'should return a promise', () ->
            baseModelMock.expectGet 'books', {}
            expect(books.getByUri('A URI')).toBeAPromise()

        it 'should resolve to a single object if uri exists', (done) ->
            retObj = {}
            baseModelMock.expectGet 'books', [retObj]
            spyOn(baseModelMock, '_getAll').andCallThrough()
            books.getByUri('A URI').then (book) ->
                expect(book).not.toBeAnArray()
                expect(typeof book).toBe('object')
                expect(book).toBe(retObj)
                done()
            .fail (err) ->
                console.error 'ERROR', err
                expect(false).toBe true
                done()
        
        it 'should resolve to null if no item is found', (done) ->
            baseModelMock.expectGet 'books', []
            
            failure = jasmine.createSpy('promise failure')
            books.getByUri('DUMMY_URI').then((book) ->
                expect(book).toBe null
            , failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()

        it 'should reject the promise if no uri is provided', (done) ->
            success = jasmine.createSpy()
            failure = jasmine.createSpy()
            books.getByUri().then(success, failure)
            .finally () ->
                expect(success).not.toHaveBeenCalled()
                expect(failure).toHaveBeenCalledWith('Expected undefined to be a string')
                done()

        it 'should reject the promise if more than 1 object is found', (done) ->
            retObj = {}
            baseModelMock.expectGet 'books', [retObj,retObj]
            success = jasmine.createSpy()
            failure = jasmine.createSpy()
            books.getByUri('DUMMY_URI').then(success, failure)
            .finally () ->
                expect(success).not.toHaveBeenCalled()
                expect(failure).toHaveBeenCalledWith("Consistency error, multiple objects found with same uri: [object Object],[object Object]")
                done()

        
    describe 'getByISBN', () ->
        validISBN13 = '9780385537858'
        it 'should return a promise', () ->
            baseModelMock.expectGet 'books', {}
            expect(books.getByISBN('A URI')).toBeAPromise()

        it 'should resolve to a single book if ISBN exists', (done) ->
            retObj = {}
            baseModelMock.expectGet 'books', [retObj]
            spyOn(baseModelMock, '_getAll').andCallThrough()
            failure = jasmine.createSpy()
            books.getByISBN(validISBN13).then( (book) ->
                expect(book).not.toBeAnArray()
                expect(typeof book).toBe('object')
                expect(book).toBe(retObj)
            , failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()

        it 'should resolve to null if ISBN is valid but doesn\'t exists', (done) ->
            baseModelMock.expectGet 'books', []
            failure = jasmine.createSpy('promise failure')
            books.getByISBN(validISBN13).then((book) ->
                expect(book).toBe null
            , failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()


        it 'should reject the promise if ISBN is not valid', (done) ->
            success = jasmine.createSpy()
            failure = jasmine.createSpy()
            books.getByISBN().then(success, failure)
            .finally () ->
                expect(success).not.toHaveBeenCalled()
                expect(failure).toHaveBeenCalledWith('ISBN must be a 13-characters string')
                done()

        it 'should reject the promise if more than 1 object is found', (done) ->
            retObj = {}
            baseModelMock.expectGet 'books', [retObj,retObj]
            success = jasmine.createSpy()
            failure = jasmine.createSpy()
            books.getByISBN(validISBN13).then(success, failure)
            .finally () ->
                expect(success).not.toHaveBeenCalled()
                expect(failure).toHaveBeenCalledWith("Consistency error, multiple objects found with same ISBN: [object Object],[object Object]")
                done()   



