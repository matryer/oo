/*

  oo
  v1.3
  github.com/stretchr/oo

  The worlds simplest JavaScript OO implementation.
  For if you just need cool classes, and nothing else.

  Copyright (c) 2013 Mat Ryer
  Please consider promoting this project if you find it useful.
  Be sure to check out the Licence: https://github.com/stretchr/oo#licence

  ---

  Usage:

      var GreeterClass = oo.Class("GreeterClass", oo.Events, oo.Properties, {

        properties: ["name"],

        init: function(name) {
          this.setName(name);
        },

        sayHello: function() {
          alert("Hello " + this.name());
        }

      });

      var greeter = new GreeterClass("Mat");
      greeter.sayHello();
      // alerts "Hello Mat"

      greeter.nameChanged(function(oldName, newName){
        alert("Your name was " + oldName + ", but is now " + newName + ".");
      });

      greeter.setName("Tyler");
      // alerts "Your name was Mat, but is now Tyler."

      greeter.sayHello();
      // alerts "Hello Tyler"

*/

// ooreset makes the initial oo object.
//
// This can be useful for testing:
//
//     oo = ooreset();
//
var ooreset = function() {
  var oo = {

    // the oo version number
    version: "1.3",

    // oo.classes holds an array of all known class names.
    classes: [],

    // classesmap holds a map of the class name to the object.
    classesmap: {},

    /*
      oo.Class defines a new class.

      USAGE:
      oo.Class(className, [base-class,] [mix-ins...,] definition)

      className = A string name of the class.
      base-class = (optional) Another oo.Class from which to inherit.
      mix-ins = (optional) None or many other things to mix in.
      definition = The definition of the class.
    */
    Class: function(className) {

      // <debug>
      // ensure this is a unique class name
      if (oo.classesmap[className]) {
        throw new oo.DuplicateClassNameException(className);
        return null;
      }
      // </debug>

      // make the class thing
      var klass = function(){

        if (!this.$initialiseBases) {
          throw new oo.IncorrectSyntaxException(className);
        }

        // initialise bases
        this.$initialiseBases.apply(this);

        // call the constructor
        this.init.apply(this, arguments);

      };

      // default constructor
      klass.prototype.init = function(){};

      // keep track of base classes
      klass.$bases = {};

      // initialiseBases ensures all base methods are bound to
      // the correct context to allow the myInstance.BaseClass.baseMethod() format.
      klass.prototype.$initialiseBases = function(){
        for (var baseName in this.$class.$bases) {
          var basePrototype = this.$class.$bases[baseName];
          for (var baseProperty in basePrototype.prototype) {
            if (typeof basePrototype.prototype[baseProperty] == "function") {
              if (baseProperty.substr(0, 1) != "$") {
                basePrototype.prototype[baseProperty] = basePrototype.prototype[baseProperty].bind(this);
              }
            }
          }
        }

      };

      var afterClassDefinedList = [];

      // handle bass classes and mixins
      for (var i = 1, l = arguments.length - 1; i < l; i++) {

        var item = arguments[i];

        if (item) {

          // handle $beforeInherited method
          if (item.$beforeInherited) {
            item = item.$beforeInherited(klass, arguments);
          }

          // skip if we have nothing
          if (!item) continue;

          // is this a base class?
          if (item.$isClass) {

            // add it to the bases
            klass.$bases[item.$className] = item;

            // write the base properties by default
            ooextend(item.prototype, klass.prototype);

            // save the class.BaseClass object
            klass.prototype[item.$className] = item.prototype;

          } else if (typeof item == "object") {

            // mix in

            ooextend(item, klass.prototype);

          }

          // handle the $afterInherited method
          if (item.$afterInherited) {
            item.$afterInherited(klass, arguments);
          }

          // handle the $afterInherited method
          if (item.$afterClassDefined) {
            afterClassDefinedList.push(item.$afterClassDefined.bind(item, klass, arguments))
          }

        } else {
          oowarn("Failed to inherit " + item + " when building " + className + " class.");
        }

      }

      // setup the definition
      if (arguments.length > 1) {

        var definition = arguments[arguments.length-1];
        for (var property in definition) {

          // get the property
          var theProperty = definition[property];

          // is this a class or instance item?
          if (property.substr(0, 1) === "$") {

            klass[property] = theProperty;

          } else {

            klass.prototype[property] = theProperty;

          }

        }

      }

      // set a nice toString for lovely debugging
      klass.toString = function(){ return "<{ oo.Class: " + this.$className + " }>"; };

      // this is an OO class
      klass.$isClass = true;

      // save the constructor and 'kind' property
      klass.prototype.constructor = klass.prototype.$class = klass;

      // set the class name
      oo.classes[oo.classes.length] = klass.$className = className;

      // add the class to the classmap
      oo.classesmap[className] = klass;

      // call any $afterClassDefined functions
      if (afterClassDefinedList.length > 0) {
        for (var i in afterClassDefinedList) {
          afterClassDefinedList[i]();
        }
      }

      // and return the class
      return klass;

    }

  };

  /*
    oo Events
  */
  // oo.Events mix in adds event support to objects.
  oo.Events = {

    $addEvent: function(target, event) {

      target[event] = (function(){

        var $event = event;

        return function(){

          // just one argument?
          if (arguments.length === 1 && typeof arguments[0] == "function") {

            // add callback
            var args = [$event, arguments[0]];
            this.on.apply(this, args);

          } else {

            // fire event
            var args = [$event]; ooextend(arguments, args);
            this.fire.apply(this, args);

          }

          // chain
          return this;

        }
      })();

    },

    $afterClassDefined: function(klass){

      // add events to the class itself
      klass.on = oo.Events.on;
      klass.fire = oo.Events.fire;
      klass.fireWith = oo.Events.fireWith;
      klass.removeCallback = oo.Events.removeCallback;

      // are there any explicit events specified in the
      // events array?
      if (klass.prototype.events) {

        for (var i in klass.prototype.events) {

          // get the event key
          var event = klass.prototype.events[i];

          // add shortcut method
          oo.Events.$addEvent(klass.prototype, event);

        }

      }

    },

    // on adds a callback for the specified event.
    on: function(event, callback) {
      this.ooevents = this.ooevents || {};
      this.ooevents[event] = this.ooevents[event] || [];
      this.ooevents[event].push(callback);
      return this;
    },

    // fire calls all callbacks that are registered with
    // the specified event.
    //
    // Additionally, matching callbacks inside scopedCallbacks
    // will also be triggered.
    //
    // Any arguments after the scopedCallbacks will be passed to
    // each callback.
    fireWith: function(event, scopedCallbacks /*, arguments... */) {

      // get args minus the event name and scopedCallbacks
      var args = [];
      var classArgs = [event, this];
      for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
        classArgs.push(arguments[i]);
      }

      // handle events on the class if applicable
      if (this.$class && this.$class.ooevents && this.$class.ooevents[event]) {
        this.$class.fire.apply(this.$class, classArgs);
      }

      // collect all callbacks
      var callbacks = [];
      if (this.ooevents && this.ooevents[event]) {
        callbacks = this.ooevents[event];
      }
      // add the scoped callback (if there is one)
      if (scopedCallbacks && scopedCallbacks[event]) {
        callbacks.push(scopedCallbacks[event]);
      }

      // handle events on this instance
      if (callbacks.length > 0) {
        // call each callback
        for (var i in callbacks) {
          var func = callbacks[i];
          var result = func.apply(this, args);
          if (result === false) { return false; } // break early?
        }
      }

    },

    // fire calls all callbacks that are registered with
    // the specified event.
    fire: function(event /*, arguments... */) {

      // get the args
      var args = [event, null];

      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      return this.fireWith.apply(this, args);

    },

    // removeCallback removes the callback registered to
    // the specified event.  Returns true if the remove was
    // successful, otherwise false if nothing was done.
    removeCallback: function(event, callback) {
      if (this.ooevents && this.ooevents[event]) {
        // find the callback
        for (var i in this.ooevents[event]) {
          var func = this.ooevents[event][i];
          if (func == callback) {
            this.ooevents[event].splice(i,1);
            return true;
          }
        }
      }
      return false;
    },

    // withEvent calls 'before'+event and event
    // before and after executing the code block.
    //
    // If the before handler returns false, the codeblock is
    // never called.
    //
    // The return of withEvent will be the return from the
    // codeblock.
    withEvent: function(event) {

      // get the codeblock
      var codeblock = arguments[arguments.length-1];

      // make sure the last argument is a function
      if (typeof codeblock !== "function") {
        throw new oo.IncorrectArgumentsException("withEvent", "The last argument must be the codeblock to execute.");
      }

      // collect the arguments
      var args = [];
      for (var i = 1; i < arguments.length-1; i++) {
        args.push(arguments[i]);
      }

      // add the event name as the first argument
      args.unshift("before:" + event);

      // call before event
      var result = this.fire.apply(this, args);

      if (result === false) {
        // abort
        return false;
      }

      // run the code
      result = codeblock();

      // add the result to the end of the argument list
      args.push(result);

      // update the event name argument
      args[0] = event;

      // call after event
      this.fire.apply(this, args);

      // return the result
      return result;

    }

  };

  /*
    oo.Properties
  */
  // oo.Properties mixin adds property support to classes.
  oo.Properties = {

    $afterClassDefined: function(klass){

      if (klass.prototype.properties && typeof klass.prototype.properties.length != "undefined") {
        // array
        for (var prop in klass.prototype.properties) {
          // add this property
          oo.Properties.$addProperty(klass.prototype, klass.prototype.properties[prop], true, true, null);
        }
      } else if (klass.prototype.properties) {
        // object
        for (var prop in klass.prototype.properties) {
          // add this property
          oo.Properties.$addProperty(klass.prototype, prop, true, true, klass.prototype.properties[prop]);
        }
      }
      if (klass.prototype.getters && typeof klass.prototype.getters.length != "undefined") {
        // array
        for (var prop in klass.prototype.getters) {
          // add this property
          oo.Properties.$addProperty(klass.prototype, klass.prototype.getters[prop], true, false, null);
        }
      } else if (klass.prototype.getters) {
        // object
        for (var prop in klass.prototype.getters) {
          // add this property
          oo.Properties.$addProperty(klass.prototype, prop, true, false, klass.prototype.getters[prop]);
        }
      }
      if (klass.prototype.setters && typeof klass.prototype.setters.length != "undefined") {
        // array
        for (var prop in klass.prototype.setters) {
          // add this property
          oo.Properties.$addProperty(klass.prototype, klass.prototype.setters[prop], false, true, null);
        }
      } else if (klass.prototype.setters) {
        // object
        for (var prop in klass.prototype.setters) {
          // add this property
          oo.Properties.$addProperty(klass.prototype, prop, false, true, klass.prototype.setters[prop]);
        }
      }

    },

    addProperty: function() {

      // add the target
      var args = [this];
      for (var arg in arguments) {
        args.push(arguments[arg]);
      }

      oo.Properties.$addProperty.apply(this, args);

      return this;

    }

  };

  // addProperty adds a property to the specified target (along with
  // appropriate helper functions if needed).
  //
  // addProperty(target, name, getter, setter)
  //
  // {target} - The object to add the property to
  // {name} - The name of the property
  // {getter} - true|false or name of getter function
  // {setter} - true|false or name of setter function
  // {optionalDefault} - (optional) The starting value of the property.
  oo.Properties.$addProperty = function(target, name, getter, setter, optionalDefault) {

    // events?
    if (target.on) {

      // ensure we have the generic property event
      if (!target.propertyChanged) {
        oo.Events.$addEvent(target, "propertyChanged");
      }

      // add the event for this property
      oo.Events.$addEvent(target, name + "Changed");

    }

    var getterName = name;
    var setterName;

    // getPropertyInternalName method
    target.getPropertyInternalName = target.getPropertyInternalName || function(name){
      return "_"+name;
    };
    var internalName = target.getPropertyInternalName(name);

    // setProperty method
    target.setProperty = target.setProperty || function(key, value){

      if (this.withEvent) {

        this.withEvent("propertyChanged", name, this[internalName], value, function(){
          this.withEvent(key + "Changed", this[internalName], value, function(){
            this[this.getPropertyInternalName(key)] = value;
          }.bind(this));
        }.bind(this));

      } else {
        // just set it (no events)
        this[this.getPropertyInternalName(key)] = value;
      }

      return this;
    };

    // getProperty method
    target.getProperty = target.getProperty || function(key){
      return this[this.getPropertyInternalName(key)];
    };

    // initialise the space to hold the property value
    target[internalName] = optionalDefault || null;

    // setter
    if (setter !== false) {

      if (setter === true) {
        setterName = "set" + name.charAt(0).toUpperCase() + name.slice(1);;
      } else {
        setterName = setter;
      }

      target[setterName] = target[setterName] || function(value){
        this.setProperty(name, value);
        return this;
      }

    }

    // getter
    if (getter !== false) {

      if (getter !== true) {
        getterName = getter;
      }

      target[getterName] = target[getterName] || function() {
        return this.getProperty(name);
      }

    }

    return target; // chain

  };

  /*
    oo Exceptions
  */

  // oo.Exception is the root exception class.
  oo.Exception = oo.Class("oo.Exception", {
    init: function(message){
      this.message = message;
    },
    toString: function(){
      return "oo.Exception: \" + message + \"";
    }
  });

  // DuplicateClassNameException
  oo.DuplicateClassNameException = oo.Class("oo.DuplicateClassNameException", oo.Exception, {
    init: function(className) {
      this["oo.Exception"].init("Cannot define a class because '" + className + "' already exists, consider namespacing your class names; e.g. YourCompany." + className);
    }
  });

  // IncorrectSyntaxException
  oo.IncorrectSyntaxException = oo.Class("oo.IncorrectSyntaxException", oo.Exception, {
    init: function(className) {
      this["oo.Exception"].init("Incorrect syntax when creating a new instance; don't just call the method, use the new keyword: var obj = new " + className + "();");
    }
  });

  // IncorrectArgumentsException
  oo.IncorrectArgumentsException = oo.Class("oo.IncorrectArgumentsException", oo.Exception, {
    init: function(methodName, message) {
      this["oo.Exception"].init("Incorrect syntax when calling " + methodName + "; " + message);
    }
  });

  return oo;
};

