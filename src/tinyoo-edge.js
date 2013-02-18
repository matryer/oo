// reset makes the initial oo object.
var ooreset = function() {
  var oo = {

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
        //console.info(className + " exists.")
        throw new oo.DuplicateClassNameException(className);
        return null;
      }
      // </debug>

      // make the class thing
      var klass = function(){

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

      // handle bass classes and mixins
      for (var i = 1, l = arguments.length - 1; i < l; i++) {

        var item = arguments[i];

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

      }

      // setup the definition
      if (arguments.length > 1) {
        ooextend(arguments[arguments.length-1], klass.prototype);
      }

      // set a nice toString for lovely debugging
      klass.toString = function(){ return "<{ oo.Class: " + this.$className + " }>"; };

      // this is an OO class
      klass.$isClass = true;

      // save the constructor and 'kind' property
      klass.prototype.constructor = klass.prototype.$class = klass;

      // set the class name
      oo.classes[oo.classes.length] = klass.$className = className;

      // add the class to the classmap and return the class
      return oo.classesmap[className] = klass;

    }

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
      return "<{ oo.Exception: \" + message + \" }>";
    }
  });

  // DuplicateClassNameException 
  oo.DuplicateClassNameException = oo.Class("oo.DuplicateClassNameException", oo.Exception, {
    init: function(className) {
      // TODO: call base class
      "Cannot define a class because '" + className + "' already exists."
    }
  });

  return oo;
};

// ooextend simply copies properties from source into
// destiantion.
var ooextend = function(source, destination){
  for (var s in source) {
    destination[s] = source[s];
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