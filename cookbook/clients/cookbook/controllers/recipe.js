require('core');

Cookbook.recipeController = SC.ObjectController.create({
  
  contentBinding: 'Cookbook.recipesController.selection',
  commitChangesImmediately: false,
  
  commitRecord: function() {
    this.commitChanges();
    var content = this.get('content');
    if (content && content.get('length') == 1) {
      content.objectAt(0).commit();
    }
  },
  
  saveable: function() {
    // object is saveable if it hasChanges OR if it's a new record
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