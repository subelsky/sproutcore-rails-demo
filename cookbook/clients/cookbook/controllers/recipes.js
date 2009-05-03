// ==========================================================================
// Cookbook.recipesController
// ==========================================================================

require('core');

Cookbook.recipesController = SC.ArrayController.create({

  allowsEmptySelection: false,
  allowsMultipleSelection: false,
  canEditCollection: true,
  
  addObject: function() {
    var newObj = Cookbook.Recipe.newRecord({},Cookbook.server);
    this.pushObject(newObj);
    this.set('selection',[newObj]);
  },
  
  destroyObject: function() {
    // step through each selected object and call its destruction method
    // provide a callback so that if the deletion is successful, the 
    // destroyed record is removed from our array
    var sel = this.get('selection');
    var idx = sel.length;
    var obj;
    
    while (idx--) {
      obj = sel[idx];
      obj.destroy(function() {
        this.removeObject(obj);
      }.bind(this));
    }
  }
    
});