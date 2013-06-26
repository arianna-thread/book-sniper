# itunesBook = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11'
# amazonBookMock = 'https://amazon/id431617573'
# googleBooksMock = 'https://google/id431617573'
# config = __dirname + '/../../../lib/pluginManager/pluginConfig.json';

# Q = require 'q'
# di = require 'di'
# fs = require('fs')
# amazonBook = 'https://amazon'
# isbnArray = ['9782709638821','9782709638822', '9782709638823']
# realIsbnArray = ['9781451648539','9782709638821','9780316069359']

# config1 = 
#     "amazon": 
#         "path": "./plugins/amazon/amazon.js"
#     "googleBooks": 
#         "path": "./plugins/googleBooks/googleBooks.js"
#     "itunes": 
#         "path": "./plugins/itunes/itunes.js"

# config2 = 
#     "mockAmazon": 
#         "path": "../../test/plugins/mocks/mockAmazon.js"
#     "mockItunes": 
#         "path": "../../test/plugins/mocks/mockItunes.js"
#     "mockGoogle": 
#         "path": "../../test/plugins/mocks/mockGoogle.js"
    





# m = new di.Module()
# m.value('pluginsConfiguration', config1);
# m.value('configurationPath', config);
# m.factory('manager', require('../../../lib/pluginManager/manager'));
# m.factory('managerServer', require('../../../lib/pluginManager/pluginManager.js'));

# injector = new di.Injector([m])
# managerServer = injector.get 'managerServer'

# describe 'Plugin Manager RESTfull Server', ()->
#     beforeEach () -> 
#         this.addMatchers
#             toBeAnArray: () ->
#                 actual = @actual;
#                 notText =  if @isNot then ' not' else ''

#                 @message = () -> 
#                     "Expected #{actual}#{notText} to be an Array"
                

#                 return Array.isArray(actual);
#             toBeAPromise: () ->
#                 actual = @actual
#                 notText = if @isNot then ' not' else ''

#                 @message = () ->
#                      "Expected #{actual}#{notText} to be a Q promise"

#                 Q.isPromise actual


#     it 'should be defined', () ->
#         expect(managerServer).toBeDefined()

#     it 'listen function should be defined', () ->
#         expect(managerServer.listen).toBeDefined()




#     