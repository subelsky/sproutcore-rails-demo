require('core');

Cookbook.Recipe = SC.Record.extend({

  properties: ['name','prep_time','cook_time','spice'],
  
  init: function() {
    this.set('name','New Recipe');
    sc_super();
  },
  
  commit: function() {
    var url,method;
    var parameters = {};
    
    if (this.get('newRecord')) {
      method = 'post';
      url = Cookbook.RECIPES_COLLECTION_PATH;
    } else {
      method = 'put';
      url = Cookbook.RECIPES_MEMBER_PATH.fmt(this.get('guid'));
    }

    // make sure things are saved in the store, newRecord set to false, etc.
    // note this is a pretty naive implementation; this commit shouldn't succeed
		// unless the server call succeeds -- but this is good enough for tutorial purposes
    sc_super();

    // we mainly have to encode this ourselves because Ajax.Request doesn't seem to handle nested objects very well
    parameters = { recipe: $H(this.getPropertyData()).toJSON() };
    
    var opts = {
      parameters: parameters,
      onSuccess: function(transport) {
        // this ensures that the guid gets updated to match what the server thinks, and generally acts to ensure
        // the client and server are definitely in sync
        this.updateAttributes(transport.responseJSON);
        this.set('newRecord',false); // bug, SC.Store should be doing this for us
      }.bind(this),
      onFailure: function(transport) {
        console.warn("Recipe commit failed due to: '%@'".fmt(transport.statusText));
      }
    };

    Cookbook.executeAjax(url,method,opts);
  },

  destroy: function(successFunction) {    
    var url = Cookbook.RECIPES_MEMBER_PATH.fmt(this.get('guid'));
    
    var opts = {
      onSuccess: function(transport) {
        if (successFunction) { successFunction(); }
        sc_super();
      }.bind(this),
      onFailure: function(transport) {
        console.warn("Recipe destroy failed due to: '%@'".fmt(transport.statusText));
      }
    };

    Cookbook.executeAjax(url,'delete',opts);  
  },

  toQueryString: function() {
    // start recursion
    return this._toQueryString(this.getPropertyData(),'Recipe');
  },
  // borrowed from SC.Server
  
  _toQueryString: function(params,rootKey) {

    // handle nulls
    if (params == null) {
      return rootKey + '=';
      
    // handle arrays
    } else if (params instanceof Array) {
      var ret = [] ;
      for(var loc=0;loc<params.length;loc++) {
        var key = (rootKey) ? (rootKey + '['+loc+']') : loc ;
        ret.push(this._toQueryString(params[loc],key)) ;
      }
      return ret.join('&') ;
      
    // handle objects
    } else if (typeof(params) == "object") {
      var ret = [];
      for(var cur in params) {
        var key = (rootKey) ? (rootKey + '['+cur+']') : cur ;
        ret.push(this._toQueryString(params[cur],key)) ;
      }
      return ret.join('&') ;
      
    // handle other values
    } else return [rootKey,params].join('=') ;
  }
    
});