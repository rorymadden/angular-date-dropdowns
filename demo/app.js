(function () {
	'use strict';

  var app = angular.module('demo', [
    'rorymadden.date-dropdowns'
  ]);

  app.controller('TestCtrl', function ($scope) {

    $scope.testData = {
      blankDate: null,
      realDate: new Date("September 30, 2010 15:30:00")
    };
  });

}());