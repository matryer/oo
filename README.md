# oo - Objects for JavaScript

`oo` is the worlds simplest yet most powerful JavaScript OO implementation.  Extracted from [Objx JavaScript Enhancement library](http://objx.googlecode.com/).

## Features

  * Easy class definition
  * Use the `new` operator
  * Constructors with the `init` method
  * Inheritance
  * Mix-ins
  * Full test suite

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