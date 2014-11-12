'use strict';

angular.module('watchApp', [])

.controller('watchCtrl', function($scope, $interval) {
	
	$scope.getDate = new Date();
	var refresh = $interval(function() {
		$scope.getDate = new Date();
	}, 1000);

	$scope.$watch('getDate', function() {
     
   

		var week = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
		var hours = $scope.getDate.getHours();
		var min = $scope.getDate.getMinutes();
		$scope.sec = $scope.getDate.getSeconds();
		$scope.date = $scope.getDate.getDate();
		$scope.day = week[$scope.getDate.getDay()];

		
		if ($scope.sec < 10) {
			$scope.sec = '0' + $scope.sec;
		}

		if (min < 10) {
			min = '0' + min;
		}

		if (hours > 12) {
			$scope.AmPm = 'PM';
			hours = hours - 12;
			if (hours < 10) {
				hours = '0' + hours;
			}
		} else {
			$scope.AmPm = 'AM';
			if (hours < 10) {
				hours = '0' + hours;
			}
		}

		$scope.time = hours + ':' + min;
	});
	
});