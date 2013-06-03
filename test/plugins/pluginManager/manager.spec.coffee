itunesBook = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11'
amazonBookMock = 'https://amazon/id431617573'
googleBooksMock = 'https://google/id431617573'
Q = require 'q'
di = require 'di'
amazonBook = 'https://amazon'



config1 = 
    "amazon": 
        "path": "./plugins/amazon/amazon.js"
    "googleBooks": 
        "path": "./plugins/googleBooks/googleBooks.js"
    "itunes": 
        "path": "./plugins/itunes/itunes.js"
    "ebay": 
        "path": "./plugins/ebay/ebay.js"

config2 = 
    "mockAmazon": 
        "path": "../../test/plugins/mocks/mockAmazon.js"
    "mockItunes": 
        "path": "../../test/plugins/mocks/mockItunes.js"
    "mockGoogle": 
        "path": "../../test/plugins/mocks/mockGoogle.js"
    

m = new di.Module()
m.value 'pluginsConfiguration' , config2
m.factory 'manager' , require '../../../lib/pluginManager/manager.js'

injector = new di.Injector([m])
manager = injector.get 'manager'

describe 'manager', ()->
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


    it 'should be defined', () ->
        expect(manager).toBeDefined()

    describe 'returnItems', () ->
        it 'should be a function', ()->
            expect(typeof manager.getItems).toBe('function')
        it 'the return value of returnItems should be a promise', ()->
            expect(Q.isPromise(manager.getItems(itunesBook))).toBe(true)
        it 'should be an array', (done) ->
            manager.getItems(itunesBook).then (data) ->
                expect(data).toBeAnArray
                done()
            .fail ()->
                expect(1).not.toBe(1)
                done()

        it 'given n plugin, all except one with the book A, should return n-1 items with the same isbn', (done)->
            manager.getItems(amazonBookMock).then (data) ->
                equal = true
                i = 0

                while i < data.length - 1
                    # console.log data[i].isbn
                    equal = false  if data[i].isbn isnt data[i + 1].isbn
                    i++
                expect(data.length).toBe 2
                expect(equal).toBe true
                done()

            .fail ()->
                expect(1).not.toBe(1)
                done()
        it 'given n plugin, all with the book A, should return n items with the same isbn', (done)->
            manager.getItems(itunesBook).then (data) ->
                equal = true
                i = 0
                console.log(data);

                while i < data.length - 1
                    equal = false  if data[i].isbn isnt data[i + 1].isbn
                    i++
                expect(data.length).toBe 3
                expect(equal).toBe true
                done()

            .fail ()->
                expect(1).not.toBe(1)
                done()
        it 'given n plugin, just one with book A, should return 1 item', (done)->
            manager.getItems(googleBooksMock).then (data) ->
                expect(data.length).toBe 1
                done()

            .fail ()->
                expect(1).not.toBe(1)
                done()
        it 'should fail if a bad uri is given (with a right prefix)', (done)->
            manager.getItems('https://itunes.apple.com').then (data) ->
                expect(1).not.toBe(1);
                done()
            .fail ()->
                expect(1).toBe(1)
                done()
        it 'should fail if a bad uri is given (with a unknown prefix)', (done)->
            manager.getItems('foobar').then (data) ->
                expect(1).not.toBe(1);
                done()
            .fail ()->
                expect(1).toBe(1)
                done()


