di = require 'di'
m = new di.Module()
Q = require 'q'
config = 
    dbName: 'book-sniper-test'
    dbHost: '127.0.0.1'
    dbPort: 27017
db = require '../../lib/models/db'

injector = null
modelManager = null
baseModelMock = null
errors = null
m.value 'errors', require '../../lib/models/errors'
m.value 'config', config
m.factory 'db', db
m.factory 'baseModel', require './mocks/baseModel'
m.factory 'books', require '../../lib/models/books'
m.factory 'modelManager', require '../../lib/models/modelManager'

describe 'modelManager module', () ->

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
        modelManager = injector.get 'modelManager'
        baseModelMock = injector.get 'baseModel'
        errors = injector.get 'errors'


    it 'should expose a searchByUri method', () ->
        expect(modelManager.searchByUri).toBeDefined()
    
    describe 'searchByUri', () ->

        it 'should return a promise', () ->
            baseModelMock.expectGet 'books', []
            expect(modelManager.searchByUri('a uri')).toBeAPromise()

        it 'should resolve to an object if exists', (done) ->
            book = {}
            baseModelMock.expectGet 'books', [book]
            failure = jasmine.createSpy('promise failure')
            modelManager.searchByUri('anUri').then((retVal) ->
                expect(retVal).toBe book
            , failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()

        it 'should reject to error.NOT_FOUND if nothing found', (done) ->
            baseModelMock.expectGet 'books', []
            failure = jasmine.createSpy('search by uri not found promise failure')
            modelManager.searchByUri('anUri').then failure, (retVal) ->
                expect(retVal).toBe errors.NOT_FOUND
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()

     describe 'getByISBN', () ->

        it 'should return a promise', () ->

            baseModelMock.expectGet 'books', []
            expect(modelManager.getByISBN('a uri')).toBeAPromise()

        it 'should resolve to an object if exists', (done) ->
            book = {}
            validISBN13 = '9780385537858'
            baseModelMock.expectGet 'books', [book]
            failure = jasmine.createSpy('promise failure')
            modelManager.getByISBN(validISBN13).then((retVal) ->
                expect(retVal).toBe book
            , failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()

        it 'should resolve to error.NOT_FOUND if nothing found', (done) ->
            baseModelMock.expectGet 'books', []
            validISBN13 = '9780385537858'
            failure = jasmine.createSpy('search by uri not found promise failure')
            modelManager.getByISBN(validISBN13).then failure , (retVal) ->
                expect(retVal).toBe errors.NOT_FOUND
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                done()



    describe 'fullTextQuery', () ->

        it 'should return a promise', () ->
            baseModelMock.expectGet 'books', []
            expect(modelManager.fullTextQuery('a query')).toBeAPromise()

    describe 'createBook', () ->
        it 'should reject the promise if passed book in not ok', (done) ->
            success = jasmine.createSpy 'create success'
            failure = jasmine.createSpy 'create failure'
            retval = {}
            modelManager.createBook({}).then(success, failure)
            .finally () ->
                expect(failure).toHaveBeenCalledWith errors.BAD_PARAMETER
                expect(success).not.toHaveBeenCalled()
                done()

        it 'should create a book if not present in the db', (done) ->
            success = jasmine.createSpy 'create success'
            failure = jasmine.createSpy 'create failure'
            retval = {}
            book = 
                isbn: '9780385537858'
                title: "a title"
                refs: []
            baseModelMock.expectGet 'books', []
            baseModelMock.expectInsert 'books', retval
            modelManager.createBook(book).then(success, failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                expect(success).toHaveBeenCalledWith(retval)
                done()

        it 'should retrieve the old book if already present in the db', (done) ->
            success = jasmine.createSpy 'create success'
            failure = jasmine.createSpy 'create failure'
            retval = {}
            book = 
                isbn: '9780385537858'
                title: "a title"
                refs: []
            baseModelMock.expectGet 'books', [retval]
            modelManager.createBook(book).then(success, failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                expect(success).toHaveBeenCalledWith(retval)
                done()

    describe 'addPrices', () ->
        it 'should return a promise', () ->
            baseModelMock.expectGet 'books', []
            expect(modelManager.addPrices()).toBeAPromise()

        it 'should resolve to the book from the db', (done) ->
            success = jasmine.createSpy 'create success'
            failure = jasmine.createSpy 'create failure'
            retval = {}
            baseModelMock.expectModify 'books', 1
            baseModelMock.expectGet 'books', [retval]
            
            modelManager.addPrices('9780385537858', [{},{}]).then(success, failure)
            .finally () ->
                expect(failure).not.toHaveBeenCalled()
                expect(success).toHaveBeenCalledWith(retval)
                done()

        it 'should reject to NOT_FOUND if the book is not in the db', (done) ->
            success = jasmine.createSpy 'create success'
            failure = jasmine.createSpy 'create failure'
            retval = {}
            baseModelMock.expectModify 'books', 0
            modelManager.addPrices('9780385537858', [{},{}]).then(success, failure)
            .finally () ->
                expect(success).not.toHaveBeenCalled()
                expect(failure).toHaveBeenCalledWith(errors.NOT_FOUND)
                done()









