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
}).directive('confirmModal', function () {
	return {
		restrict: 'E',
		templateUrl: 'confirm-modal.html',
		scope: {
			item: '=',
			onDelete: '&'
		},
		controller: function ($scope, $uibModalInstance) {
			$scope.ok = function () {
				$uibModalInstance.close();
				$scope.onDelete({ item: $scope.item });
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}
	};
});


