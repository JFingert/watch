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
	
})

.controller('newsCtrl', function($scope, $http) { 


	$http.jsonp('http://api.nytimes.com/svc/news/v3/content/all/all.jsonp?limit=40&api-key=a51b149a909cc37b3144391490a132d1:4:70179039&callback=JSON_CALLBACK')
		.success(function(data, status, headers, config) {
			// console.log("data, status, headers, config ", data, status, headers, config);
			$scope.news = data.results; 
		}).error(function(data, status, headers, config) {
			console.log("ERROR! data, status, headers, config ", data, status, headers, config);
		});
})

.controller('weatherCtrl', function($scope, $http) {
	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;

		$scope.LatLong = latitude + "," + longitude;

	};

	navigator.geolocation.getCurrentPosition(success);

	$http.jsonp('https://api.forecast.io/forecast/8783b7b8e12ec2201c7d2e9f20666411/45.5153,-122.6658?callback=JSON_CALLBACK')
	.success(function(data, status, headers, config) {
		// console.log("data, status, headers, config ", data, status, headers, config);
		$scope.temp = data.currently.temperature;
		$scope.summary = data.currently.summary;
		$scope.wind = data.currently.windSpeed;
	}).error(function(data, status, headers, config) {
		console.log("ERROR! data, status, headers, config ", data, status, headers, config);
	});

});


particlesJS('particles-js', {
    particles: {
        color: '#1638A3',
        shape: 'circle',
        opacity: 1,
        size: 2.5,
        size_random: true,
        nb: 100,
        line_linked: {
            enable_auto: true,
            distance: 250,
            color: '#1638A3',
            opacity: 0.5,
            width: 1,
            condensed_mode: {
                enable: false,
                rotateX: 600,
                rotateY: 600
            }
        },
        anim: {
            enable: true,
            speed: 2
        }
    },
    interactivity: {
        enable: true,
        mouse: {
            distance: 200
        },
        mode: 'grab'
    },
    retina_detect: true
});