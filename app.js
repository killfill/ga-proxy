var restify = require('restify'),
	bunyan = require('bunyan'),
	server = restify.createServer({
		name: 'oauth-proxy'
	}),
	memory = require('./plugins/memory')

server.pre(restify.pre.userAgentConnection());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());
server.use(restify.gzipResponse());
server.use(restify.conditionalRequest());
server.use(restify.queryParser());
server.use(restify.requestLogger())

server.get(/\/public\/?.*/, restify.serveStatic({
	directory: './static',
	default: 'index.html'
}))

server.get('/', function(req, res, next) {
	res.header('Location', '/public/')
	res.send(301)
	next()
})

module.exports = server