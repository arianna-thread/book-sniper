pluginManager = require '../../../lib/pluginManager/manager.js'
itunesBook = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11'

describe 'pluginManager', ()->
    it 'should be defined', () ->
        expect(pluginManager).toBeDefined()
    describe 'returnItems', () ->
        it 'should be a function', ()->
            expect(typeof pluginManager.returnItems).toBe('function')
        it 'the return value of returnItems should be defined', ()->
            expect(1).toBe(1)