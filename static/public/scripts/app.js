
app = angular.module('app', ['ngRoute', 'ngResource'])

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		})
		.when('/ga_accounts', {
			templateUrl: 'views/ga_accounts.html',
			controller: 'GA_Account_Ctrl'
		})
		.when('/prueba', {
			templateUrl: 'views/prueba.html',
			controller: 'PruebaCtrl'
		})		
		.when('/test', {
			templateUrl: 'views/test.html',
			controller: 'TestCtrl'
		})
})