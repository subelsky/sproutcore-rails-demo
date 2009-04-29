/* Start ----------------------------------------------------- mixins/enumerable.js*/

// ==========================================================================
// SproutCore -- JavaScript Application Framework
// copyright 2006-2008, Sprout Systems, Inc. and contributors.
// ==========================================================================

require('core') ;

/**
  @namespace

  This mixin defines the common interface implemented by enumerable objects 
  in SproutCore.  Most of these methods follow the standard Array iteration
  API defined up to JavaScript 1.8 (excluding language-specific features that
  cannot be emulated in older versions of JavaScript).
  
  This mixin is applied automatically to the Array class on page load, so you
  can use any of these methods on simple arrays.  If Array already implements
  one of these methods, the mixin will not override them.
  
  h3. Writing Your Own Enumerable

  To make your own custom class enumerable, you need two items:
  
  1. You must have a length property.  This property should change whenever
     the number of items in your enumerable object changes.  If you using this
     with an SC.Object subclass, you should be sure to change the length 
     property using set().
     
  2. If you must implement nextObject().  See documentation.
    
  Once you have these two methods implement, apply the SC.Enumerable mixin
  to your class and you will be able to enumerate the contents of your object
  like any other collection.
  
  h3. Using SproutCore Enumeration with Other Libraries
  
  Many other libraries provide some kind of iterator or enumeration like
  facility.  This is often where the most common API conflicts occur. 
  SproutCore's API is designed to be as friendly as possible with other 
  libraries by implementing only methods that mostly correspond to the
  JavaScript 1.8 API.  
  
  @static
  @since SproutCore 1.0
*/
SC.Enumerable = {

  /**
    Implement this method to make your class enumerable.
    
    This method will be call repeatedly during enumeration.  The index value
    will always begin with 0 and increment monotonically.  You don't have to
    rely on the index value to determine what object to return, but you should
    always check the value and start from the beginning when you see the
    requested index is 0.
    
    The previousObject is the object that was returned from the last call
    to nextObject for the current iteration.  This is a useful way to 
    manage iteration if you are tracing a linked list, for example.
    
    Finally the context paramter will always contain a hash you can use as 
    a "scratchpad" to maintain any other state you need in order to iterate
    properly.  The context object is reused and is not reset between 
    iterations so make sure you setup the context with a fresh state whenever
    the index parameter is 0.
    
    Generally iterators will continue to call nextObject until the index
    reaches the your current length-1.  If you run out of data before this 
    time for some reason, you should simply return undefined.
    
    The default impementation of this method simply looks up the index.
    This works great on any Array-like objects.
    
    @param index {Number} the current index of the iteration
    @param previousObject {Object} the value returned by the last call to nextObject.
    @param context {Object} a context object you can use to maintain state.
    @returns {Object} the next object in the iteration or undefined   
  */ 
  nextObject: function(index, previousObject, context) {
    return (this.objectAt) ? this.objectAt(index) : this[index] ;
  },
  
  /**
    Returns a new enumerator for this object.  See SC.Enumerator for
    documentation on how to use this object.  Enumeration is an alternative
    to using one of the other iterators described here.
    
    @returns {SC.Enumerator} an enumerator for the receiver
  */
  enumerator: function() { return SC.Enumerator.create(this); },
  
  /**
    Iterates through the enumerable, calling the passed function on each
    item.  This method corresponds to the forEach() method defined in 
    JavaScript 1.6.
    
    The callback method you provide should have the following signature (all
    parameters are optional):
    
    {{{
      function(item, index, enumerable) ;      
    }}}
    
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.
    
    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context.  This is a good way
    to give your iterator function access to the current object.
    
    @params callback {Function} the callback to execute
    @params target {Object} the target object to use
    @returns {Object} this
  */
  forEach: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = (this.get) ? this.get('length') : this.length ;
    if (target === undefined) target = null;
    
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      callback.call(target, next, idx, this);
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return this ;
  },
  
  /**
    Maps all of the items in the enumeration to another value, returning 
    a new array.  This method corresponds to map() defined in JavaScript 1.6.
    
    The callback method you provide should have the following signature (all
    parameters are optional):
    
    {{{
      function(item, index, enumerable) ;      
    }}}
    
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.
    
    It should return the mapped value.
    
    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context.  This is a good way
    to give your iterator function access to the current object.
    
    @params callback {Function} the callback to execute
    @params target {Object} the target object to use
    @returns {Array} The mapped array.
  */
  map: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = (this.get) ? this.get('length') : this.length ;
    if (target === undefined) target = null;
    
    var ret  = [];
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      ret[idx] = callback.call(target, next, idx, this) ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },

  /**
    Similar to map, this specialized function returns the value of the named
    property on all items in the enumeration.
    
    @params key {String} name of the property
    @returns {Array} The mapped array.
  */
  mapProperty: function(key) {
    var len = (this.get) ? this.get('length') : this.length ;
    var ret  = [];
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      ret[idx] = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },

  /**
    Returns an array with all of the items in the enumeration that the passed
    function returns YES for. This method corresponds to filter() defined in 
    JavaScript 1.6.
    
    The callback method you provide should have the following signature (all
    parameters are optional):
    
    {{{
      function(item, index, enumerable) ;      
    }}}
    
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.
    
    It should return the YES to include the item in the results, NO otherwise.
    
    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context.  This is a good way
    to give your iterator function access to the current object.
    
    @params callback {Function} the callback to execute
    @params target {Object} the target object to use
    @returns {Array} A filtered array.
  */
  filter: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = (this.get) ? this.get('length') : this.length ;
    if (target === undefined) target = null;
    
    var ret  = [];
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      if(callback.call(target, next, idx, this)) ret.push(next) ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },

  /**
    Returns an array with just the items with the matched property.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.
    
    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  filterProperty: function(key, value) {
    var len = (this.get) ? this.get('length') : this.length ;
    var ret  = [];
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      var cur = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
      var matched = (value === undefined) ? !!cur : SC.isEqual(cur, value);
      if (matched) ret.push(next) ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },
    
  /**
    Returns YES if the passed function returns YES for every item in the
    enumeration.  This corresponds with the every() method in JavaScript 1.6.
    
    The callback method you provide should have the following signature (all
    parameters are optional):
    
    {{{
      function(item, index, enumerable) ;      
    }}}
    
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.
    
    It should return the YES or NO.
    
    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context.  This is a good way
    to give your iterator function access to the current object.
    
    h4. Example Usage
    
    {{{
      if (people.every(isEngineer)) { Paychecks.addBigBonus(); }
    }}}
    
    @params callback {Function} the callback to execute
    @params target {Object} the target object to use
    @returns {Boolean} 
  */
  every: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = (this.get) ? this.get('length') : this.length ;
    if (target === undefined) target = null;
    
    var ret  = YES;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;ret && (idx<len);idx++) {
      var next = this.nextObject(idx, last, context) ;
      if(!callback.call(target, next, idx, this)) ret = NO ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },

  /**
    Returns YES if the passed property resolves to true for all items in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  everyProperty: function(key, value) {
    var len = (this.get) ? this.get('length') : this.length ;
    var ret  = YES;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;ret && (idx<len);idx++) {
      var next = this.nextObject(idx, last, context) ;
      var cur = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
      ret = (value === undefined) ? !!cur : SC.isEqual(cur, value);
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },
  
  
  /**
    Returns YES if the passed function returns true for any item in the 
    enumeration. This corresponds with the every() method in JavaScript 1.6.
    
    The callback method you provide should have the following signature (all
    parameters are optional):
    
    {{{
      function(item, index, enumerable) ;      
    }}}
    
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.
    
    It should return the YES to include the item in the results, NO otherwise.
    
    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context.  This is a good way
    to give your iterator function access to the current object.
    
    h4. Usage Example
    
    {{{
      if (people.some(isManager)) { Paychecks.addBiggerBonus(); }
    }}}
    
    @params callback {Function} the callback to execute
    @params target {Object} the target object to use
    @returns {Array} A filtered array.
  */
  some: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = (this.get) ? this.get('length') : this.length ;
    if (target === undefined) target = null;
    
    var ret  = NO;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;(!ret) && (idx<len);idx++) {
      var next = this.nextObject(idx, last, context) ;
      if(callback.call(target, next, idx, this)) ret = YES ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },

  /**
    Returns YES if the passed property resolves to true for any item in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Boolean} YES 
  */
  someProperty: function(key, value) {
    var len = (this.get) ? this.get('length') : this.length ;
    var ret  = NO;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0; !ret && (idx<len); idx++) {
      var next = this.nextObject(idx, last, context) ;
      var cur = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
      ret = (value === undefined) ? !!cur : SC.isEqual(cur, value);
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;  // return the invert
  },

  /**
    This will combine the values of the enumerator into a single value. It 
    is a useful way to collect a summary value from an enumeration.  This
    corresponds to the reduce() method defined in JavaScript 1.8.
    
    The callback method you provide should have the following signature (all
    parameters are optional):
    
    {{{
      function(previousValue, item, index, enumerable) ;      
    }}}
    
    - *previousValue* is the value returned by the last call to the iterator.
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Return the new cumulative value.

    In addition to the callback you can also pass an initialValue.  An error
    will be raised if you do not pass an initial value and the enumerator is
    empty.

    Note that unlike the other methods, this method does not allow you to 
    pass a target object to set as this for the callback.  It's part of the
    spec. Sorry.
    
    @params callback {Function} the callback to execute
    @params initialValue {Object} initial value for the reduce
    @params reducerProperty {String} internal use only.  May not be available.
    @returns {Array} A filtered array.
  */
  reduce: function(callback, initialValue, reducerProperty) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = (this.get) ? this.get('length') : this.length ;

    // no value to return if no initial value & empty
    if (len===0 && initialValue === undefined) throw new TypeError();
    
    var ret  = initialValue;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      
      // while ret is still undefined, just set the first value we get as ret.
      // this is not the ideal behavior actually but it matches the FireFox
      // implementation... :(
      if (next != null) {
        if (ret === undefined) {
          ret = next ;
        } else {
          ret = callback.call(null, ret, next, idx, this, reducerProperty);
        }
      }
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    
    // uh oh...we never found a value!
    if (ret === undefined) throw new TypeError() ;
    return ret ;
  },
  
  /**
    Invokes the named method on every object in the receiver that
    implements it.  This method corresponds to the implementation in
    Prototype 1.6.
    
    @param methodName {String} the name of the method
    @param args {Object...} optional arguments to pass as well.
    @returns {Array} return values from calling invoke.
  */
  invoke: function(methodName) {
    var len = (this.get) ? this.get('length') : this.length ;
    if (len <= 0) return [] ; // nothing to invoke....

    // collect the arguments
    var args = [] ;
    var alen = arguments.length ;
    if (alen > 1) {
      for(var idx=1;idx<alen;idx++) args.push(arguments[idx]) ;
    }
    
    // call invoke
    var ret = [] ;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      var method = (next) ? next[methodName] : null ;
      if (method) ret[idx] = method.apply(next, args) ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },

  /**
    Invokes the passed method and optional arguments on the receiver elements
    as long as the methods return value matches the target value.  This is 
    a useful way to attempt to apply changes to a collection of objects unless
    or until one fails.

    @param targetValue {Object} the target return value
    @param methodName {String} the name of the method
    @param args {Object...} optional arguments to pass as well.
    @returns {Array} return values from calling invoke.
  */
  invokeWhile: function(targetValue, methodName) {
    var len = (this.get) ? this.get('length') : this.length ;
    if (len <= 0) return null; // nothing to invoke....

    // collect the arguments
    var args = [] ;
    var alen = arguments.length ;
    if (alen > 2) {
      for(var idx=2;idx<alen;idx++) args.push(arguments[idx]) ;
    }
    
    // call invoke
    var ret = targetValue ;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;(ret === targetValue) && (idx<len);idx++) {
      var next = this.nextObject(idx, last, context) ;
      var method = (next) ? next[methodName] : null ;
      if (method) ret = method.apply(next, args) ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  },
  
  /**
    Simply converts the enumerable into a genuine array.  The order, of
    course, is not gauranteed.  Corresponds to the method implemented by 
    Prototype.
    
    You can also call Array.from().
    
    @returns {Array} the enumerable as an array.
  */
  toArray: function() {
    var len = (this.get) ? this.get('length') : this.length ;
    if (len <= 0) return [] ; // nothing to invoke....
    
    // call invoke
    var ret = [] ;
    var last = null ;
    var context = SC.Enumerator._popContext();
    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      ret.push(next) ;
      last = next ;
    }
    last = null ;
    context = SC.Enumerator._pushContext(context);
    return ret ;
  }        
} ;

