angular
	.module("userManagement", [
		"userManagement.services",
		"userManagement.controllers",
		"userManagement.directives",
		"userManagement.filters",
		"ngRoute",
		'ui.bootstrap'
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
			.when("/login", {
				templateUrl: "login.html",
				controller: "authController",
			})
			.when("/register", {
				templateUrl: "register.html",
				controller: "authController",
			})
			.otherwise({
				redirectTo: "/",
			});
	})
