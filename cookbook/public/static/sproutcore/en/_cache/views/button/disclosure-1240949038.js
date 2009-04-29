/* Start ----------------------------------------------------- views/button/disclosure.js*/

// ==========================================================================
// SC.CheckboxView
// ==========================================================================

require('views/button/button');

/** @class

  Disclosure triangle button.

  @extends SC.ButtonView
  @author    Charles Jolley 
  @version 1.0
*/
SC.DisclosureView = SC.ButtonView.extend(
/** @scope SC.DisclosureView.prototype */ {

  emptyElement: '<a href="javascript:;" class="sc-disclosure-view sc-button-view button disclosure"><img src="%@" class="button" /><span class="label"></span></a>'.fmt('/static/sproutcore/en/_src/english.lproj/blank.gif'),
  
  buttonBehavior: SC.TOGGLE_BEHAVIOR,

  /**
    This is the value that will be set when the disclosure triangle is toggled
    open.
  */
  toggleOnValue: YES,
  
  /**
    The value that will be set when the disclosure triangle is toggled closed.
  */
  toggleOffValue: NO,

  valueBindingDefault: SC.Binding.Bool,
  
  init: function() {
    arguments.callee.base.apply(this,arguments) ;
    if (this.get('value') == this.get('toggleOnValue')) {
      this.set('isSelected', true) ;
    }
  }
  
}) ;


/* End ------------------------------------------------------- views/button/disclosure.js*/

