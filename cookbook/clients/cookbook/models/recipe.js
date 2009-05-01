require('core');

Cookbook.Recipe = SC.Record.extend({

  dataSource: Cookbook.server,
  resourceURL: 'sc/recipes',
  properties: ['name','prepTime','cookTime'],
  
  init: function() {
    this.set('name','New Recipe');
    sc_super();
  }

});