angular
	.module("userManagement", [
		"userManagement.services",
		"userManagement.controllers",
		"userManagement.directives",
		"userManagement.filters",
		"ngRoute",
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "home.html",
				controller: "tabController",
			})
			.when("/users", {
				templateUrl: "user.html",
				controller: "userController",
			})
			.when("/products", {
				templateUrl: "product.html",
			})
			.otherwise({
				redirectTo: "/",
			});
	});
