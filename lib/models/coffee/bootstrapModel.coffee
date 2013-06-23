di = require 'di'
m = new di.Module
m.factory 'app', require './rest'
m.factory 'modelManager', require './modelManager'
m.factory 'books', require './books'
m.factory 'db', require './db'
m.factory 'baseModel', require './baseModel'
m.value 'errors', require './errors'
m.value 'config', require './config'

injector = new di.Injector [m]
app = injector.get 'app'
config = injector.get 'config'


app.listen config.restPort, config.restHost, (err) ->
    if err
        console.error "Error while starting REST server :#{err}"
        return
    console.log "Model REST server started."
    console.log "Listening on port #{config.restPort}"
