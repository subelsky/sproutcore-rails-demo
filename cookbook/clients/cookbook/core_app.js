require('core');

Cookbook.RECIPES_COLLECTION_PATH = '/sc/recipes';
Cookbook.RECIPES_MEMBER_PATH = '/sc/recipes/%@';

Cookbook.fetchRecipes = function(successFunction) {
  var opts = {
    onSuccess: function(transport) {
      Cookbook.parseFetchResponse(transport);
      if (successFunction) {
        successFunction(); 
      }
    },
  
    onFailure: function(transport) {
      console.warn("Recipe fetching failed due to: '%@'".fmt(transport.statusText));
    }
  };
  
  Cookbook.executeAjax(Cookbook.RECIPES_COLLECTION_PATH,'get', opts);
};

// I know these parsing functions can be DRY'd up; keeping them separate for pedagogical reasons

Cookbook.parseFetchResponse = function(transport) {
  var response = transport.responseJSON;
  var records = response.records;
  
  var idx = records.length;
  var record;
  
  while (idx--) {
    record = Cookbook.Recipe.newRecord(records[idx]);
    record.set('newRecord',false);
  }

  SC.RAILS_AUTH_TOKEN_NAME = response.rails_auth_token_name;
  SC.RAILS_AUTH_TOKEN = response.rails_auth_token;

};

Cookbook.parseUpdateResponse = function(transport) {
  var records = transport.responseJSON.records;
  var idx = records.length;
  var record,recordHash;
  
  while (idx--) {
    recordHash = records[idx];
    record = Cookbook.Recipe.find(recordHash.guid);
    
    if (record) {
      record.updateAttributes(recordHash);
    }
  }
};


Cookbook.startup = function() {
  var recipes = Cookbook.Recipe.findAll();
  Cookbook.recipesController.set('content',recipes);
};

Cookbook.executeAjax = function(url,method,opts) {
  opts = opts || {};
  opts.method = method;
  opts.emulateUncommonMethods = true;
  opts.parameters = opts.parameters || {};

  if (opts.method != 'get') {
    opts.parameters[SC.RAILS_AUTH_TOKEN_NAME] = SC.RAILS_AUTH_TOKEN;
  } 
  
  if (!Cookbook.localMode) {
    var request = new Ajax.Request(url,opts);
  }
};