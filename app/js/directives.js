angular.module("userManagement.directives", []).directive("ngFileSelect", function (fileReader, $timeout) {
	return {
		scope: {
			ngModel: '='
		},
		link: function ($scope, el) {
			function getFile(file) {
				fileReader.readAsDataUrl(file, $scope)
					.then(function (result) {
						$timeout(function () {
							$scope.ngModel = result;
						});
					});
			}

			el.bind("change", function (e) {
				var file = (e.srcElement || e.target).files[0];
				getFile(file);
			});
		}
	};
}).directive('confirmAction', function () {
	return {
		restrict: 'A',
		scope: {
			confirmFunction: '&',
			confirmMessage: '@'
		},
		link: function (scope, element, attrs) {
			element.on('click', function () {
				if (confirm(scope.confirmMessage || 'Are you sure?')) {
					scope.confirmFunction();
					scope.$apply();
				}
			});
		}
	};
});

