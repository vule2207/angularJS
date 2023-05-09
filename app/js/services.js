angular.module("userManagement.services", [])
	.factory("userServices", ["$http", '$rootScope', userServices])
	.factory("fileReader", function ($q, $log) {
		var onLoad = function (reader, deferred, scope) {
			return function () {
				scope.$apply(function () {
					deferred.resolve(reader.result);
				});
			};
		};

		var onError = function (reader, deferred, scope) {
			return function () {
				scope.$apply(function () {
					deferred.reject(reader.result);
				});
			};
		};

		var onProgress = function (reader, scope) {
			return function (event) {
				scope.$broadcast("fileProgress", {
					total: event.total,
					loaded: event.loaded
				});
			};
		};

		var getReader = function (deferred, scope) {
			var reader = new FileReader();
			reader.onload = onLoad(reader, deferred, scope);
			reader.onerror = onError(reader, deferred, scope);
			reader.onprogress = onProgress(reader, scope);
			return reader;
		};

		var readAsDataURL = function (file, scope) {
			var deferred = $q.defer();

			var reader = getReader(deferred, scope);
			reader.readAsDataURL(file);

			return deferred.promise;
		};

		return {
			readAsDataUrl: readAsDataURL
		};
	});

function userServices($http, $rootScope) {
	let userApiServices = {};
	const baseURL = "http://localhost/codeigniter3/index.php/api/user";


	// CRUD users data
	userApiServices.getUsers = function (params = null, headerAuth) {
		const config = {
			method: "GET",
			url: baseURL,
			headers: {
				...headerAuth
			},
			params
		};
		return $http(config);
	};

	userApiServices.getUserDetails = function (id, headerAuth) {
		const config = {
			method: "GET",
			url: `${baseURL}/${id}`,
			headers: {
				...headerAuth
			},
			params
		};
		return $http(config);
		// return $http.get(`${baseURL}/${id}`);
	};
	userApiServices.addUser = function (data) {
		const config = {
			method: "POST",
			url: baseURL,
			headers: {
				'Content-Type': undefined,
				...headerAuth
			},
			data: data,
			transformRequest: angular.identity
		};
		return $http(config);
	};

	userApiServices.updateUser = function (id, data, headerAuth) {
		const config = {
			method: "PUT",
			url: `${baseURL}/${id}`,
			headers: {
				'Content-Type': undefined,
				...headerAuth
			},
			data: data,
			transformRequest: angular.identity
		};
		return $http(config);
		// return $http.put(`${baseURL}/${id}`, data);
	};

	userApiServices.deleteUser = function (id, headerAuth) {
		const config = {
			method: "DELETE",
			url: `${baseURL}/${id}`,
			headers: {
				...headerAuth
			},
		};
		return $http(config);
		// return $http.delete(`${baseURL}/${id}`);
	};

	userApiServices.updateAvatar = function (id, data, headerAuth) {
		const config = {
			method: "POST",
			url: `http://localhost/codeigniter3/index.php/upload/${id}`,
			headers: {
				'Content-Type': undefined,
				...headerAuth
			},
			data: data,
			transformRequest: angular.identity
		};
		return $http(config);
	}

	userApiServices.registerUser = function (dataRegister) {
		const config = {
			method: "POST",
			url: `http://localhost/codeigniter3/index.php/api/user/register`,
			data: dataRegister,
			headers: {
				'Content-Type': undefined,
				...headerAuth
			},
			transformRequest: angular.identity
		};
		return $http(config);
	}

	userApiServices.login = function (dataLogin) {
		const config = {
			method: "POST",
			url: `http://localhost/codeigniter3/index.php/api/user/login`,
			data: dataLogin,
			headers: {
				'Content-Type': undefined,
			},
			transformRequest: angular.identity
		};
		return $http(config);
	}

	userApiServices.logout = function (data) {
		const config = {
			method: "POST",
			url: `http://localhost/codeigniter3/index.php/api/user/logout`,
			headers: {
				'Content-Type': undefined,
			},
			data: JSON.stringify({
				session_id: data
			}),
			transformRequest: angular.identity
		};
		return $http(config);
	}

	return userApiServices;
}
