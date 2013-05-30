dummy = require '../../lib/models/dummy.js'
describe 'dummy', () ->
    it 'should be an object', () ->
        expect(typeof dummy).toBe 'object'

    it 'should expose 2 attributes', () ->
        expect(dummy.val).toBeDefined()
        expect(dummy.str).toBeDefined()

