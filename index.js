var server = require('./app'),
	config = require('./plugins/config')

require('./plugins/google')(server)

server.listen(config['port'], function() {
	server.log.warn('%s listening at %s', server.name, server.url)
})
