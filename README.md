# oo - Objects for JavaScript

`oo` is the worlds simplest yet most powerful JavaScript OO implementation.  Extracted from [Objx JavaScript Enhancement library](http://objx.googlecode.com/).

## Features

  * Easy class definition
  * Use the `new` operator
  * Constructors with the `init` method
  * Get the type with `.$kind`
  * Inheritance
  * Mix-ins
  * Full test suite

## Using `oo`

In your HTML page, just include a `script` tag for the appropriate version.

### Latest edge version

    <script src="https://raw.github.com/stretchrcom/oo/master/src/oo.js"></script>

### Specific version

  * v0.2 - Normal - `<script src="https://raw.github.com/stretchrcom/oo/v0.2/src/oo.js"></script>`

### Other versions

If you want the features from a specific branch, navigate to the branch on https://github.com/stretchrcom/oo/branches and look for the raw file `/src/oo.js`, and set that as your `src` attribute.

## Examples

### Easy class definition

    var MyClass = oo.Class("MyClass", {
    
      getName: function() {
        return this.name;
      }

    });

### Use the `new` operator

    var myInstance = new MyClass();

### Constructors with the `init` method

    var MyClass = oo.Class("MyClass", {
    
      init: function() {
        // set stuff up
      }

    });

### Get the type with `.$kind`

    var MyClass1 = oo.Class("MyClass1", {
      numberOnOne: function(){ return 1; } 
    });
    var MyClass2 = oo.Class("MyClass2", {
      numberOnTwo: function(){ return 2; } 
    });
    
    function getNumber(object) {
      switch (object.$kind) {
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

### Base classes

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

    var BaseClass = oo.Class("BaseClass", {
      theMethod: function() {
        return "BASE method working with " + this.name;
      }
    });

    var ChildClass = oo.Class("ChildClass", BaseClass, {
      theMethod: function() {
        return "CHILD method working with " + this.name;
      }
    });

    var i = new ChildClass();

    i.name = "Mat";

    alert( i.theMethod() );
    // alerts "CHILD method working with Mat"

    alert( i.BaseClass.theMethod() );
    // alerts "BASE method working with Mat"

### Multiple base classes

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

## Licence
    
Copyright (c) 2012 Mat Ryer

Please consider promoting this project if you find it useful.

Permission is hereby granted, free of charge, to any person obtaining a copy of this     software and associated documentation files (the "Software"), to deal in the Software     without restriction, including without limitation the rights to use, copy, modify, merge,     publish, distribute, sublicense, and/or sell copies of the Software, and to permit     persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or     substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,     INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR     PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE     FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR     OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER     DEALINGS IN THE SOFTWARE.    