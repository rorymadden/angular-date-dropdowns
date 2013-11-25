# Date dropdowns for angular

Date dropdown fields for angular. Main use case is for entering date of birth.

Creates three dropdown fields - Day, Month and Year.

1. Day contains options 1 - 31
2. Month contains options January - December
3. Year contains the last 100 years

If you want to change the years tehre are two attributes available:
* starting-year
* num-years

Styling is done using Bootstrap3. There is a noPadding class added to the elements if you are trying to align your elements. You would need to add the following to your styles:
```css
.noPadding {
  padding-left: 0;
  padding-right: 0;
}
```

If you want to change the classes there are the following attributes available:
* day-div-class
* day-class
* month-div-class
* month-class
* year-div-class
* year-class


### Functionality
#### Returns the date as a UTC date
Birthdays do not change with timezones so the value is returned as a UTC date. Could change this with an attribute so let me know if this is of interest to people.

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
