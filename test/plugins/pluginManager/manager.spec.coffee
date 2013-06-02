manager = require '../../../lib/pluginManager/manager.js'
itunesBook = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11'
Q = require('q')

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
        it 'should pass to the promise books with the same isbn', ()->
            manager.getItems(itunesBook).then (data) ->
                equal = true
                i = 0

                while i < data.length - 1
                  equal = false  if data[i].isbn isnt data[i + 1].isbn
                  i++
                expect(equal).toBe true

            .fail ()->
                expect(1).not.toBe(1)
                done()