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
  }.observes('content')

});