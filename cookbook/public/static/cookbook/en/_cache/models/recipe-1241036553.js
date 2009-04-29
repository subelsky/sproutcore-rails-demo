/* Start ----------------------------------------------------- models/recipe.js*/

require('core');

Cookbook.Recipe = SC.Record.extend({

  dataSource: Cookbook.server,
  resourceURL: 'sc/recipes'

}) ;


/* End ------------------------------------------------------- models/recipe.js*/

