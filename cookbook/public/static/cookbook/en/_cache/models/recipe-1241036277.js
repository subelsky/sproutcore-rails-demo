/* Start ----------------------------------------------------- models/recipe.js*/

require('core');

Cookbook.Recipe = SC.Record.extend({

  dataSource: Cookbook.server,
  resourceURL: 'recipes'

}) ;


/* End ------------------------------------------------------- models/recipe.js*/

