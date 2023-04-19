var userManagement = angular.module("userManagement", []);
userManagement.controller("userController", function ($scope, $http) {
	let limit = 10;
	// handle CRUD
	$scope.isAdd = true;
	$scope.handleEditUser = function (user) {
		$scope.isAdd = false;
		$scope.firstName = user.firstName;
		$scope.lastName = user.lastName;
		$scope.gender = user.gender;
		$scope.email = user.email;
		$scope.phone = user.phone;
		$scope.age = user.age;
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

	$scope.handleSubmit = function () {
		alert("hello world");
	};
	$scope.deleteUser = function (id) {
		$http
			.delete(`https://dummyjson.com/users/${id}`)
			.then((res) => alert("Delete User Successfull!"))
			.catch((err) => alert("Delete User Failed!"));
	};

	$scope.getUsers();
});
