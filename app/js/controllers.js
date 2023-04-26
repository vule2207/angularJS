angular
	.module("userManagement.controllers", [])
	.controller("userController", ["$scope", "userServices", userController])
	.controller("tabController", ["$scope", "$location", "$route", tabController]);

function userController($scope, userServices) {
	let limit = 10;
	$scope.isAdd = true;
	$scope.formData = {};
	$scope.curPage = 1;
	$scope.sortBy = "name-asc";

	$scope.handleChangeSort = function () {
		console.log("sortBy: ", $scope.sortBy);
	};

	// pagination
	$scope.handlePageChange = function (page) {
		if (page <= 0) {
			$scope.curPage = 1;
			return;
		}
		if (page > $scope.totalPages) {
			$scope.curPage = $scope.totalPages;
			return;
		}
		$scope.curPage = page;
		const skip = ($scope.curPage - 1) * limit;
		$scope.getUserList(limit, skip);
	};

	$scope.isActivePage = function (page) {
		return page === $scope.curPage;
	};

	// handle CRUD
	$scope.handleEditUser = function (user) {
		$scope.isAdd = false;
		$scope.formData.id = user.id;
		$scope.formData.firstName = user.firstName;
		$scope.formData.lastName = user.lastName;
		$scope.formData.gender = user.gender;
		$scope.formData.email = user.email;
		$scope.formData.phone = user.phone;
		$scope.formData.age = user.age;
	};

	// CRUD users data
	$scope.getUserList = function (limit = 10, skip = 0) {
		return userServices
			.getUsers(limit, skip)
			.then(function (response) {
				$scope.users = response.data.users;
				$scope.total = response.data.total;
				$scope.totalPages = Math.ceil($scope.total / limit);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.getUserDetails = function (id) {
		return userServices
			.getUserDetails()
			.then(function (response) {
				$scope.userDetails = response.data;
				$scope.showModal = true;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.handleSubmit = function (form) {
		$scope.userData = angular.copy($scope.formData);
		if ($scope.isAdd) {
			userServices
				.addUser($scope.userData)
				.then((res) => {
					$scope.formData = {};
					alert("Add User Successfull!");
				})
				.catch((err) => alert("Add User Failed!"));
		} else {
			userServices
				.updateUser($scope.userData.id, $scope.userData)
				.then((res) => {
					$scope.formData = {};
					$scope.isAdd = true;
					alert("Update User Successfull!");
				})
				.catch((err) => alert("Update User Failed!"));
		}
	};

	$scope.deleteUser = function (id) {
		userServices
			.deleteUser(id)
			.then((res) => alert("Delete User Successfull!"))
			.catch((err) => alert("Delete User Failed!"));
	};

	$scope.resetForm = function () {
		console.log("userForm: ", $scope.userForm);
		$scope.formData = {};
		$scope.isAdd = true;
	};

	$scope.getUserList();
}

function tabController($scope, $location) {
	$scope.routes = [
		{ path: "/users", label: "Users" },
		{ path: "/products", label: "Products" },
	];
	$scope.isActive = function (route) {
		return route.path === $location.path();
	};
	$scope.setActive = function (route) {
		$location.path(route.path);
	};
}