// Build in a separate function to avoid unintential leaks through closures...
SC._buildReducerFor = function(reducerKey, reducerProperty) {
  return function(key, value) {
    var reducer = this[reducerKey] ;
    if (SC.typeOf(reducer) !== T_FUNCTION) {
      return (this.unknownProperty) ? this.unknownProperty(key, value) : null;
    } else {
      // Invoke the reduce method defined in enumerable instead of using the
      // one implemented in the receiver.  The receiver might be a native 
      // implementation that does not support reducerProperty.
      return SC.Enumerable.reduce.call(this, reducer, null, reducerProperty) ;
    }
  }.property('[]') ;
};

SC.Reducers = {
  /**
    This property will trigger anytime the enumerable's content changes.
    You can observe this property to be notified of changes to the enumerables
    content.
    
    For plain enumerables, this property is read only.  SC.Array overrides
    this method.
  */
  '[]': function(key, value) { return this ; }.property(),

  /**
    Invoke this method when the contents of your enumerable has changed.
    This will notify any observers watching for content changes.
  */
  enumerableContentDidChange: function() {
    this.notifyPropertyChange('[]') ;
    if (this.ownerRecord && this.ownerRecord.recordDidChange) {
      this.ownerRecord.recordDidChange(this) ;
    }
  },
  
  /**
    Call this method from your unknownProperty() handler to implement 
    automatic reduced properties.  A reduced property is a property that 
    collects its contents dynamically from your array contents.  Reduced 
    properties always begin with "@".  Getting this property will call 
    reduce() on your array with the function matching the key name as the
    processor.
    
    The return value of this will be either the return value from the 
    reduced property or undefined, which means this key is not a reduced 
    property.  You can call this at the top of your unknownProperty handler
    like so:
    
    {{{
      unknownProperty: function(key, value) {
        var ret = this.handleReduceProperty(key, value) ;
        if (ret === undefined) {
          // process like normal
        }
      }
    }}}
     
    @param key {String} the reduce property key
    @param value {Object} a value or undefined.
    @param generateProperty {Boolean} only set to false if you do not want an
      optimized computed property handler generated for this.  Not common.
    @returns {Object} the reduced property or undefined
  */
  reducedProperty: function(key, value, generateProperty) {
     
    if (key[0] !== '@') return undefined ; // not a reduced property
    
    // get the reducer key and the reducer
    var matches = key.match(/^@([^(]*)(\(([^)]*)\))?$/) ;
    if (!matches || matches.length < 2) return undefined ; // no match
    
    var reducerKey = matches[1]; // = 'max' if key = '@max(balance)'
    var reducerProperty = matches[3] ; // = 'balance' if key = '@max(balance)'
    var reducerKey = "reduce%@".fmt(reducerKey.capitalize()) ; 
    var reducer = this[reducerKey] ;

    // if there is no reduce function defined for this key, then we can't 
    // build a reducer for it.
    if (SC.typeOf(reducer) !== T_FUNCTION) return undefined;
    
    // if we can't generate the property, just run reduce
    if (generateProperty === NO) {
      return SC.Enumerable.reduce.call(this, reducer, null, reducerProperty) ;
    }

    // ok, found the reducer.  Let's build the computed property and install
    var func = SC._buildReducerFor(reducerKey, reducerProperty);
    var p = (this._type) ? this._type : this.constructor.prototype ;
    
    if (p) {
      p[key] = func ;
      this.registerDependentKey(key, '[]') ;
    }
    
    // and reduce anyway...
    return SC.Enumerable.reduce.call(this, reducer, null, reducerProperty) ;
  },
  
  /** 
    Reducer for @max reduced property.
  */
  reduceMax: function(previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = (item.get) ? item.get(reducerProperty) : item[reducerProperty];
    }
    if (previousValue == null) return item ;
    return (item > previousValue) ? item : previousValue ;
  },

  /** 
    Reducer for @maxObject reduced property.
  */
  reduceMaxObject: function(previousItem, item, index, e, reducerProperty) {
    
    // get the value for both the previous and current item.  If no
    // reducerProperty was supplied, use the items themselves.
    var previousValue = previousItem, itemValue = item ;
    if (reducerProperty) {
      if (item) {
        itemValue = (item.get) ? item.get(reducerProperty) : item[reducerProperty] ;
      }
      
      if (previousItem) {
        previousItemValue = (previousItem.get) ? previousItem.get(reducerProperty) : previousItem[reducerProperty] ;
      }
    }
    if (previousValue == null) return item ;
    return (itemValue > previousValue) ? item : previousItem ;
  },

  /** 
    Reducer for @min reduced property.
  */
  reduceMin: function(previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = (item.get) ? item.get(reducerProperty) : item[reducerProperty];
    }
    if (previousValue == null) return item ;
    return (item < previousValue) ? item : previousValue ;
  },

  /** 
    Reducer for @maxObject reduced property.
  */
  reduceMinObject: function(previousItem, item, index, e, reducerProperty) {

    // get the value for both the previous and current item.  If no
    // reducerProperty was supplied, use the items themselves.
    var previousValue = previousItem, itemValue = item ;
    if (reducerProperty) {
      if (item) {
        itemValue = (item.get) ? item.get(reducerProperty) : item[reducerProperty] ;
      }
      
      if (previousItem) {
        previousItemValue = (previousItem.get) ? previousItem.get(reducerProperty) : previousItem[reducerProperty] ;
      }
    }
    if (previousValue == null) return item ;
    return (itemValue < previousValue) ? item : previousItem ;
  },

  /** 
    Reducer for @average reduced property.
  */
  reduceAverage: function(previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = (item.get) ? item.get(reducerProperty) : item[reducerProperty];
    }
    var ret = (previousValue || 0) + item ;
    var len = (e.get) ? e.get('length') : e.length;
    if (index >= len-1) ret = ret / len; //avg after last item.
    return ret ; 
  },

  /** 
    Reducer for @sum reduced property.
  */
  reduceSum: function(previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = (item.get) ? item.get(reducerProperty) : item[reducerProperty];
    }
    return (previousValue == null) ? item : previousValue + item ;
  }
} ;

