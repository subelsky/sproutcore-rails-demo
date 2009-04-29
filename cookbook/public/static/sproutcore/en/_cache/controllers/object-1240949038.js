/* Start ----------------------------------------------------- controllers/object.js*/

// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

require('controllers/controller') ;

/** @class

  An ObjectController gives you a simple way to manage the editing state of
  an object.  You can use an ObjectController instance as a "proxy" for your
  model objects.
  
  Any properties you get or set on the object controller, will be passed 
  through to its content object.  This allows you to setup bindings to your
  object controller one time for all of your views and then swap out the 
  content as needed.
  
  @extends SC.Controller
*/
SC.ObjectController = SC.Controller.extend(
/** @scope SC.ObjectController.prototype */ {
  
  // ...............................
  // PROPERTIES
  //
  
  /**
    set this to some value and the object controller will project 
    its properties.
  */
  content: null,  

  /**
    This will be set to true if the object currently does not have any
    content.  You might use this to disable any controls attached to the
    controller.
    
    @type Boolean
  */
  hasNoContent: true,
  
  /**
    This will be set to true if the content is a single object or an array 
    with a single item.  You can use this to disabled your UI.
    
    @type Boolean
  */
  hasSingleContent: false, 
  
  /**
    This will be set to true if the content is an array with multiple objects 
    in it.
    
    @type Boolean
  */
  hasMultipleContent: false,

  /**
    Set to true if the controller has any content, even an empty array.
  */
  hasContent: function() {
    return this.get('content') != null ;
  }.property('content'),

  /**
    Set this property to true and multiple content will be treated like a null 
    value. This will only impact use of get() and set().
    
    @type Boolean
  */
  allowsMultipleContent: true,
  
  /**
    Override this method to destroy the selected object. 
    
    The default just passes this call onto the content object if it supports
    it, and then sets the content to null.
  */
  destroy: function() {
    var content = this.get('content') ;
    if (content && $type(content.destroy) === T_FUNCTION) content.destroy();
    this.set('content', null) ;  
  },
  
  // ...............................
  // INTERNAL SUPPORT
  //
  
  /**
    When this controller commits changes, it will copy its changed values
    to the content object and then call "commitChanges" on the content
    object if that object implements the method.
  */
  performCommitChanges: function() {
    
    var content = this.get('content') ;
    var ret = true ;

    // empty arrays are treated like null values, arrays.len=1 treated like 
    // single objects.
    var isArray = false ;
    if (this._isArray(content)) {
      var len = this._lengthFor(content) ;
      if (len == 0) {
        content = null ; 
      } else if (len == 1) {
        content = this._objectAt(0, content) ;
      } else if (this.get('allowsMultipleContent')) {
        isArray = true ;
      } else content = null ;
    }
    
    if (!this._changes) this._changes = {} ;
    
    // cannot commit changes to empty content.  Return an error.
    if (!content) {
      return $error("No Content") ;

    // if content is an array, then loop through each item in the array and
    // get the changed values.
    } else if (isArray) {
      
      var loc = this._lengthFor(content) ;
      while(--loc >= 0) {
        var object = this._objectAt(loc, content) ;
        if (!object) continue ;
        
        if (object.beginPropertyChanges) object.beginPropertyChanges(); 
        
        // loop through all the keys in changes and get the values...
        for(var key in this._changes) {
          if (!this._changes.hasOwnProperty(key)) continue ;
          var value = this._changes[key];
          
          // if the value is an array, get the idx matching the content
          // object.  Otherwise, just use the value of the item.
          if(this._isArray(value)) {
            value = this._objectAt(loc, value) ;
          }
          
          if (object.set) {
            object.set(key,value) ;
          } else object[key] = value ;
        }

        if (object.endPropertyChanges) object.endPropertyChanges() ;
        if (object.commitChanges) ret = object.commitChanges() ;
      }
      
    // if the content is not an array, then just loop through each changed
    // value and copy it to the object.
    } else {
      
      if (content.beginPropertyChanges) content.beginPropertyChanges() ;
      
      // save the set of changes to apply them.  Nothing should clear it but
      // just in case.
      var changes = this._changes ;
      for(var key in changes) {
        if (!changes.hasOwnProperty(key)) continue;
        
        var oldValue = content.get ? content.get(key) : content[key];
        var newValue = changes[key];
        
        if (oldValue == null && newValue == '') newValue = null;
        if (newValue != oldValue) {
          (content.set) ? content.set('isDirty', YES) : (content.isDirty=YES);
        }
        
        if (content.set) {
          content.set(key, newValue);
        } else {
          content[key] = newValue;
        }
      }
      
      if (content.endPropertyChanges) content.endPropertyChanges() ;
      if (content.commitChanges) ret = content.commitChanges() ;
    }
    
    // if commit was successful, dump changes hash and clear editor.
    if ($ok(ret)) {
      this._changes = {} ;
      //this._valueControllers = {};
      this.editorDidClearChanges() ;
    }
    
    return ret ;
  },
  
  /** @private */
  performDiscardChanges: function() { 
    this._changes = {};
    this._valueControllers = {};
    this.editorDidClearChanges();
    this.allPropertiesDidChange();
    return true ;
  },
  
  /** @private */
  unknownProperty: function(key,value)
  {
    if (key == "content")
    {
      // FOR CONTENT KEY:
      // avoid circular references.  If you try to set content, just save the
      // value. The propertyObserver will be triggered below to do the rest of
      // the setup as needed.
      if (!(value === undefined)) this[key] = value;
      return this[key];
    } 
    else 
    {
      // FOR ALL OTHER KEYS:
      // Save the value in our temporary hash and note the changes in the 
      // editor.

      if (!this._changes) this._changes = {} ; 
      if (!this._valueControllers) this._valueControllers = {}; 
      
      if (value !== undefined)
      {
        // for changes, save in _changes hash and note that a change is required.
        this._changes[key] = value;
        if (this._valueControllers[key])
        {
          this._valueControllers[key] = null;
        }
        // notifying observers regarless if a controller had been created since they're lazy loaded
        this.propertyWillChange(key + "Controller");
        this.propertyDidChange(key + "Controller");
        this.editorDidChange();
      }
      else
      {
        // are we requesting the controller for a value?
        if (key.slice(key.length-10,key.length) == "Controller")
        {
          // the actual value...
          key = key.slice(0,-10);
          if ( !this._valueControllers[key] )
          {
            this._valueControllers[key] = this.controllerForValue(this._getValueForPropertyKey(key));
          }
          value = this._valueControllers[key];
        }
        else
        {
          // otherwise, get the value.
          // first check the _changes hash, then check the content object.
          value = this._getValueForPropertyKey(key);
        }
      }
      return value;
    }
  },
  
  _getValueForPropertyKey: function( key )
  {
    // first check the changes hash for a uncommited value...
    var value = this._changes[key];
    // sweet, no need to proceed.
    if ( value !== undefined ) return value;

    // ok, we'll need to get the value from the content object
    var obj = this.get('content');
    // no content object... return null.
    if (!obj) return null;

    if (this._isArray(obj))
    {
      var value = [];
      var len = this._lengthFor(obj);
      if (len > 1)
      {
        // if content is an array with more than one item, collect
        // content from array.
        if (this.get('allowsMultipleContent')) {
          for(var idx=0; idx < len; idx++) {
            var item = this._objectAt(idx, obj) ;
            value.push((item) ? ((item.get) ? item.get(key) : item[key]) : null) ;
          }
        } else {
          value = null;
        }
      }
      else if (len == 1)
      {
        // if content is array with one item, collect from first obj.
        obj = this._objectAt(0,obj) ;
        value = (obj.get) ? obj.get(key) : obj[key] ;
      }
      else
      {
        // if content is empty array, act as if null.
        value = null;
      }
    }
    else
    {
      // content is a single item. Just get the property.
      value = (obj.get) ? obj.get(key) : obj[key] ;
    }
    return value;
  },

  _lastPropertyRevision: 0,
  
  /** @private */
  propertyObserver: function(observer,target,key,value,propertyRevision) {
    
    // only handle property once.
    if (propertyRevision <= this._lastPropertyRevision) return ;
    this._lastPropertyRevision = propertyRevision;

    // save the bound observer.
    if (!this._boundObserver) {
      this._boundObserver = this._contentPropertyObserver.bind(this);
    }
    
    // handle changes to the content...
    if (target != this) return ;
    if ((key == 'content') && (value != this._content)) {
      var f = this._boundObserver ;
      
      if (this.get('hasChanges')) {
        // if we have uncommitted changes, then discard the changes or raise
        // an exception.
        var er = this.discardChanges() ;
        if (!$ok(er)) throw(er) ;
      } else {
        // no changes, but we want to ensure that we flush the cache 
        // of any SC.Controllers we have for the content
        this._valueControllers = {} ;
      }
      
      // stop listening to old content.
      if (this._content) {
        var objects = Array.from(this._content) ;
        var loc = objects.length ;
        while(--loc >= 0) {
          var obj = objects[loc] ;
          if (obj && obj.removeObserver) obj.removeObserver('*', f) ;
        }
      }
      
      // start listening for changes on the new content object.
      this._content = value ;
      if (this._content) {
        var objects = Array.from(this._content) ;
        var loc = objects.length ;
        while(--loc >= 0) {
          var obj = objects[loc] ;
          if (obj && obj.addObserver) obj.addObserver('*', f) ;
        }
      }

      // determine the content type.
      var count = 0 ;
      if (this._content) {
        count = (this._isArray(this._content)) ? this._lengthFor(this._content) : 1 ;
      } ;
      
      this.beginPropertyChanges() ;
      this.set('hasNoContent',count == 0) ;
      this.set('hasSingleContent',count == 1) ;
      this.set('hasMultipleContent',count > 1) ;

      // notify everyone that everything is different now.
      this.allPropertiesDidChange() ;
      this.endPropertyChanges() ;
    }
  },
  
  // invoked when properties on the content object change.  Just forward
  // to controller.
  _contentPropertyObserver: function(target,key,value) {
    this._changeFromContent = true ;
    if (key == '*') {
      this.allPropertiesDidChange() ;
    } else {
      this.propertyWillChange(key) ;
      this.propertyDidChange(key,value) ;
    }
    this._changeFromContent = false ;
  },
  
  _lengthFor: function(obj) {
    return ((obj.get) ? obj.get('length') : obj.length) || 0;
  },
  
  _objectAt: function(idx, obj) {
    return (obj.objectAt) ? obj.objectAt(idx) : ((obj.get) ? obj.get(idx) : obj[idx]) ;
  },
  
  _isArray: function(obj) {
    return ($type(obj) == T_ARRAY) || (obj && obj.objectAt) ;
  }
    
}) ;


/* End ------------------------------------------------------- controllers/object.js*/

