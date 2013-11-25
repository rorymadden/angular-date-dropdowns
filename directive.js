
'use strict';

angular.module('rorymadden.date-dropdowns', [])


.factory('rsmdateutils', function () {
  // validate if entered values are a real date
  function validateDate(date){
    // store as a UTC date as we do not want changes with timezones
    var d = new Date(Date.UTC(date.year, date.month, date.day));
    return d && (d.getMonth() === date.month && d.getDate() === Number(date.day));
  }

  // reduce the day count if not a valid date (e.g. 30 february)
  function changeDate(date){
    if(date.day > 28) {
      date.day--;
      return date;
    }
    // this case should not exist with a restricted input
    // if a month larger than 11 is entered
    else if (date.month > 11) {
      date.day = 31;
      date.month--;
      return date;
    }
  }

  var self = this;
  this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  this.months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' }
  ];

  return {
    checkDate: function(date) {
      if(!date.day || !date.month || !date.year){
        return false;
      }
      if(validateDate(date)) {
        // update the model when the date is correct
        return date;
      }
      else {
        // change the date on the scope and try again if invalid
        this.checkDate(changeDate(date));
      }
    },
    get: function(name) {
      return self[name];
    }
  };
})

.directive('rsmdatedropdowns', ['rsmdateutils', function (rsmdateutils){
  return {
    restrict: 'A',
    replace: true,
    require: 'ngModel',
    scope: {
      model: '=ngModel'
    },
    controller: ['$scope', 'rsmdateutils', function ($scope, rsmDateUtils) {


      // set up arrays of values
      $scope.days = rsmDateUtils.get('days');
      $scope.months = rsmDateUtils.get('months');

      // split the current date into sections
      $scope.dateFields = {};

      // get UTC version of the date - use case is a birthday as datepickers do not work well for birthdays
      // if timezones are important raise a pull request and include the use case.
      $scope.$watch('model', function ( newDate ) {
        $scope.dateFields.day = new Date(newDate).getUTCDate();
        $scope.dateFields.month = new Date(newDate).getUTCMonth();
        $scope.dateFields.year = new Date(newDate).getUTCFullYear();
      });

      // validate that the date selected is accurate
      $scope.checkDate = function(){
        // update the date or return false if not all date fields entered.
        var date = rsmDateUtils.checkDate($scope.dateFields);
        if(date){
          $scope.dateFields = date;
        }
      };
    }],
    template:
    '<div class="form-inline">' +
    '  <div class="form-group col-xs-3 col-sm-3 col-md-3 col-lg-3 noPadding">' +
    '    <select name="dateFields.day" data-ng-model="dateFields.day" placeholder="Day" class="form-control" ng-options="day for day in days" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
    '  </div>' +
    '  <div class="form-group col-xs-5 col-sm-5 col-md-5 col-lg-5 noPadding">' +
    '    <select name="dateFields.month" data-ng-model="dateFields.month" placeholder="Month" class="form-control" ng-options="month.value as month.name for month in months" value="{{dateField.month}}" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
    '  </div>' +
    '  <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4 noPadding">' +
    '    <select name="dateFields.year" data-ng-model="dateFields.year" placeholder="Year" class="form-control" ng-options="year for year in years" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
    '  </div>' +
    '</div>',
    link: function(scope, element, attrs, ctrl){
      // allow overwriting of the
      if(attrs.dayDivClass){
        angular.element(element[0].children[0]).removeClass('col-3 col-sm-2 col-lg-2 noLeftPadding');
        angular.element(element[0].children[0]).addClass(attrs.dayDivClass);
      }
      if(attrs.dayClass){
        angular.element(element[0].children[0].children[0]).removeClass('form-control');
        angular.element(element[0].children[0].children[0]).addClass(attrs.dayClass);
      }
      if(attrs.monthDivClass){
        angular.element(element[0].children[1]).removeClass('col-5 col-sm-6 col-lg-4');
        angular.element(element[0].children[1]).addClass(attrs.monthDivClass);
      }
      if(attrs.monthClass){
        angular.element(element[0].children[1].children[0]).removeClass('form-control');
        angular.element(element[0].children[1].children[0]).addClass(attrs.monthClass);
      }
      if(attrs.yearDivClass){
        angular.element(element[0].children[2]).removeClass('col-4 col-sm-4 col-lg-3');
        angular.element(element[0].children[2]).addClass(attrs.yearDivClass);
      }
      if(attrs.yearClass){
        angular.element(element[0].children[2].children[0]).removeClass('form-control');
        angular.element(element[0].children[2].children[0]).addClass(attrs.yearClass);
      }

      // set the years drop down from attributes or defaults
      var currentYear = parseInt(attrs.startingYear,10) || new Date().getFullYear();
      var numYears = parseInt(attrs.numYears,10) || 100;
      var oldestYear = currentYear - numYears;

      scope.years = [];
      for(var i = currentYear; i >= oldestYear; i-- ){
        scope.years.push(i);
      }

      // pass down the ng-disabled property
      scope.$parent.$watch(attrs.ngDisabled, function(newVal){
        scope.disableFields = newVal;
      });


      var validator = function(){
        var valid = true;
        if(isNaN(scope.dateFields.day) && isNaN(scope.dateFields.month) && isNaN(scope.dateFields.year)){
          valid = true;
        }
        else if(!isNaN(scope.dateFields.day) && !isNaN(scope.dateFields.month) && !isNaN(scope.dateFields.year)){
          valid = true;
        }
        else valid = false;

        ctrl.$setValidity('rsmdatedropdowns', valid);
      };

      scope.$watch('dateFields.day', function(){
        validator();
      });

      scope.$watch('dateFields.month', function(){
        validator();
      });

      scope.$watch('dateFields.year', function(){
        validator();
      });
    }
  };
}]);