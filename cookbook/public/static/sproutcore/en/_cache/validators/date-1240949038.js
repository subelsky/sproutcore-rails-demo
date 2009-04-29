/* Start ----------------------------------------------------- validators/date.js*/

// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

require('validators/validator') ;

/**
  Handle parsing and display of dates.
  
  @class
  @extends SC.Validator
  @author Charles Jolley
  @version 1.0
*/
SC.Validator.Date = SC.Validator.extend(
/** @scope SC.Validator.Date.prototype */ {

  /**
    The standard format you want the validator to convert dates to.
  */
  format: 'NNN d, yyyy h:mm:ss a',
  
  /**
    if we have a number, then convert to a date object.
  */
  fieldValueForObject: function(object, form, field) {
    var date ;
    if (typeof(object) == "number") {
      date = new Date(object) ;
    } else if (object instanceof Date) { date = object; }
      
    if (date) object = date.format(this.get('format')) ;
    
    return object ;
  },

  /**
    Try to pase value as a date. convert into a number, or return null if
    it could not be parsed.
  */
  objectForFieldValue: function(value, form, field) {
    if (value) {
      var date = Date.parseDate(value) ;
      value = (date) ? date.getTime() : null ;
    }
    return value ;
  }
    
}) ;


/* End ------------------------------------------------------- validators/date.js*/

