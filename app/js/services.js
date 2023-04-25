angular.module("userManagement.services", []).factory("userServices", ["$http", userServices]);

function userServices($http) {
	let userApiServices = {};
	const baseURL = "https://dummyjson.com/users";

	// CRUD users data
	userApiServices.getUsers = function (limit = 10, skip = 0) {
		const config = {
			method: "GET",
			url: baseURL,
			params: {
				limit: limit,
				skip: skip,
			},
		};
		return $http(config);
	};

	userApiServices.getUserDetails = function (id) {
		return $http.get(`${baseURL}/${id}`);
	};
	userApiServices.addUser = function (data) {
		return $http.post(`${baseURL}/add`, data);
	};

	userApiServices.updateUser = function (id, data) {
		return $http.put(`${baseURL}/${id}`, data);
	};

	userApiServices.deleteUser = function (id) {
		return $http.delete(`${baseURL}/${id}`);
	};

	return userApiServices;
}
