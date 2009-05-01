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
  },
  
  saveable: function() {
    
    if (this.get('hasChanges')) { 
      return true;
    }
    
    var content = this.get('content');
    var save = false;

    if (content && content.get('length') == 1) {
      save = content.objectAt(0).get('newRecord');
    } 
    
    return save;
  }.property('hasChanges','content*newRecord')

});

//application/x-www-form-urlencoded