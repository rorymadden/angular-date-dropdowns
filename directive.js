(function () {
  'use strict';

  var dd = angular.module('rorymadden.date-dropdowns', []);

  dd.factory('rsmdateutils', function () {
    var that = this,
        dayRange = [1, 31],
        months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];

    function changeDate (date) {
      if(date.day > 28) {
        date.day--;
        return date;
      } else if (date.month > 11) {
        date.day = 31;
        date.month--;
        return date;
      }
    };

    return {
      checkDate: function (date) {
        var d;
        if (!date.day || date.month === null || date.month === undefined || !date.year) return false;

        d = new Date(Date.UTC(date.year, date.month, date.day));
        
        if (d && (d.getMonth() === date.month && d.getDate() === Number(date.day))) {
          return d;
        }

        return this.checkDate(changeDate(date));
      },
      days: (function () {
        var days = [];
        while (dayRange[0] <= dayRange[1]) {
          days.push(dayRange[0]++);
        }
        return days;
      }()),
      months: (function () {
        var lst = [],
            mLen = months.length;

        for (var i = 0; i < mLen; i++) {
          lst.push({
            value: i,
            name: months[i]
          });
        }
        return lst;
      }())
    };
  })

  dd.directive('rsmdatedropdowns', ['rsmdateutils', function (rsmdateutils) {
    return {
      restrict: 'A',
      replace: true,
      require: 'ngModel',
      scope: {
        model: '=ngModel'
      },
      controller: ['$scope', 'rsmdateutils', function ($scope, rsmDateUtils) {
        $scope.days = rsmDateUtils.days;
        $scope.months = rsmDateUtils.months;

        $scope.dateFields = {};

        $scope.dateFields.day = new Date($scope.model).getUTCDate();
        $scope.dateFields.month = new Date($scope.model).getUTCMonth();
        $scope.dateFields.year = new Date($scope.model).getUTCFullYear();

        // Initialize with current date (if set)
        $scope.$watch('model', function (newDate) {
          if(newDate) {
            $scope.dateFields.day = new Date(newDate).getUTCDate();
            $scope.dateFields.month = new Date(newDate).getUTCMonth();
            $scope.dateFields.year = new Date(newDate).getUTCFullYear();
          }
        });

        $scope.checkDate = function () {
          var date = rsmDateUtils.checkDate($scope.dateFields);
          if (date) {
            $scope.model = date;
          }
        };
      }],
      template:
      '<div class="form-inline">' +
      '  <div class="form-group col-xs-3">' +
      '     <select name="dateFields.day" data-ng-model="dateFields.day" placeholder="Day" class="form-control" ng-options="day for day in days" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
      '  </div>' +
      '  <div class="form-group col-xs-5">' +
      '    <select name="dateFields.month" data-ng-model="dateFields.month" placeholder="Month" class="form-control" ng-options="month.value as month.name for month in months" value="{{ dateField.month }}" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
      '  </div>' +
      '  <div class="form-group col-xs-4">' +
      '    <select ng-show="!yearText" name="dateFields.year" data-ng-model="dateFields.year" placeholder="Year" class="form-control" ng-options="year for year in years" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
      '    <input ng-show="yearText" type="text" name="dateFields.year" data-ng-model="dateFields.year" placeholder="Year" class="form-control" ng-disabled="disableFields">' +
      '  </div>' +
      '</div>',
      link: function (scope, element, attrs, ctrl) {
        var currentYear = parseInt(attrs.startingYear, 10) || new Date().getFullYear(),
            numYears = parseInt(attrs.numYears,10) || 100,
            oldestYear = currentYear - numYears,
            overridable = [
              'dayDivClass',
              'dayClass',
              'monthDivClass',
              'monthClass',
              'yearDivClass',
              'yearClass'
            ],
            required;

        scope.years = [];
        scope.yearText = attrs.yearText ? true : false;

        if (attrs.ngDisabled) {
          scope.$parent.$watch(attrs.ngDisabled, function (newVal) {
            scope.disableFields = newVal;
          });
        }

        if (attrs.required) {
          required = attrs.required.split(' ');

          ctrl.$parsers.push(function (value) {
            angular.forEach(required, function (elem) {
              if (!angular.isNumber(elem)) {
                ctrl.$setValidity('required', false);
              }
            });
            ctrl.$setValidity('required', true);
          });
        }

        for (var i = currentYear; i >= oldestYear; i--) {
          scope.years.push(i);
        }

        (function () {
          var oLen = overridable.length,
              oCurrent,
              childEle;
          while (oLen--) {
            oCurrent = overridable[oLen];
            childEle = element[0].children[Math.floor(oLen / 2)];

            if (oLen % 2 && oLen != 2) {
              childEle = childEle.children[0];
            }

            if (attrs[oCurrent]) {
              angular.element(childEle).attr('class', attrs[oCurrent]);
            }
          }
        }());
      }
    };
  }]);
}());