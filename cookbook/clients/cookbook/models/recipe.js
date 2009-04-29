require('core');

Cookbook.Recipe = SC.Record.extend({

  dataSource: Cookbook.server,
  resourceURL: 'sc/recipes'

}) ;
