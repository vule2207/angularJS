angular.module("userManagement.directives", []).directive("filterDirectives", ["filter", paginationDirectives]);

function paginationDirectives() {
	return {
		restrict: "E",
		scope: {
			curPage: "=",
			totalPages: "=",
		},
		link: function (scope, element, attr) {},
	};
}
