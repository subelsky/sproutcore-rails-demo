require('core');

Cookbook.Recipe = SC.Record.extend({

  properties: ['name','prep_time','cook_time'],
  
  init: function() {
    this.set('name','New Recipe');
    sc_super();
  },
  
  commit: function() {
    var url,method;
    
    if (this.get('newRecord')) {
      url = Cookbook.RECIPES_COLLECTION_PATH;
      method = 'post';
    } else {
      url = Cookbook.RECIPES_MEMBER_PATH.fmt(this.get('guid'));
      method = 'put';
    }

    sc_super(); // makes sure things are saved in the store, newRecord set to false, etc.
    
    // we mainly have to encode this ourselves because Ajax.Request doesn't seem to handle nested objects very well
    var parameters = { recipe: $H(this.getPropertyData()).toJSON() };
    
    var opts = {
      parameters: parameters,
      onSuccess: function(transport) {
        console.info("setting %@".fmt(transport.responseText))
        this.set('guid',transport.responseText); // if create works, server returns the persistent server GUID
        console.info(this.get('guid'))
      }.bind(this),
      onFailure: function(transport) {
        console.warn("Recipe commit failed due to: '%@'".fmt(transport.statusText));
      }
    };

    Cookbook.executeAjax(url,method,opts);
  },

  destroy: function() {
    var opts = {
      onSuccess: sc_super,
      onFailure: function(transport) {
        console.warn("Recipe destroy failed due to: '%@'".fmt(transport.statusText));
      }
    };
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