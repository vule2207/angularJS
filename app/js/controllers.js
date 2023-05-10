angular
	.module("userManagement.controllers", [])
	.controller("userController", ["$scope", "userServices", '$rootScope', userController])
	.controller("tabController", function ($scope, $location, userServices, $rootScope) {
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
		$scope.handleLogout = function () {
			userServices.logout($rootScope.user_info.session_id).then((res) => {
				if (res.data.success) {
					$location.path('/login');
					$rootScope.user_info = {};
				} else {
					alert(res.data.message)
				}
			})
		};
	})
	.controller('UploadController', function ($scope, $location, userServices) {
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
		$scope.handleLogout = function () {
			userServices.logout().then((res) => {
				if (res.data.success) {
					$location.path('/login');
				} else {
					alert(res.data.message)
				}
			})
		};
	})
	.controller('authController', function ($scope, $rootScope, $location, userServices) {
		$scope.formRegister = {};
		$scope.formLogin = {};

		$scope.handleRegister = function (form) {
			const data = angular.copy($scope.formRegister);
			if (data.password !== data.password) {
				alert("Repeat password wrong!");
				return
			}
			const fd = new FormData();
			for (let key in data) {
				fd.append(key, data[key]);
			}
			userServices.registerUser(fd).then((res) => {
				// $scope.user_token = res.data.access_token
				$location.path('/login')
			}).catch(err => {
				alert("Register user failed!");
			})
		}

		$scope.handleLogin = function (form) {
			const data = angular.copy($scope.formLogin);
			const fd = new FormData();
			for (let key in data) {
				fd.append(key, data[key]);
			}
			userServices.login(fd).then((res) => {
				if (res.data.success) {
					$rootScope.user_info = res.data.user_info
					alert(res.data.message)
					$location.path('/users')
				} else {
					alert(res.data.message)
				}
			}).catch(err => {
				alert("Login failed!");
			})
		}
	})
	.controller('modalController', function ($scope, $uibModal, $rootScope, userServices) {
		const headerAuth = {
			'Authorization': $rootScope?.user_info?.access_token ?? ''
		}
		var $ctrl = this;
		$ctrl.animationsEnabled = true;

		$scope.$on('showConfirmModal', function () {
			$ctrl.openConfirmModal($rootScope.user);
		});
		$ctrl.openConfirmModal = function (user, size, parentSelector) {
			var parentElem = parentSelector ?
				angular.element($document[0].querySelector('.modal-confirm ' + parentSelector)) : undefined;

			var modalInstance = $uibModal.open({
				animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'confirm-modal.html',
				controller: 'ConfirmModalCtrl',
				controllerAs: '$ctrl',
				size: size,
				appendTo: parentElem,
				resolve: {
					user: function () {
						return user;
					}
				}
			});

			modalInstance.result.then(function () {
				$ctrl.deleteItem(user);
			});
		};

		$ctrl.deleteItem = function (user) {
			console.log("delete user:", user)
			userServices
				.deleteUser(user.id, headerAuth)
				.then((res) => {
					alert("Delete User Successfull!")
					$scope.getUserList($scope.params, headerAuth);
				})
				.catch((err) => alert("Delete User Failed!"));
		};
	})
	.controller('ConfirmModalCtrl', function ($uibModalInstance, user) {
		var $ctrl = this;
		$ctrl.user = user;

		$ctrl.ok = function () {
			$uibModalInstance.close($ctrl.user);
		};

		$ctrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	})

