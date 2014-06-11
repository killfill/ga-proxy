var oa2 = require('./oa2'),
	config = require('./config'),
	memory = require('./memory'),
	memoryKey = 'google_access'


module.exports = function(server) {

	server.get('/auth/google', function(req, res) {

		var location = oa2.getAuthorizeUrl({
			response_type: 'code',
			redirect_uri: config['google_cb'],
			scope: 'https://www.googleapis.com/auth/analytics.readonly',
			state: req.query.state || '/',
			access_type: 'offline',
			approval_prompt: 'force'
		})

		res.header('Location', location)
		res.send(302)
	})

	server.get('/auth/google/return', function(req, res) {

		oa2.getOAuthAccessToken(req.query.code, {redirect_uri: config['google_cb'], grant_type: 'authorization_code'},
			function response(err, accessToken, refreshToken, data) {
				if (err) return res.send(err)

				var access = {
					access: accessToken,
					refresh: refreshToken,
					valid: data.expires_in,
					created_time: new Date().getTime()
				}

				memory.set(memoryKey, access)
				res.header('Location', '/')
				res.send(302)

			}
		)
	})

	var base = "https://www.googleapis.com/analytics/v3/"

	server.get(/^\/google\/(.*)/, setupToken, function(req, res, next) {
		var url = base + req.params[0] // + '/management/accountSummaries')

		var qs = req._url.query
		if (qs) url += '?' + qs

		req.log.warn({url: url}, 'Google request')

		oa2.get(url, req.token, function(err, data) {
			if (err) return res.send(err.statusCode || 500, JSON.parse(err.data) || err)
			res.json(JSON.parse(data))
			next()
		})
	
	})

}


function setupToken(req, res, next) {

		var access = memory.get(memoryKey)

		if (!access || !access.refresh) {
			req.log.warn('No token. Must autenticate -> /auth/google')
			res.header('Location', '/auth/google')
			return res.send(406, 'Must autenticate. See /auth/google')
		}

		var secondsLeft = (access.created_time + access.valid * 1000 - new Date().getTime())/1000

		function respond(err) {
			req.token = memory.get(memoryKey).access
			next()
		}

		//All right!
		if (secondsLeft > 5)
			return respond()
		
		req.log.warn('Refreshing token...', access.refresh)
		refreshToken(access.refresh, respond)
}


//Refresh the token
function refreshToken(token, cb) {
	oa2.getOAuthAccessToken(token, {grant_type: 'refresh_token'}, 
		function response(err, accessToken, refreshToken, data) {
			if (err) return cb(err)

			var access = memory.get(memoryKey)
			
			memory.set(memoryKey, {
				access: accessToken,
				refresh: access.refresh,
				valid: data.expires_in,
				created_time: new Date().getTime()
			})

			cb()
		}
	)
}