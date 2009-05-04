require('core');

Cookbook.SpiceLabelView = SC.LabelView.extend({
  
  init: function () { sc_super(); this.render(); },
   
  render: function() {
    var html = '';
    var spice = this.get('content');
    
    // in JavaScript, 0 evaluates to false
    if (spice === undefined) {
      html = "Unknown";
    }

    if (spice < 50) {
      html = "Mild";
    } else if (spice < 75) {
      html = "Medium";
    } else {
      html = "Hot";
    }

    this.set('innerHTML',html);
  }.observes('content'),

  // mousing code adapted from SC.Button implementation
  
  mouseDown: function(evt) {
    this._isMouseDown = true;
    return true ;
  },
  
  mouseUp: function(evt) {

    // only handle mouseUp if we previouly received a mouseDown
    if (this._isMouseDown) {
      this._isMouseDown = false;
      var tgt = Event.element(evt) ;
      var inside = false ;
      while(tgt && (tgt != this.rootElement)) {
        tgt = tgt.parentNode;
      }
    
      if (tgt == this.rootElement) {
        this.toggleClassName("caliente");
      }
    
      return true ;
    } else {
      return false ;
    }
  }

});