function userController($scope, userServices, $rootScope) {
	const headerAuth = {
		'Authorization': $rootScope?.user_info?.access_token ?? ''
	}

	let limit = 10;
	$scope.isAdd = true;
	$scope.formData = {};
	$scope.pagination = {};
	$scope.orderBy = "name-asc";
	$scope.params = {
		keywork: $scope.searchName,
		limit,
		page: $scope.pagination.current_page ? $scope.pagination.current_page : 1,
		order_by: $scope.orderBy ? $scope.orderBy.split('-')[0] : 'name',
		sort_by: $scope.orderBy ? $scope.orderBy.split('-')[1] : 'asc',
	}

	// order by 
	$scope.handleChangeSort = function () {
		$scope.params = {
			...$scope.params,
			order_by: $scope.orderBy.split('-')[0],
			sort_by: $scope.orderBy.split('-')[1],
		}
		$scope.getUserList($scope.params, headerAuth);
	};

	// search
	$scope.handleSearchName = function () {
		$scope.params = {
			...$scope.params,
			keywork: $scope.searchName,
		}
		$scope.getUserList($scope.params, headerAuth);
	}

	// pagination
	$scope.handlePageChange = function (page) {
		if (page <= 0) {
			$scope.pagination.current_page = 1;
			return;
		}
		if (Number(page) > $scope.pagination.total_page) {
			$scope.pagination.current_page = $scope.pagination.total_page;
			return;
		}
		$scope.pagination.current_page = page;
		$scope.params = {
			...$scope.params,
			page: $scope.pagination.current_page
		}
		$scope.getUserList($scope.params, headerAuth);
	};

	$scope.isActivePage = function (page) {
		return page == $scope.pagination.current_page;
	};

	// handle CRUD
	$scope.handleEditUser = function (user) {
		$scope.isAdd = false;
		$scope.formData.id = user.id;
		$scope.formData.avatar = user.avatar;
		$scope.formData.name = user.name;
		$scope.formData.gender = user.gender;
		$scope.formData.email = user.email;
		$scope.formData.phone = Number(user.phone);
		$scope.formData.age = Number(user.age);
	};

	// CRUD users data
	$scope.getUserList = function (params, headerAuth) {
		return userServices
			.getUsers(params, headerAuth)
			.then(function (response) {
				if (response.data.success) {
					$scope.users = response.data.rows;
					$scope.pagination = response.data.attr.pagination;
				}
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

		const fd = new FormData();
		for (let key in $scope.formData) {
			fd.append(key, $scope.formData[key]);
		}
		const fileInputElement = document.getElementById('avatar');
		const previewAvatarElement = document.getElementById('previewAvatar');

		if (fileInputElement.files[0]) {
			fd.delete('avatar');
			fd.append('avatar', fileInputElement.files[0])
		}
		// for (var pair of fd.entries()) {
		// 	console.log(pair[0]+ ': ' + pair[1]); 
		// }

		if ($scope.isAdd) {
			userServices
				.addUser(fd, headerAuth)
				.then((res) => {
					$scope.formData = {};
					fileInputElement.value = '';
					previewAvatarElement.src = '';
					alert("Add User Successfull!");
					$scope.getUserList($scope.params, headerAuth);
				})
				.catch((err) => alert("Add User Failed!"));
		} else {
			if (fileInputElement.files[0]) {
				userServices.updateAvatar($scope.formData.id, fd, headerAuth).then((res) => { console.log("update avatar") })
			}
			const dataForm = angular.copy($scope.formData)
			delete dataForm.avatar
			const data = JSON.stringify(dataForm);
			userServices
				.updateUser($scope.formData.id, data, headerAuth)
				.then((res) => {
					$scope.formData = {};
					$scope.isAdd = true;
					fileInputElement.value = '';
					previewAvatarElement.src = '';
					alert("Update User Successfull!");
					$scope.getUserList($scope.params, headerAuth);
				})
				.catch((err) => alert("Update User Failed!"));
		}
	};

	$scope.deleteUser = function (id) {
		userServices
			.deleteUser(id, headerAuth)
			.then((res) => {
				alert("Delete User Successfull!")
				$scope.getUserList($scope.params, headerAuth);
			})
			.catch((err) => alert("Delete User Failed!"));
	};

	$scope.resetForm = function () {
		$scope.formData = {};
		$scope.isAdd = true;
	};

	$scope.showConfirmModal = function (user) {
		$rootScope.user = user;
		$rootScope.$broadcast('showConfirmModal');
	}

	$scope.getUserList($scope.params, headerAuth);

}



