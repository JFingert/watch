(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

angular.module('watchApp', [])

.controller('watchCtrl', function($scope, $interval, $timeout, $window, $document) {
	var html = document.documentElement,
		body = document.body,
		bodyHeight,
		height_25,
		height_50,
		height_75,
		scrollPosition = 0,
		reached25 = false,
		reached50 = false,
		reached75 = false,
		reached100 = false;

		$timeout(function() {
			bodyHeight = Math.max(
		        document.documentElement.clientHeight,
		        document.body.scrollHeight,
		        document.documentElement.scrollHeight,
		        document.body.offsetHeight,
		        document.documentElement.offsetHeight
		    ),
			height_25 = bodyHeight * 0.25,
			height_50 = bodyHeight * 0.5,
			height_75 = bodyHeight * 0.75;
			scrollLoop();
		}, 4000);

		

	$scope.getDate = new Date();
	var refresh = $interval(function() {
		$scope.getDate = new Date();
	}, 1000);

	$scope.$watch('getDate', function() {
		bodyHeight = Math.max(
	        document.documentElement.clientHeight,
	        document.body.scrollHeight,
	        document.documentElement.scrollHeight,
	        document.body.offsetHeight,
	        document.documentElement.offsetHeight
	    ),
		height_25 = bodyHeight * 0.25,
		height_50 = bodyHeight * 0.5,
		height_75 = bodyHeight * 0.75;

		var week = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
		var hours = $scope.getDate.getHours();
		var min = $scope.getDate.getMinutes();
		$scope.sec = $scope.getDate.getSeconds();
		$scope.date = $scope.getDate.getDate();
		$scope.day = week[$scope.getDate.getDay()];
		// console.log("hours ", hours);
		
		if ($scope.sec < 10) {
			$scope.sec = '0' + $scope.sec;
		}

		if (min < 10) {
			min = '0' + min;
		}

		if (hours > 11) {
			$scope.AmPm = 'PM';
		}  
		if (hours < 11) {
			$scope.AmPm = 'AM';
		}
		
		if (hours > 12) {
			hours = hours - 12;
			if (hours < 10) {
				hours = '0' + hours;
			}
		} else {
			if (hours < 10) {
				hours = '0' + hours;
			}
		}

		$scope.time = hours + ':' + min;

		
	});

	function scrollLoop() {
		var scrollTop = $window.pageYOffset;

		if (scrollTop >= height_25 && scrollTop < height_50) {
			if (!reached25) {
				reached25 = true;
				sendScrollDepthEvent('25');
			}
		}

		if (scrollTop >= height_50 && scrollTop < height_75) {
			if (!reached50) {
				reached50 = true;
				sendScrollDepthEvent('50');
			}
		}

		if (scrollTop >= height_75 && scrollTop < bodyHeight) {
			if (!reached75) {
				reached75 = true;
				sendScrollDepthEvent('75');
			}
		}

		if (scrollTop >= (bodyHeight - 750)) {
			if (!reached100) {
				reached100 = true;
				sendScrollDepthEvent('100');
			}
		}


		function sendScrollDepthEvent(value) {
			console.log(value);
			ga('send', 'event', 'scroll-depth', value);
		}

		window.requestAnimationFrame(scrollLoop);
	}
})

.controller('newsCtrl', function($scope, $http, $filter) {

	var orderBy = $filter('orderBy');
	//Categories
	$http.jsonp('http://api.feedzilla.com/v1/categories.json?callback=JSON_CALLBACK')
	.success(function(data, status, headers, config) {
		$scope.categories = data;
		// console.log("feedzilla data, status, headers, config ", data, status, headers, config);
	}).error(function(data, status, headers, config) {
		console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
	});

	//Digg
	$scope.getDigg = function() {
		$scope.dontDisplay = true;
		$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml&num=30&callback=JSON_CALLBACK')
		.success(function(data, status, headers, config) {
			// var feed = data.responseData.feed;
			// var array = orderBy(feed, 'publish_date');
			$scope.news = data.responseData.feed.entries;

			// console.log("digg data, status, headers, config ", data, status, headers, config);
		}).error(function(data, status, headers, config) {
			console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
		});
	};

		// Call for initial data (Digg)
		//$scope.getDigg();

		//Hacker + Design News
		$scope.getHackNews = function() {
			$scope.dontDisplay = false;
			$scope.hackNews = [];
			$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://news.ycombinator.com/rss&num=30&callback=JSON_CALLBACK')
			.success(function(data, status, headers, config) {
				// var feed = data.responseData.feed;
				// var array = orderBy(feed, 'publish_date');
				$scope.news = data.responseData.feed.entries;
				// getDesignNews();
				// console.log("hackernews  ", $scope.news);
			}).error(function(data, status, headers, config) {
				console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
			});
		}

			$scope.getDesignNews = function() {
				$scope.dontDisplay = false;
				$http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=https://news.layervault.com/?format=rss&num=30&callback=JSON_CALLBACK')
				.success(function(data, status, headers, config) {
					// var feed = data.responseData.feed;
					// var array = orderBy(feed, 'publish_date');
					$scope.news = data.responseData.feed.entries;
					// $scope.news = [].concat.apply([], $scope.hackNews);
					// console.log("designernews ", $scope.news);
				}).error(function(data, status, headers, config) {
					console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
				});
			};
			
		

$scope.getCatNews = function(id) {
	$http.jsonp('http://api.feedzilla.com/v1/categories/' + id + '/articles.json?callback=JSON_CALLBACK')
	.success(function(data, status, headers, config) {
		var array = orderBy(data.articles, 'publish_date');
		$scope.news = array;
		// console.log("feedzilla data, status, headers, config ", array, status, headers, config);
	}).error(function(data, status, headers, config) {
		console.log("ERROR! feedzilla data, status, headers, config ", data, status, headers, config);
	});
};



// $http.jsonp('https://data.itpir.wm.edu/deflate/api.php?val=100USD1982USA&json=true&callback=JSON_CALLBACK')
// 	.success(function(data, status, headers, config) {
// 		console.log('money ', data);

// 	}).error(function(data, status, headers, config) {
// 		console.log("ERROR! money data, status, headers, config ", data, status, headers, config);
// 	});


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
    	console.log('callin geocode ', $scope.LatLong, latlng, results);
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
			speed: 3
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
},{}]},{},[1]);
