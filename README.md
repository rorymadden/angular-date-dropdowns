# Date dropdowns for angular

Date dropdown fields for angular. Main use case is for entering date of birth.

Creates three dropdown fields - Day, Month and Year.

1. Day contains options 1 - 31
2. Month contains options January - December
3. Year contains the last 100 years

### Functionality
#### Returns the date as a UTC date
Birthdays do not change with timezones so the value is returned as a UTC date.

#### Validates that a correct date is entered
If a user enters an incorrect date (e.g. 30 February) the date will be automatically updated to the nearest previous correct date (e.g. 28th February or 29th if it is a leap year).

#### You can set the field to disabled

### Code

```html
   <input rmsdatedropdowns ng-model="model" ng-disabled="test()">
```
![alt text](http://i43.tinypic.com/2vuk8ax.png "Dropdowns")


### Updates
If you have any requests or updates please file issues / pull requests. Please include your use case if you require changes.
