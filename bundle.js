;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])
;