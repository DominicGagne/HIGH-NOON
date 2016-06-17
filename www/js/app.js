var Boilerplate = angular.module('Boilerplate', ['ngRoute', , 'ngMaterial', 'Boilerplate.controllers'])

.run(function(){
	console.log("I'M ON FIRE!");
})

.config(function($routeProvider, $locationProvider) {
	$routeProvider

	.when('/noon', {
		templateUrl: "www/templates/noon.html",
		controller: "NoonCtrl"
		
	})
	.otherwise({
		redirectTo: '/noon'
	});

	$locationProvider.html5Mode(false);
});
