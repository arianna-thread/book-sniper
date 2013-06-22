# gb = require '../../../lib/pluginManager/plugins/googleBooks/googleBooks.js'
# Q = require 'q'
# pluginError = '../../errors/pluginError'
# isbn = '9782709638821'
# uri = 'http://books.google.fr/books?id=swsZuHxsJDwC&printsec=frontcover&dq=isbn:9782709638821&hl=&cd=1&source=gbs_api'
# uri1 = 'http://books.google.fr/books/about/Steve_Jobs.html?hl=&id=swsZuHxsJDwC'

# describe 'googleBooks', ()->

#     it 'should be defined', () ->
#         expect(gb).toBeDefined()

#     describe 'getByUri',() ->
#         it 'should return a promise with diffent uris', (done) ->
#             expect(Q.isPromise(gb.getByURI(uri))).toBe(true)
#             expect(Q.isPromise(gb.getByURI(uri1))).toBe(true)
#             done()
#         it 'should retrieve the right book', (done) ->
#             gb.getByURI(uri).then (dataURI) ->
#                 gb.getByISBN(dataURI.isbn).then (dataISBN) ->
                 
#                     expect(dataURI).toEqual(dataISBN)
#                     done()
#                 .fail (err) ->
#                     console.log 'GoogleBooks Api error: ' , JSON.stringify err 
#                     expect(1).toBe(2)
#                     done()
#             .fail (err) ->
#                 console.log 'GoogleBooks Api error: ' , JSON.stringify err 
#                 expect(1).toBe(2)
#                 done()
#         it 'should return invalidURI if invalid uri is given', (done) ->
#             gb.getByURI('foobar').then (data) ->
#                 expect(1).not.toBe(1)
#                 done() 
#             .fail (data) ->
#                 expect(data.code).toBe(1)
#                 done()


#     describe 'GetByISBN',() ->
#         it 'should return a promise', (done) ->
#             expect(Q.isPromise(gb.getByISBN(isbn))).toBe(true)
#             done()
#         it 'should retrieve the right book', (done) ->
#             gb.getByISBN(isbn).then (dataISBN) ->
#                 gb.getByURI(dataISBN.uri).then (dataURI) ->
#                     # dataURI.key.forEach (e)->
#                     #     expect(dataURI[e]).toBe(dataISBN[e])
#                     expect(dataURI).toEqual(dataISBN)
#                     # expect(1).toBe(2)
#                     done()
#                 .fail (err) ->
#                     console.log 'GoogleBooks Api error: ' , JSON.stringify err  
#                     expect(1).toBe(2)
#                     done()
#             .fail (err) ->
#                 console.log 'GoogleBooks Api error: ' , JSON.stringify err  
#                 expect(1).toBe(2)
#                 done()
#         it 'should return invalidISBN if invalid isbn is given', (done) ->
#             gb.getByISBN('foobar').then (data) ->
#                 expect(1).not.toBe(1)
#                 done()
#             .fail (data) ->
#                 expect(data.code).toBe(0)
#                 done()    

#     describe 'raiseHand', () ->
#         it 'should raise his hand if it is called', () ->
#             cb = jasmine.createSpy('this is the callback of raiseHand')
#             cb.andCallFake (boolean,data)->
#             gb.raiseHand(uri,cb)
#             expect(cb).toHaveBeenCalledWith(true,'googleBooks')

#         it 'should not raise his hand if it isn t called', () ->
#             cb = jasmine.createSpy('this is the callback of raiseHand')
#             cb.andCallFake (boolean,data)->
#             gb.raiseHand('foobar',cb)
#             expect(cb).toHaveBeenCalledWith(false)