// Apply reducers...
SC.mixin(SC.Enumerable, SC.Reducers) ;
SC.mixin(Array.prototype, SC.Reducers) ;

// ......................................................
// ARRAY SUPPORT
//

// Implement the same enhancements on Array.  We use specialized methods
// because working with arrays are so common.
(function() {
  
  // These methods will be applied even if they already exist b/c we do it
  // better.
  var alwaysMixin = {
    
    // this is supported so you can get an enumerator.  The rest of the
    // methods do not use this just to squeeze every last ounce of perf as
    // possible.
    nextObject: SC.Enumerable.nextObject,
    enumerator: SC.Enumerable.enumerator,

    // see above...
    mapProperty: function(key) {
      var len = this.length ;
      var ret  = [];
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        ret[idx] = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
      }
      return ret ;
    },

    filterProperty: function(key, value) {
      var len = this.length ;
      var ret  = [];
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        var cur = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
        var matched = (value === undefined) ? !!cur : SC.isEqual(cur, value);
        if (matched) ret.push(next) ;
      }
      return ret ;
    },    
    
    everyProperty: function(key, value) {
      var len = this.length ;
      var ret  = YES;
      for(var idx=0;ret && (idx<len);idx++) {
        var next = this[idx] ;
        var cur = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
        ret = (value === undefined) ? !!cur : SC.isEqual(cur, value);
      }
      return ret ;
    },
    
    someProperty: function(key, value) {
      var len = this.length ;
      var ret  = NO;
      for(var idx=0; !ret && (idx<len); idx++) {
        var next = this[idx] ;
        var cur = (next) ? ((next.get) ? next.get(key) : next[key]) : null;
        ret = (value === undefined) ? !!cur : SC.isEqual(cur, value);
      }
      return ret ;  // return the invert
    },
    
    invoke: function(methodName) {
      var len = this.length ;
      if (len <= 0) return [] ; // nothing to invoke....

      // collect the arguments
      var args = [] ;
      var alen = arguments.length ;
      if (alen > 1) {
        for(var idx=1;idx<alen;idx++) args.push(arguments[idx]) ;
      }

      // call invoke
      var ret = [] ;
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        var method = (next) ? next[methodName] : null ;
        if (method) ret[idx] = method.apply(next, args) ;
      }
      return ret ;
    },

    invokeWhile: function(targetValue, methodName) {
      var len = this.length ;
      if (len <= 0) return null ; // nothing to invoke....

      // collect the arguments
      var args = [] ;
      var alen = arguments.length ;
      if (alen > 2) {
        for(var idx=2;idx<alen;idx++) args.push(arguments[idx]) ;
      }

      // call invoke
      var ret = targetValue ;
      for(var idx=0;(ret === targetValue) && (idx<len);idx++) {
        var next = this[idx] ;
        var method = (next) ? next[methodName] : null ;
        if (method) ret = method.apply(next, args) ;
      }
      return ret ;
    },

    toArray: function() {
      var len = this.length ;
      if (len <= 0) return [] ; // nothing to invoke....

      // call invoke
      var ret = [] ;
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        ret.push(next) ;
      }
      return ret ;
    }
  }; 
  
  // These methods will only be applied if they are not already defined b/c 
  // the browser is probably getting it.
  var mixinIfMissing = {

    forEach: function(callback, target) {
      if (typeof callback !== "function") throw new TypeError() ;
      var len = this.length ;
      if (target === undefined) target = null;

      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        callback.call(target, next, idx, this);
      }
      return this ;
    },

    map: function(callback, target) {
      if (typeof callback !== "function") throw new TypeError() ;
      var len = this.length ;
      if (target === undefined) target = null;

      var ret  = [];
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        ret[idx] = callback.call(target, next, idx, this) ;
      }
      return ret ;
    },

    filter: function(callback, target) {
      if (typeof callback !== "function") throw new TypeError() ;
      var len = this.length ;
      if (target === undefined) target = null;

      var ret  = [];
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;
        if(callback.call(target, next, idx, this)) ret.push(next) ;
      }
      return ret ;
    },

    every: function(callback, target) {
      if (typeof callback !== "function") throw new TypeError() ;
      var len = this.length ;
      if (target === undefined) target = null;

      var ret  = YES;
      for(var idx=0;ret && (idx<len);idx++) {
        var next = this[idx] ;
        if(!callback.call(target, next, idx, this)) ret = NO ;
      }
      return ret ;
    },

    some: function(callback, target) {
      if (typeof callback !== "function") throw new TypeError() ;
      var len = this.length ;
      if (target === undefined) target = null;

      var ret  = NO;
      for(var idx=0;(!ret) && (idx<len);idx++) {
        var next = this[idx] ;
        if(callback.call(target, next, idx, this)) ret = YES ;
      }
      return ret ;
    },

    reduce: function(callback, initialValue, reducerProperty) {
      if (typeof callback !== "function") throw new TypeError() ;
      var len = this.length ;

      // no value to return if no initial value & empty
      if (len===0 && initialValue === undefined) throw new TypeError();

      var ret  = initialValue;
      for(var idx=0;idx<len;idx++) {
        var next = this[idx] ;

        // while ret is still undefined, just set the first value we get as 
        // ret. this is not the ideal behavior actually but it matches the 
        // FireFox implementation... :(
        if (next != null) {
          if (ret === undefined) {
            ret = next ;
          } else {
            ret = callback.call(null, ret, next, idx, this, reducerProperty);
          }
        }
      }

      // uh oh...we never found a value!
      if (ret === undefined) throw new TypeError() ;
      return ret ;
    }   
  };
  
  // Apply methods if missing...
  // Also override prototype for now.  Our methods are functionally identical
  // and don't break the browsers.
  for(var key in mixinIfMissing) {
    if (!mixinIfMissing.hasOwnProperty(key)) continue ;
    if (!Array.prototype[key] || (Prototype && Prototype.Version.match(/^1\.6/))) {
      Array.prototype[key] = mixinIfMissing[key] ;
    }
  }
  
  // Apply other methods...
  SC.mixin(Array.prototype, alwaysMixin) ;
  
})() ;



/* End ------------------------------------------------------- mixins/enumerable.js*/

