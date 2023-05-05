angular
	.module("userManagement.filters", [])
	.filter("searchNameFilter", searchNameFilter)
	.filter("filterSortBy", filterSortBy);

function searchNameFilter() {
	return function (arr, searchString) {
		if (!searchString) {
			return arr;
		}

		let result = [];

		searchString = searchString.toLowerCase();

		angular.forEach(arr, function (item) {
			if (item.name.toLowerCase().indexOf(searchString) !== -1) {
				result.push(item);
			}
		});

		return result;
	};
}

function filterSortBy() {
	return function (arr, field) {
		switch (field) {
			case "name-asc":
				return arr?.sort(function (a, b) {
					return a.name.localeCompare(b.name);
				});
			case "name-desc":
				return arr
					?.sort(function (a, b) {
						return a.name.localeCompare(b.name);
					})
					.reverse();
			case "age-asc":
				return arr?.sort(function (a, b) {
					return Number(a.age) - Number(b.age);
				});
			case "age-desc":
				return arr?.sort(function (a, b) {
					return Number(b.age) - Number(a.age);
				});
			default:
				return arr;
		}
	};
}
