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
  }
  
});