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

.controller('newsCtrl', function($scope, $http, $filter) {

	var orderBy = $filter('orderBy');
	//Categories
	$http.jsonp('http://api.feedzilla.com/v1/categories.json?callback=JSON_CALLBACK')
	.success(function(data, status, headers, config) {
		$scope.categories = data;
		console.log("feedzilla data, status, headers, config ", data, status, headers, config);
	}).error(function(data, status, headers, config) {
		console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
	});

		// Digg
		$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml&num=30&callback=JSON_CALLBACK')
		.success(function(data, status, headers, config) {
			// var feed = data.responseData.feed;
			// var array = orderBy(feed, 'publish_date');
			$scope.news = data.responseData.feed.entries;
			console.log("digg data, status, headers, config ", data, status, headers, config);
		}).error(function(data, status, headers, config) {
			console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
		});

		//Hacker + Design News
		$scope.getHackNews = function() {
			$scope.hackNews = [];
			$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://news.ycombinator.com/rss&num=30&callback=JSON_CALLBACK')
			.success(function(data, status, headers, config) {
				// var feed = data.responseData.feed;
				// var array = orderBy(feed, 'publish_date');
				$scope.hackNews.push(data.responseData.feed.entries);
				getDesignNews();
				console.log("hackernews  ", $scope.news);
			}).error(function(data, status, headers, config) {
				console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
			});

			var getDesignNews = function() {
				$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=https://news.layervault.com/?format=rss&num=30&callback=JSON_CALLBACK')
				.success(function(data, status, headers, config) {
					// var feed = data.responseData.feed;
					// var array = orderBy(feed, 'publish_date');
					$scope.hackNews.push(data.responseData.feed.entries);
					$scope.news = [].concat.apply([], $scope.hackNews);
					console.log("designernews ", $scope.news);
				}).error(function(data, status, headers, config) {
					console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
				});
			};
			
		}

	//Headlines
	// $http.jsonp('http://api.feedzilla.com/v1/articles.json?callback=JSON_CALLBACK')
	// 	.success(function(data, status, headers, config) {
	// 		var array = orderBy(data.articles, 'publish_date');
	// 		$scope.news = array; 			
	// 		console.log("data, status, headers, config ", array, status, headers, config);
	// 	}).error(function(data, status, headers, config) {
	// 		console.log("ERROR! data, status, headers, config ", data, status, headers, config);
	// 	});		

$scope.getCatNews = function(id) {
	$http.jsonp('http://api.feedzilla.com/v1/categories/' + id + '/articles.json?callback=JSON_CALLBACK')
	.success(function(data, status, headers, config) {
		var array = orderBy(data.articles, 'publish_date');
		$scope.news = array;
		console.log("feedzilla data, status, headers, config ", array, status, headers, config);
	}).error(function(data, status, headers, config) {
		console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
	});
};

$scope.getDigg = function() {
	$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/top.xml&callback=JSON_CALLBACK')
	.success(function(data, status, headers, config) {
		$scope.news = data.responseData.feed.entries;
	}).error(function(data, status, headers, config) {
		console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
	});
};

})

.controller('weatherCtrl', function($scope, $http) {
	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;

		$scope.LatLong = latitude + "," + longitude;
		$scope.getCity(latitude, longitude);

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



	var geocoder = new google.maps.Geocoder();

	$scope.getCity = function (lat, long) {

		var latlng = new google.maps.LatLng(lat, long);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
    	// console.log('callin geocode ', $scope.LatLong, latlng, results);
    	$scope.city = results[5].formatted_address;
    });
	};

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