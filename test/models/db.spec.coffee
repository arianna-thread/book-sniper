db = require '../../lib/models/db'
Q = require 'q'
Db = require('mongodb').Db
config = 
    dbName: 'book-sniper-test'
    dbHost: '127.0.0.1'
    dbPort: 27017
describe 'db', () ->
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

        # fixtures = require 'mongodb-fixtures'
        # fix = fixtures.load(__dirname + '/fixtures/');
        # fixtures.save fix, db, () ->
        #     db.close();
        #     done();
        

            
    it 'should be a function', () ->
        expect(db).toBeDefined()
        expect(typeof db).toBe 'function'
    it 'should expose a getConnection method', () ->
        expect(db(config).getConnection).toBeDefined()
        expect(typeof db(config).getConnection).toBe 'function'

    conn = undefined
    
    describe 'getConnection', () ->
        beforeEach () ->
            conn = db(config).getConnection()
        it 'should return a promise', () ->
            expect(conn).toBeAPromise()
        it 'should be resolved with a Db instance', (done) ->
            conn.then (dbInstance) ->
                expect(dbInstance instanceof Db)
                done()
            , (err) ->
                expect(1).toBe 0
                done()
        it 'should be resolved with the same instance', (done) ->
            conn.then (dbInstance) ->
                db(config).getConnection().then (dbInstance2) ->
                    expect(dbInstance2).toBe dbInstance
                    done()
            , (err) ->
                expect(1).toBe 0
                done()
                 
