angular.module("userManagement.directives", []).directive("ngFileSelect", function(fileReader, $timeout) {
	return {
		scope: {
			ngModel: '='
		},
		link: function($scope, el) {
			function getFile(file) {
				fileReader.readAsDataUrl(file, $scope)
					.then(function(result) {
						$timeout(function() {
							$scope.ngModel = result;
						});
					});
			}

			el.bind("change", function(e) {
				var file = (e.srcElement || e.target).files[0];
				getFile(file);
			});
		}
	};
});

function uploadDirectives() {
	return {
		restrict: "A",
		scope: {
			'ngModel': '=',
		},
		link: function (scope, element, attrs) {
			if(scope.ngModel && scope.ngModel != ''){
					scope.imageSrc = angular.copy(scope.ngModel);
			}

			scope.ngModel = null;
			scope.onFileSelect = function(files) {
					scope.ngModel = files[0];
					if (window.FileReader && files[0].type.indexOf('image') > -1) {
							var fileReader = new FileReader();
							fileReader.readAsDataURL(files[0]);
							fileReader.onload = function(e) {
									$timeout(function() {
											scope.imageSrc = e.target.result;
									});
							}
					}
			};

			scope.changePhoto = function(event) {
					$timeout(function() {
							$(event.currentTarget).closest('.editable-container').find('input[type="file"]').click();
					});
			};
			scope.removeData = function(){
					scope.ngModel = '';
					scope.imageDataUrl = '';
			};
	}
	};
}
