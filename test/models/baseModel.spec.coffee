config = 
    dbName: 'book-sniper-test'
    dbHost: '127.0.0.1'
    dbPort: 27017
db = require '../../lib/models/db'


makeBaseModel = require '../../lib/models/baseModel' 
Q = require 'q'
baseModel = null
fix = null
describe 'baseModel', () ->
    beforeEach (done) -> 
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

        db(config).getConnection().then (dbI) ->
            dbInstance = dbI
            # console.log dbInstance
            fixtures = require 'mongodb-fixtures'
            fix = fixtures.load(__dirname + '/fixtures/');
            # console.log fix
            fixtures.save fix, dbInstance, () ->
                baseModel = makeBaseModel db(config)
                done()

        # .fail (err) -> console.log 'errore:', err.stack; 
    
    it 'should be defined', () ->
        expect(baseModel).toBeDefined()
    
    it 'should expose a _getById method', () ->
        expect(baseModel._getById).toBeDefined()
        expect(typeof baseModel._getById).toBe 'function'

    it 'should expose a _getAll method', () ->
        expect(baseModel._getAll).toBeDefined()
        expect(typeof baseModel._getAll).toBe 'function'
     it 'should expose a _insert method', () ->
        expect(baseModel._insert).toBeDefined()
        expect(typeof baseModel._insert).toBe 'function'    
    describe '_getById', () ->
        it 'should fetch elements by id', (done) ->
            baseModel._getById( 'useless', fix.useless[0]._id.toString()).then (elem) ->
                expect(elem.name).toBe(fix.useless[0].name)
                done()
        
        it 'should reject the promise if the id is bad', (done) ->
            baseModel._getById( 'useless', 'A BAD ID').then (elem) ->
                expect(false).toBe(true)
                done()
            , (err) ->
                expect(true).toBe true
                done()

        it 'should reject the promise if the id is valid but non existant', (done) ->
            baseModel._getById( 'useless', '50a780fb48ffd9ed25000000').then (elem) ->
                expect(false).toBe(true)
                done()
            , (err) ->
                expect(true).toBe true
                done()



    describe '_getAll', () ->
        
        it 'should return a promise', () ->
            expect(baseModel._getAll 'useless').toBeAPromise()

        it 'should fetch everything', (done) ->
            baseModel._getAll('useless').then (data) ->
                expect(data).toBeAnArray()
                expect(data.length).toBe(fix.useless.length)
                expect(data[0].name).toBe(fix.useless[0].name)
                done()
            , (err) ->
                expect(false).toBe(true)
                done()
                 
        it 'should notify each object', (done) ->
            promise = baseModel._getAll('useless')
            count = 0
            promise.progress () ->
                count++
            promise.then (data) ->
                expect(count).toBe(data.length)
                done()

    describe '_insert', () ->

        it 'should return a promise', () ->
            expect(baseModel._insert()).toBeAPromise()

        it 'should add a single passed item', (done) ->
            x = 
                name: 'a new item'
                value: 'a new value'
            baseModel._insert('useless', x).then () ->
                baseModel._getAll('useless')
            .then (elements) ->
                l = elements.length
                expect(elements[l-1].name).toBe x.name
                expect(elements[l-1].value).toBe x.value
                done()
            .fail (err) ->
                expect(false).toBe(true)
                console.error(err)
                done()
        
        it 'should call beforeInsert on each element', (done)->
            x = 
                name: 'an  item'
                value: 'a new value'
            
            
            spyOn( baseModel,'beforeInsert').andCallThrough()

            baseModel._insert('useless', x).then () ->
                expect(baseModel.beforeInsert).toHaveBeenCalled()
                done()
            .fail (err) ->
                console.error('exceptions:', err)
                expect(false).toBe(true)
                done()
                return 


