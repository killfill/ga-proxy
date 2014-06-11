var fs = require('fs'),
	path = '/tmp/memory.json',
	data = {}

try {
	var stat = fs.statSync(path)
	if (stat.isFile) {
		var txt = fs.readFileSync(path, 'UTF-8')
		data = JSON.parse(txt)
	}
}
catch (e) {}

module.exports = {
	get: function(key) {
		if (key) return data[key]
		return data
	},
	set: function(key, value) {
		data[key] = value
		fs.writeFileSync(path, JSON.stringify(data), 'UTF-8');
		return value
	}
}
