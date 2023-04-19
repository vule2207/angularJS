var userManagement = angular.module("userManagement", []);
userManagement.controller("userController", function ($scope, $http) {
	let limit = 10;

	console.log("image: ", $scope.image);
	console.log("name: ", $scope.firstName);
	console.log("image: ", $scope.showModal);

	// handle action modal
	$scope.showModal = false;
	$scope.closeModal = function () {
		$scope.showModal = false;
	};

	// CRUD users data
	$scope.getUsers = function () {
		$http
			.get(`https://dummyjson.com/users${limit !== 0 ? `?limit=${limit}` : ""}`)
			.then(function (response) {
				$scope.users = response.data.users;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.getUserDetails = function (id) {
		$http
			.get(`https://dummyjson.com/users/${id}`)
			.then(function (response) {
				$scope.userDetails = response.data;
				$scope.showModal = true;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.getUsers();
});
