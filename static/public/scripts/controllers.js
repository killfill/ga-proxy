app.controller('HeaderCtrl', function($scope, $resource, $rootScope, $http) {
	$scope.items = [{
		name: 'Accounts',
		href: 'ga_accounts'
	},{
		name: 'Test',
		href: 'test'
	}]

	$rootScope.$watch(
  		function() {return $http.pendingRequests.length},
  		function() {
  			$scope.loading = $http.pendingRequests.length
  	})
})

app.controller('MainCtrl', function($scope, $resource) {

	//Any call to check if we have the tokens :P
	$resource('/google/err').get().$promise['catch'](function(res) {
		if (res.status === 406)
			return window.location = res.headers('Location')
		console.error(res.data || res)
	})


})

app.controller('GA_Account_Ctrl', function($scope, $resource) {
	$scope.res = $resource('/google/management/accountSummaries').get()

	$scope.res.$promise['catch'](function(res) {
		if (res.status === 406)
			return window.location = res.headers('Location')
		console.error(res.data || res)
	})
})

app.controller('PruebaCtrl', function($scope, $resource) {
	// $scope.res = $resource('/google/data/ga').get({ids: 'ga:471079', 'start-date': '2014-02-01', 'end-date': '2014-03-01', metrics: 'ga:visitors, ga:visits, ga:newVisits, ga:socialActivities, ga:pageviews, ga:pageviewsPerVisit, ga:avgTimeOnPage, ga:socialInteractions, ga:adsenseCTR'})
	// $scope.res = $resource('/google/data/ga').get({ids: 'ga:10490318', 'start-date': '2014-02-01', 'end-date': '2014-02-04', dimensions: 'ga:date', metrics: 'ga:pageviews, ga:visitors, ga:visits, ga:newVisits, ga:socialActivities, ga:pageviewsPerVisit, ga:avgTimeOnPage, ga:adsenseCTR'})
	// $scope.res = $resource('/google/data/ga').get({ids: 'ga:10490318', 'start-date': '2014-03-31', 'end-date': '2014-04-02', dimensions: 'ga:pagePath', metrics: 'ga:pageviews,ga:visits'})
	// $scope.res = $resource('/google/data/ga').get({ids: 'ga:10490318', 'start-date': '2014-03-31', 'end-date': '2014-04-02', dimensions: 'ga:keyword', metrics: 'ga:pageviews,ga:visits'})
	// $scope.res = $resource('/google/data/ga').get({
	// 	ids: 'ga:10490318', 
	// 	'start-date': '2014-03-02',
	// 	// 'start-date': '2005-01-01',
	// 	'end-date': '2014-04-02',
	// 	// metrics: 'ga:pageviews,ga:visits',
	// 	metrics: 'ga:pageviews',
	// 	dimensions: 'ga:pagePath',
	// 	sort: '-ga:pageviews',
	// 	'max-results': 10000,
	// 	// 'start-index': 10001
	// 	// filters: 'ga:pagePath==/leoprieto/eldinamocl/link/sismo-de-83-grados-cerca-de-iquique-en-el-norte-de-chile-genera-alerta-de-tsuna/'
	// })
})

app.controller('TestCtrl', function($scope, $resource) {

	$scope.go = function(page) {
		$scope.error = undefined

		var h = {
			ids: $scope.selectedProfile.id,
			metrics: $scope.selectedMetrics.map(function(m) {return m.id}).join(','),
			dimensions: $scope.selectedDimensions.map(function(d) {return d.id}).join(','),
			'start-date': $scope.startDate,
			'end-date': $scope.endDate
		}

		if ($scope.sort)
			h['sort'] = $scope.sort

		if ($scope.startFrom)
			h['start-index'] = $scope.startFrom

		if ($scope.maxResults)
			h['max-results'] = $scope.maxResults

		if ($scope.filters)
			h.filters = $scope.filters

		console.log('HASH:', h)
		$scope.res = $resource('/google/data/ga').get(h)

		//Helpers..
		$scope.res.$promise.then(function(res) {
			$scope.totalPages = Math.ceil(res.totalResults / res.query['max-results'])
		})

		$scope.res.$promise['catch'](function(err) {
			$scope.error = err
		})
	}

	//Build the metrics and dimensions array.
	$resource('https://www.googleapis.com/analytics/v3/metadata/ga/columns?pp=1').get().$promise
		.then(function(res) {
			$scope.metrics = res.items.map(function(item) {
				if (item.attributes.status === 'PUBLIC' && item.attributes.type === 'METRIC') return item
			}).filter(function(i) {return i})

			$scope.dimensions = res.items.map(function(item) {
				if (item.attributes.status === 'PUBLIC' && item.attributes.type === 'DIMENSION') return item
			}).filter(function(i) {return i})
		})

	//Build the $scope.profiles object with list of available profiles
	$resource('/google/management/accountSummaries').get().$promise.then(function(res) {
		var _profiles = []
		res.items.forEach(function(account) {

			account.webProperties.forEach(function(webProperty) {
				
				//Some properis may not have profiles setted up. Ignore them
				if (!webProperty.profiles) return

				webProperty.profiles.forEach(function(profile) {
					_profiles.push({account: account.name, propName: webProperty.name, propId: webProperty.id, name: profile.name, id: 'ga:'+profile.id})
				})
			})
		})
		$scope.profiles = _profiles
	})

	$scope.startDate = '7daysAgo'
	$scope.endDate = 'today'

	/* Metrics and dimensions ui helpers */
	$scope.selectedMetrics = []
	$scope.deleteMetric = function(idx) {
		$scope.selectedMetrics.splice(idx, 1)
	}
	$scope.$watch('selectedMetric', function(val) {
		if (!val) return

		$scope.selectedMetrics.push(val)
	})
	$scope.selectedDimensions = []
	$scope.deleteDimension = function(idx) {
		$scope.selectedDimensions.splice(idx, 1)
	}
	$scope.$watch('selectedDimension', function(val) {
		if (!val) return

		$scope.selectedDimensions.push(val)
	})

})

