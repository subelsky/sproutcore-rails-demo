/* Start ----------------------------------------------------- views/source_list_group.js*/

// ==========================================================================
// SC.ListItemView
// ==========================================================================

require('views/view') ;
require('mixins/delegate_support');
require('mixins/control') ;
require('views/button/disclosure');

/** @class

  Displays a group view in a source list.  Handles displaying a disclosure
  triangle which can be used to show/hide children.

  @extends SC.View
  @extends SC.DelegateSupport
  @author   Charles Jolley 
  @version 0.1
*/

SC.SourceListGroupView = SC.View.extend(SC.Control, SC.DelegateSupport, {
  
  emptyElement: ['<div class="sc-source-list-group">',
    '<a href="javascript:;" class="sc-source-list-label sc-disclosure-view sc-button-view button disclosure no-disclosure">',
    '<img src="%@" class="button" />'.fmt('/static/sproutcore/en/_src/english.lproj/blank.gif'),
    '<span class="label"></span></a>',
  '</div>'].join(''),
  
  /**
    The group value to display for this group.
  */
  content: null,
  
  /**
    The current group visibility.  Used by the source list to determine 
    the layout size of the group.
  */
  isGroupVisible: YES,
  
  /** 
    YES if group is showing its titlebar.
    
    Group views will typically hide their header if the content is set to 
    null.  You can also override this method to always hide the header if 
    you want and the SourceListView will not leave room for it.
  */
  hasGroupTitle: YES,
  
  groupTitleKey: null,
  
  groupVisibleKey: null,
  
  contentPropertyDidChange: function(target, key) {
    var content = this.get('content') ;
    var labelView = this.outlet('labelView') ;
    
    // hide labelView if content is null.
    if (content == null) {
      labelView.setIfChanged('isVisible', NO) ;
      this.setIfChanged('hasGroupTitle', NO) ;
      return ;
    } else {
      labelView.setIfChanged('isVisible', YES) ;
      this.setIfChanged('hasGroupTitle', YES) ;
    }
    
   // set the title if that changed.
    var groupTitleKey = this.getDelegateProperty(this.displayDelegate, 'groupTitleKey') ;
    if ((key == '*') || (groupTitleKey && (key == groupTitleKey))) {
      var title = (content && content.get && groupTitleKey) ? content.get(groupTitleKey) : content;
      if (title != this._title) {
        this._title = title ;
        if (title) title = title.capitalize() ;
        labelView.set('title', title) ;
      }
    }
    
    // set the group visibility if changed
    var groupVisibleKey = this.getDelegateProperty(this.displayDelegate, 'groupVisibleKey') ;
    if ((key == '*') || (groupVisibleKey && (key == groupVisibleKey))) {

      if (groupVisibleKey) {
        
        labelView.removeClassName('no-disclosure') ;

        var isVisible = (content && content.get) ? !!content.get(groupVisibleKey) : YES ;
        if (isVisible != this.get('isGroupVisible')) {
          this.set('isGroupVisible', isVisible) ;
          labelView.set('value', isVisible) ;
        }
        
      } else labelView.addClassName('no-disclosure') ;
    }
  },
  
  // called when the user clicks on the disclosure triangle
  disclosureValueDidChange: function(newValue) {
    if (newValue == this.get('isGroupVisible')) return; // nothing to do
    
    // update group if necessary
    var group = this.get('content') ;
    var groupVisibleKey = this.getDelegateProperty(this.displayDelegate, 'groupVisibleKey') ;
    if (group && group.set && groupVisibleKey) {
      group.set(groupVisibleKey, newValue) ;
    }
    
    // update my own value and then update my collection view.
    this.set('isGroupVisible', newValue) ;
    if (this.owner && this.owner.updateChildren) this.owner.updateChildren(true) ;
    
  },
  
  /** @private */
  labelView: SC.DisclosureView.extend({
    
    /** 
      Always default to open disclosures.
    */
    value: YES,
    
    // if the disclosure value changes, call the owner's method.  Note
    // normally you would do this with a binding, but since this is a semi-
    // private class anyway, there is no reason to go to all that trouble.
    _valueObserver: function() {
      if (this.owner) this.owner.disclosureValueDidChange(this.get('value'));
    }.observes('value')
    
  }).outletFor('.sc-source-list-label:1:1')
  
}) ;


/* End ------------------------------------------------------- views/source_list_group.js*/