// oowarn writes a warning to the console.
var oowarn = function(msg) {
  if (console) {
    if (console.warn) {
      console.warn(msg);
    }
  }
};

// ooextend simply copies properties from source into
// destiantion.
var ooextend = function(source, destination) {

  // is this an array?
  if (typeof source.length != "undefined" && typeof destination.length != "undefined") {
    // array
    for (var s in source) {
      destination.push(source[s]);
    }
  } else {
    // objects
    for (var s in source) {
      destination[s] = source[s];
    }
  }

};

// setup the initial oo object
var oo = ooreset();

/*
 *  oobind
 *  Binds context and arguments to a function
 *
 *  oobind(function, context [, argument1 [, argument2]]);
 *  or
 *  function.bind(function, context [, argument1 [, argument2]]);
 */
var oobind = function() {

        var

                _func = arguments[0] || null,
                _obj = arguments[1] || this,
                _args = [],

                i = 2,
                l = arguments.length,

                bound

        ;

        // add arguments
        for (; i<l; i++) {
                _args.push(arguments[i]);
        }

        // return a new function that wraps everything up
        bound = function() {

                // start an array to get the args
                var theArgs = [];
                var i = 0;

                // add every argument from _args
                for (i = 0, l = _args.length; i < l; i++) {
                        theArgs.push(_args[i]);
                }

                // add any real arguments passed
                for (i = 0, l = arguments.length; i < l; i++) {
                        theArgs.push(arguments[i]);
                }

                // call the function with the specified context and arguments
                return _func.apply(_obj, theArgs);

        };

        bound.func = _func;
        bound.context = _obj;
        bound.args = _args;

        return bound;

};

/*
 *  instance shortcut version...
 */
Function.prototype.bind = function(){

        var theArgs = [], i = 0, l = arguments.length;

        // add the function
        theArgs.push(this);

        // add any real arguments passed
        for (; i < l; i++) {
                theArgs.push(arguments[i]);
        }

        return oobind.apply(window, theArgs);

};
