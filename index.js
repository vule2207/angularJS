var userManagement = angular.module("userManagement", []);
userManagement.controller("userController", function ($scope, $http) {
	let limit = 10;
	$scope.isAdd = true;
	$scope.formData = {};
	$scope.curPage = 1;

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
		$scope.getUsers(limit, skip);
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
	$scope.getUsers = function (limit = 10, skip = 0) {
		const config = {
			method: "GET",
			url: "https://dummyjson.com/users",
			params: {
				limit: limit,
				skip: skip,
			},
		};
		$http(config) //${limit !== 0 ? `?limit=${limit}` : ""}
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

	$scope.handleSubmit = function (form) {
		// console.log("form:", form);
		$scope.userData = angular.copy($scope.formData);
		if ($scope.isAdd) {
			$http
				.post(`https://dummyjson.com/users/add`, $scope.userData)
				.then((res) => {
					$scope.formData = {};
					alert("Add User Successfull!");
				})
				.catch((err) => alert("Add User Failed!"));
		} else {
			$http
				.put(`https://dummyjson.com/users/${$scope.userData.id}`, $scope.userData)
				.then((res) => {
					$scope.formData = {};
					$scope.isAdd = true;
					alert("Update User Successfull!");
				})
				.catch((err) => alert("Update User Failed!"));
		}
	};

	$scope.deleteUser = function (id) {
		$http
			.delete(`https://dummyjson.com/users/${id}`)
			.then((res) => alert("Delete User Successfull!"))
			.catch((err) => alert("Delete User Failed!"));
	};

	$scope.resetForm = function () {
		console.log("userForm: ", $scope.userForm);
		$scope.formData = {};
		$scope.isAdd = true;
	};

	$scope.getUsers();
});
