require('core');

Cookbook.recipeController = SC.ObjectController.create({
  
  contentBinding: 'Cookbook.recipesController.selection',
  commitChangesImmediately: false,
  
  commitRecord: function() {
    var content = this.get('content');
    if (content && content.get('length') == 1) {
      content.objectAt(0).commit();
    }
    this.commitChanges();
  }

});