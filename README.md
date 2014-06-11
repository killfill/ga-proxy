Google Analitics Proxy
=========

[ga-proxy] a little (but handy!) service, that abstract the google api oauth autentication so other tools can use the [google analitics api] directly, without worring about that stuff.

Instalation
--

```
git clone https://github.com/killfill/ga-proxy.git
cd ga-proxy
npm install
cd static/public
bower install
```

Configuration
--

[Create an app] in your google account, like this:

![Google account screenshot][google_api_credentials]



You will need the app credentials. In the config directory, create a file (or just use the development one) like this:
```
{
	"port": 5005,
	"google_cb": "http://localhost:5005/auth/google/return",
	"google_clientid": "194565570790-bfqh7u9npef5u4nj6tfeji13f9is85m3.apps.googleusercontent.com",
	"google_password": "0HgceDBUgb3zwT_WmrbMF1dF"
}
```


With this information in place, when you start the service and load the url in the browser, it will redirect to google autentication, to gain offline access to query google analitics.

This process will ask for readonly permision and save the access token for future reference. The token is valid just for 1 hour, when this happends, the refresh token will be used to get a new token automatically, so you just need to give permission ones.

This information will be saved in a file in /tmp/memory.json. 

**WARN**: Do not make that file public!

Usage
--

Start the service with :
``` ENV=conf_file_name node index.js ``` (if not ENV specified, development will be used).

Load the url in your browser. As no previous permission was granted, it will ask you to:
![Ask permission][ask_permission]

After that, the browser will show a small, simple and ugly test web console.

The *Accounts* section, will show you the account name, property, and the first 2 profiles of your account. The profile id, in bold, is the one you need to query the [google analitics api].
![Accounts][accounts]

The *Test* section, will let you do some basic queries to the [google analitics api].
![Test Web Console][test_console]

**Curl example:**
```
$ curl 'http://localhost:5005/google/data/ga?dimensions=ga:date&metrics=ga:pageviews&start-date=yesterday&end-date=today&ids=ga:471079'|json

{
  "kind": "analytics#gaData",
  "id": "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:471079&dimensions=ga:date&metrics=ga:pageviews&start-date=yesterday&end-date=today",
  "query": {
    "start-date": "yesterday",
    "end-date": "today",
    "ids": "ga:471079",
    "dimensions": "ga:date",
    "metrics": [
      "ga:pageviews"
    ],
    "start-index": 1,
    "max-results": 1000
  },
  "itemsPerPage": 1000,
  "totalResults": 2,
  "selfLink": "https://www.googleapis.com/analytics/v3/data/ga?ids=ga:471079&dimensions=ga:date&metrics=ga:pageviews&start-date=yesterday&end-date=today",
  "profileInfo": {
    "profileId": "471079",
    "accountId": "305150",
    "webPropertyId": "UA-305150-1",
    "internalWebPropertyId": "500602",
    "profileName": "www.fayerwayer.com",
    "tableId": "ga:471079"
  },
  "containsSampledData": false,
  "columnHeaders": [
    {
      "name": "ga:date",
      "columnType": "DIMENSION",
      "dataType": "STRING"
    },
    {
      "name": "ga:pageviews",
      "columnType": "METRIC",
      "dataType": "INTEGER"
    }
  ],
  "totalsForAllResults": {
    "ga:pageviews": "159371"
  },
  "rows": [
    [
      "20140610",
      "113419"
    ],
    [
      "20140611",
      "45952"
    ]
  ]
}
```


Feedback
==
Feel free to give any feedback!
[My twitter]


[ga proxy]:http://killfill.github.io/ga-proxy/
[create an app]:https://console.developers.google.com/project/194565570790/apiui/credential?authuser=0
[google analitics api]:https://developers.google.com/analytics/devguides/reporting/core/v3/reference?hl=es#filters
[My twitter]: https://twitter.com/killfil

[google_api_credentials]: https://raw.github.com/killfill/ga-proxy/master/images/google_api_credentials.png
[ask_permission]: https://raw.github.com/killfill/ga-proxy/master/images/ask_permission.png
[accounts]: https://raw.github.com/killfill/ga-proxy/master/images/accounts.png
[test_console]: https://raw.github.com/killfill/ga-proxy/master/images/test_console.png
