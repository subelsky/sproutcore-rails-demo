/* Start ----------------------------------------------------- views/button/checkbox.js*/

// ==========================================================================
// SC.CheckboxView
// ==========================================================================

require('views/button/button');

/** @class

  Renders a checkbox button view specifically.
  
  This view is basically a button view preconfigured to generate the correct
  HTML and to set to use a TOGGLE_BEHAVIOR for its buttons.
  
  This view renders a simulated checkbox that can display a mixed state and 
  has other features not found in platform-native controls.  If you want to 
  use the platform native version instead, see SC.CheckboxFieldView.

  @extends SC.ButtonView
  @author    Charles Jolley 
  @version 1.0
*/
SC.CheckboxView = SC.ButtonView.extend(
/** @scope SC.CheckboxView.prototype */ {

  emptyElement: '<a href="javascript:;" class="sc-checkbox-view sc-button-view button checkbox"><img src="%@" class="button" /><span class="label"></span></a>'.fmt('/static/sproutcore/en/_src/english.lproj/blank.gif'),
  
  buttonBehavior: SC.TOGGLE_BEHAVIOR
  
}) ;


/* End ------------------------------------------------------- views/button/checkbox.js*/

