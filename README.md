# oo - Objects for JavaScript

`oo` is the worlds simplest yet most powerful JavaScript OO implementation.  Extracted from [Objx JavaScript Enhancement library](http://objx.googlecode.com/).

## Features

  * [Easy class definition](#easy-class-definition)
  * Use the [`new` keyword](#use-the-new-operator) and [`this` keyword](#methods-are-just-functions-that-refer-to-this)
  * [Constructors with the `init` method](#constructors-with-the-init-method)
  * [Class and static methods](#Class-methods)
  * [Check for classes with `.$isClass` and get it with `.$class`](#Check-for-classes-with-isClass-and-get-it-with-class`)
  * [Base classes](#base-classes) and [inheritance](#advanced-inheritance)
  * [Mix-ins](#mix-ins)
  * [Special class methods](#special-class-methods) let you write advanced OO capabilities.
  * Helpful supporting methods like; [ooextend](#ooextend) and [oobind](#oobind).
  * Full test suite

## Using `oo`

In your HTML page, just include a `script` tag for the appropriate version hosted on GitHub:

#### Latest edge version

    <script src="https://raw.github.com/stretchrcom/oo/master/src/oo.js"></script>

#### Specific releases

##### v1.0

  * `<script src="https://raw.github.com/stretchrcom/oo/v0.2/src/oo.js"></script>`
  * Minified (2,162 bytes): `<script src="https://raw.github.com/stretchrcom/oo/v1.0/src/oo-min.js"></script>`

#### Other versions

If you want the features from a specific branch, navigate to the branch on https://github.com/stretchrcom/oo/branches and look for the raw file `/src/oo.js`, and set that as your `src` attribute.

#### Host it yourself

You are free to copy the source and host it on your own servers if you leave the comments in place.  See the [licence](https://github.com/stretchrcom/oo#licence) for more information.

### Change log

  * Edge - Added [special class methods](#special-class-methods)
  * v1.0 - Initial release
  * v0.2 - BETA release

## API Documentation

### Easy class definition

To define a class, just use the `oo.Class` method:

    oo.Class("{ClassName}", [BaseClasses], [Mixins], [Definition]);

  * The first argument must be the class name, usually the same name as the variable you assign it to.
  * The final argument will be the definition of the class.  It is optional but usually needed.
  * Base classes and mixins can be passed after the class name (first argument) and before the definition (final argument), and they will contribute to the blueprint of the class.

You can do this:

    var MyClass = oo.Class("MyClass", {

      getName: function(){
        return this.name;
      },

      setName: function(value) {
        this.name = value;
        return this;
      }

    });

... instead of this:

    var MyClass = function(){};
    
    MyClass.prototype.getName = function() {
      return this.name;
    }

    MyClass.prototype.setName = function(value) {
      this.name = value;
      return this;
    }

### Use the `new` operator

Like normal classes in JavaScript (and other languages), you may use the `new` keyword to instantiate your classes.

    var myInstance = new MyClass();

### Methods are just functions that refer to `this`

The `this` object is a special keyword that refers to the instance of the class in which the code is run:

    var MyClass = oo.Class("MyClass", {

      methodThatGetsTheNameField: function() {
        return this.name;
      }

    });

In the above snippet, `this` will refer to different objects depending on which one the function is called for.  In the following code, two separate instances of `MyClass` are given different `name` values, and while the same method (`methodThatGetsTheNameField`) is called, the return is different:

    var myClassInstance1 = new MyClass();
    var myClassInstance2 = new MyClass();

    myClassInstance1.name = "One";
    myClassInstance2.name = "Two";

    myClassInstance1.methodThatGetsTheNameField()
    // returns "One"

    myClassInstance2.methodThatGetsTheNameField()
    // returns "Two"

### Class methods

Methods beginning with `$` will not become instance methods (i.e. bound to instances of the class), but will become static class methods on the class itself.

    var MyClass = oo.Class("MyClass", {
      $alert: function(message){
        alert(message);
      }
    });

    MyClass.$alert("Hello");
    // alerts "Hello"

    var instance = new MyClass();
    instance.$alert(); // fails

### Constructors with the `init` method

The special `init` function will be called each time a new instance is created, and allows you to perform initialization activities for the class.

    var MyClass = oo.Class("MyClass", {
    
      init: function() {
        // set stuff up
      }

    });

### Check for classes with `.$isClass` and get it with `.$class`

To see if an object is an `oo.Class`, just do this:

    if (object.$isClass) {
      // the object IS an oo Class
    } else {
      // it is not
    }

The `.$class` field contains the class that was used to create the object.

    var MyClass1 = oo.Class("MyClass1", {
      numberOnOne: function(){ return 1; } 
    });
    var MyClass2 = oo.Class("MyClass2", {
      numberOnTwo: function(){ return 2; } 
    });
    
    function getNumber(object) {
      switch (object.$class) {
        case MyClass1:
          return object.numberOnOne();
        case MyClass2:
          return object.numberOnTwo();
      }
    }

    var i1 = new MyClass1();
    var i2 = new MyClass2();

    alert( getNumber(i1) );
    // alerts "1"

    alert( getNumber(i2) );
    // alerts "2"

You can actually create new instances of any object like this:

    var newObject = new existingObject.$class();

### Base classes

Inheritance allows you to build general functionality that can then be specialized.  For more information, see the [inheritance article on Wikipedia](http://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming).

    var BaseClass = oo.Class("BaseClass", {
      baseMethod: function() {
        return 123;
      }
    });

    var ChildClass = oo.Class("ChildClass", BaseClass, {
      childMethod: function() {
        return 456;
      }
    });

    var i = new ChildClass();

    alert( i.childMethod() );
    // alerts "456"

    alert( i.baseMethod() );
    // alerts "123"

### Mix-ins

Mix-ins are usually dumber than full base classes, but can be any kind of JavaScript object that has functions worth reusing.  In the following example, the `LovelyMethods` object is _mixed in_ to the class definition.  Notice how the `getName` method becomes available to instances of `MyClass`.

    var LovelyMethods = {

      getName: function() {
        return this.name;
      }

    };

    var MyClass = oo.Class("MyClass", LovelyMethods, {

      setName: function(n) {
        this.name = n;
      }

    });

    var i = new MyClass();
    i.setName("Mat");

    alert( i.getName() );
    // alerts "Mat"

## Advanced inheritance

### Accessing overridden base methods

If a child class overrides a method in the base class, you may still access the base class method using `instance.{BaseClassKind}.{method}` pattern.

    var BaseClass = oo.Class("BaseClass", {
      theMethod: function() {
        return "BASE method working with " + this.name;
      }
    });

    var ChildClass = oo.Class("ChildClass", BaseClass, {
      theMethod: function() {

        // call the base version
        var t = this.BaseClass.theMethod();

        // make a change
        return t.replace("BASE", "CHILD");

      }
    });

    var i = new ChildClass();

    i.name = "Mat";

    alert( i.theMethod() );
    // alerts "CHILD method working with Mat"

    alert( i.BaseClass.theMethod() );
    // alerts "BASE method working with Mat"

### Multiple base classes

One class may have multiple base classes, but each base class will share the instance memory.  Any clashes in method names can be resolved by using the `instance.{BaseClassKind}.{method}` pattern.

    var BaseClass1 = oo.Class("BaseClass1", {
      theMethod: function() {
        return "BASE 1 method working with " + this.name;
      },
      helloFromBase1: function() {
        return "Hello from Base 1";
      }
    });
    
    var BaseClass2 = oo.Class("BaseClass2", {
      theMethod: function() {
        return "BASE 2 method working with " + this.name;
      },
      helloFromBase2: function() {
        return "Hello from Base 2";
      }
    });
    
    var ChildClass = oo.Class("ChildClass", BaseClass1, BaseClass2, {
      theMethod: function() {
        return "CHILD method working with " + this.name;
      }
    });

    var i = new ChildClass();

    i.name = "Mat";

    alert( i.theMethod() );
    // alerts "CHILD method working with Mat"

    alert( i.helloFromBase1() );
    // alerts "Hello from Base 1"
    
    alert( i.helloFromBase2() );
    // alerts "Hello from Base 2"

    alert( i.BaseClass1.theMethod() );
    // alerts "BASE 1 method working with Mat"
    
    alert( i.BaseClass2.theMethod() );
    // alerts "BASE 2 method working with Mat"

## Special class methods

### $beforeInherited

    (item) $beforeInherited(newClass, argumentsArray);

The `$beforeInherited` method is called just before a class gets inherited.

  * `this` will be the class itself
  * `newClass` is the new class that is being defined.
  * `argumentsArray` is an array of the arguments that were passed to `oo.Class`.
    * [0] - Class name string.
    * [n...] - Middle arguments will be base classes and mixins.
    * [len-1] - The last argument will be the definition of the class.

### $afterInherited

    $afterInherited(newClass, argumentsArray)

The `$afterInherited` method is called after the class has been inherited.

  * `this` will be the class itself
  * `newClass` is the new class that is being defined.
  * `argumentsArray` is an array of the arguments that were passed to `oo.Class`.
    * [0] - Class name string.
    * [n...] - Middle arguments will be base classes and mixins.
    * [len-1] - The last argument will be the definition of the class.

### $afterClassDefined

    $afterClassDefined(newClass, argumentsArray)

The `$afterClassDefined` method is called after a new class has been compeltely defined.  I.e. mixins and base classes that appear after this class in the `oo.Class` method will have all been handled before this method is called.

  * `this` will be the class itself
  * `newClass` is the compelte new class that has been defined.
  * `argumentsArray` is an array of the arguments that were passed to `oo.Class`.
    * [0] - Class name string.
    * [n...] - Middle arguments will be base classes and mixins.
    * [len-1] - The last argument will be the definition of the class.

## Helper methods

`oo` provides some additional helpful methods.

### `ooextend`

    ooextend(source, destination)

The `ooextend` method copies properties from `source` into `destination`.  The `destination` object is modified.

### `oobind`

    var newFunc = oobind({function}, {thisObject}, [{arg1}, [{arg2...}]])

or

    var newFunc = {function}.bind({thisObject}, [{arg1}, [{arg2...}]])

The `oobind` method allows you to bind context (and arguments) to functions.  This is used by `oo.Class` internally, but can be invaliable when coding JavaScript.

NOTE: Newer editions of the language have their own [bind method](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind) that will eventually replace `oobind`.  It works, however, in the same way.

## Licence
    
Copyright (c) 2012 Mat Ryer

Please consider promoting this project if you find it useful.

Permission is hereby granted, free of charge, to any person obtaining a copy of this     software and associated documentation files (the "Software"), to deal in the Software     without restriction, including without limitation the rights to use, copy, modify, merge,     publish, distribute, sublicense, and/or sell copies of the Software, and to permit     persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or     substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,     INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR     PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE     FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR     OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER     DEALINGS IN THE SOFTWARE.    