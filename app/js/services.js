angular.module("userManagement.services", [])
	.factory("userServices", ["$http", userServices])
	.factory("fileReader", function($q, $log) {
		var onLoad = function(reader, deferred, scope) {
			return function() {
				scope.$apply(function() {
					deferred.resolve(reader.result);
				});
			};
		};
	
		var onError = function(reader, deferred, scope) {
			return function() {
				scope.$apply(function() {
					deferred.reject(reader.result);
				});
			};
		};
	
		var onProgress = function(reader, scope) {
			return function(event) {
				scope.$broadcast("fileProgress", {
					total: event.total,
					loaded: event.loaded
				});
			};
		};
	
		var getReader = function(deferred, scope) {
			var reader = new FileReader();
			reader.onload = onLoad(reader, deferred, scope);
			reader.onerror = onError(reader, deferred, scope);
			reader.onprogress = onProgress(reader, scope);
			return reader;
		};
	
		var readAsDataURL = function(file, scope) {
			var deferred = $q.defer();
	
			var reader = getReader(deferred, scope);
			reader.readAsDataURL(file);
	
			return deferred.promise;
		};
	
		return {
			readAsDataUrl: readAsDataURL
		};
	});

function userServices($http) {
	let userApiServices = {};
	const baseURL = "http://localhost:8080/codeigniter3/index.php/api/user";

	// CRUD users data
	userApiServices.getUsers = function (params) {
		const config = {
			method: "GET",
			url: baseURL,
			params
		};
		return $http(config);
	};

	userApiServices.getUserDetails = function (id) {
		return $http.get(`${baseURL}/${id}`);
	};
	userApiServices.addUser = function (data) {
		const config = {
			method: "POST",
			url: baseURL,
			headers: {
				'Content-Type': undefined
			},
			data: data,
			transformRequest: angular.identity
		};
		return $http(config);
	};

	userApiServices.updateUser = function (id, data) {
		return $http.put(`${baseURL}/${id}`, data);
	};

	userApiServices.deleteUser = function (id) {
		return $http.delete(`${baseURL}/${id}`);
	};

	userApiServices.updateAvatar = function (id, data) {
		const config = {
			method: "POST",
			url: `http://localhost:8080/codeigniter3/index.php/upload/${id}`,
			headers: {
				'Content-Type': undefined
			},
			data: data,
			transformRequest: angular.identity
		};
		return $http(config);
	}

	return userApiServices;
}
