var fs = require('fs'),
	c = fs.readFileSync('./config/' + (process.env.NODE_ENV || 'development') + '.json', 'utf-8')

module.exports = JSON.parse(c)
