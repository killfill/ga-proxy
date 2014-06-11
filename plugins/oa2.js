var OAuth2 = require('oauth').OAuth2,
	config = require('./config')

var oa2 = new OAuth2(
	config['google_clientid'],
	config['google_password'],
	"",
	"https://accounts.google.com/o/oauth2/auth", 
	"https://accounts.google.com/o/oauth2/token"
)

module.exports = oa2
