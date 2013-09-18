# oo - Objects for JavaScript

`oo` is the worlds simplest yet most powerful JavaScript OO implementation.  Extracted from [Objx JavaScript Enhancement library](http://objx.googlecode.com/).

## Features

  * [Easy class definition](#easy-class-definition)
  * Use the [`new` keyword](#use-the-new-operator) and [`this` keyword](#methods-are-just-functions-that-refer-to-this)
  * [Properties](#properties) and [Events](#events)
  * [Constructors with the `init` method](#constructors-with-the-init-method)
  * [Class and static methods](#class-methods)
  * [Check for classes with `.$isClass` and get it with `.$class`](#check-for-classes-with-isclass-and-get-it-with-class`)
  * [Base classes](#base-classes) and [inheritance](#advanced-inheritance)
  * [Mix-ins](#mix-ins)
  * [Special class methods](#special-class-methods) let you write advanced OO capabilities.
  * Helpful supporting methods like; [ooextend](#ooextend) and [oobind](#oobind).
  * Full test suite

## Using `oo`

In your HTML page, just include a `script` tag for the appropriate version hosted on GitHub:

#### Latest edge version

    <script src="https://raw.github.com/stretchr/oo/master/src/oo.js"></script>

#### Specific releases

##### v1.2

  * `<script src="https://raw.github.com/stretchr/oo/v1.2/src/oo.js"></script>`
  * Minified (5,481 bytes): `<script src="https://raw.github.com/stretchr/oo/v1.2/src/oo-min.js"></script>`

##### v1.0

  * `<script src="https://raw.github.com/stretchr/oo/v0.2/src/oo.js"></script>`
  * Minified (2,162 bytes): `<script src="https://raw.github.com/stretchr/oo/v1.0/src/oo-min.js"></script>`

#### Other versions

If you want the features from a specific branch, navigate to the branch on https://github.com/stretchr/oo/branches and look for the raw file `/src/oo.js`, and set that as your `src` attribute.

#### Host it yourself (recommended)

You are free to copy the source and host it on your own servers if you leave the comments in place.  See the [licence](https://github.com/stretchr/oo#licence) for more information.

### Change log

  * v1.3 - Added scoped events and property defaults
  * v1.2.2 - Added properties
  * v1.2.1 - Added class-wide events
  * v1.2   - Added events
  * v1.1   - Added [special class methods](#special-class-methods)
  * v1.0   - Initial release
  * v0.2   - BETA release

## API Documentation

### Easy class definition

To define a class, just use the `oo.Class` method:

    oo.Class("{ClassName}", [BaseClasses], [Mixins], [Definition]);

  * The first argument must be the class name, usually the same name as the variable you assign it to.
  * The final argument will be the definition of the class.  It is optional but usually needed.
  * Base classes and mixins can be passed after the class name (first argument) and before the definition (final argument), and they will contribute to the blueprint of the class.

You can do this:

    var MyClass = oo.Class("MyClass", oo.Events, oo.Properties, {

      properties: {"name": "Default name"}

    });

... instead of this:

    var MyClass = function(){
      this.name = "Default name";
    };

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

## Properties

  * New in `v1.2.2`

Properties make adding getters and setters to your class very easy.  By mixing in `oo.Properties`, you can specify the properties of your class by setting the appropriate string arrays:

    {
      properties: ["name", "age"]
    }

Four methods will be added to your objects;

  * `name()`
  * `setName(name)`
  * `age()`
  * `setAge(age)`

These methods allow you easily get and set the appropriate values.

### Defaults

You can specify default values by using an object instead of an array:

    {
      properties: {
        "name": "Mat",
        "age": 30
      }
    }

### Read and write only

Adding read and write only properties is as simple as defining different keys for your property string arrays:

    {
      properties: ["name", "age"], /* will have getters and setters */
      setters: ["style"], /* will only have setStyle */
      getters: ["description"] /* will only have description() (i.e. no setDescription method) */
    }

### `oo.Properties` and `oo.Events`

If you inherit both `oo.Properties` and [oo.Events](#events), you will automatically get events for each of your properties, as well as some general events for when any property changes.

If you add a property called `name`, you will get an event called `nameChanged` which is called when a name has been changed.  Since the `setProperty` method uses the `withEvent` method (see below) you are also able to listen for the `before:nameChanged` event.

The signature for the property events looks like this:

    {event}Changed({old}, {new})

  * `{event}` is the name of the event
  * `{old}` is the old value
  * `{new}` is the new value

You may also listen to the generic `propertyChanged` event (and `before:propertyChanged`) to be notified of any property changes.

The signature for the generic `propertyChanged` event is:

    propertyChanged({event}, {old}, {new})

  * `{event}` is the name of the event
  * `{old}` is the old value
  * `{new}` is the new value

### Using the underlying modifiers

oo.Properties adds `getProperty` and `setProperty` methods to your objects.  These are the methods that do the actual work of getting and setting properties.

You are free to use these directly instead of the helper methods:

    var name = o.getProperty("name");
    o.setProperty("name", "Mat").setProperty("age", 30)

### Specifying your own getters and setters

If you explitly specify getters and setters for your properties in your class definition, they will be used instead of the default ones.  This allows you to control exactly how your class deals with such properties.

It is still recommended that you use the underlying `getProperty` and `setProperty` methods if you are indeed using internal storage, because you get eventing for free.  If you choose not to, you would have to implement your own events for your properties, like this:

    setSomething: function(val) {
      this.withEvent("somethingChanged", oldValue, val, function(){
        // your code
      }.bind(this))
    }

### Advanced property management

#### Adding properties later

Since JavaScript is such a magic language, you are able to use the `addProperty` method to add a property to your instances after they have been created.

    instance.addProperty({name}, {getter}, {setter})

  * `{name}` is the name of the property
  * `{getter}` is true if you want a getter (or optionally the name of the getter method)
  * `{setter}` is true if you want a setter (or optionally the name of the setter method)

For example:

    var o = new MyClass();
    o.addProperty("something", true, "assignSomething");

The above code will create a property called `something`, stored in `this._something`, with a getter method called `something()` and a setter method called `assignSomething()`.

#### Internal storage

Properties are typically stored in the object with the property name prefixed with an underscore.  So the value for the `name` property will be stored in `this._name`.

You can change this by overriding the `getPropertyInternalName` method:

    {
      getPropertyInternalName: function(name) {
        return "internal_" + name;
      }
    }

## Events

  * New in `v1.2`

Events allow you to write classes with built-in support for any kind of events, including the ability for other objects to observe the events, and trigger them.

### Using events

Each instance of a class with `oo.Events` enabled has their own eventing mechanism.

#### Adding events to your objects

To add events to a class, just use the `oo.Events` mixin:

    var MyClass = oo.Class("MyClass", oo.Events, { /* your definition */ });

Now, instances of `MyClass` will have access to the `on` and `fire` methods.

#### Adding listeners

    var myObj = new MyClass();
    myObj.on("event-name", function(){
      /* TODO: handle the event */
    });

or to listen to an objects own events:

    init: function(){
      this.on("event-name", this.onEvent)
    },
    onEvent: function(){
      // my own callback
    }

  * Returning `false` from an event callback will prevent further event callbacks from being called.  Best practice is not to return anything if you do not want to stop execution.

#### Firing events

    // fire the event
    myObj.fire("event-name", arg1, arg2, arg3);

or from inside the object:

    something: function(){
      this.fire("event-name", arg1, arg2, arg3)
    }

##### Using scoped callbacks `fireWith`

You can fire an event with a map of additional callbacks that will
only be called for this particular firing of the event.

To do so, use the `fireWith` method that looks like this:

    // usage:
    object.fireWith(eventName, callbacks [, arguments])

The `callbacks` is a map of event names to single functions that will be
called (if appropriate) only for this firing of the event, and not for
subsequent ones.

#### Automagic _before_ events using `withEvent` method

The `withEvent` method allows you to easily trigger two events, before and after running a code block.

    // usage:
    object.withEvent(eventName, [arguments, ] codeblock);

For example:

    // MyClass has an event called 'speak'
    var myObj = new MyClass();

    // ask asks the user for a Yes/No.
    // Raises the before:speak and speak events.
    ask: function(question){
      this.withEvent("ask", question, function(){
        return confirm(question);
      });
    }

Calling the `ask` method above will cause the following things to happen:

  * The `before:ask` event is raised with the 'question' as the only argument
  * Assuming none of the `before:ask` handlers return false, the code block is next executed
  * Finally, the `ask` event is called, with two arguments; the 'question' and the return from the codeblock.

Event listeners might look like this:

    myObj.on("before:ask", function(question){
      // TODO: do something before we ask the user
    });
    myObj.on("ask", function(question, result){
      // TODO: the event has happened, and the result
      // is the last argument.
    });

#### Removing listeners

To stop listening to an event, you can call the `removeCallback` method:

    if (!myObj.removeCallback("event-name", myFunc)) {
      // TODO: handle failure
    }

  * The `myFunc` argument must be the exact same object being removed, remember that using the `bind` method creates a new function each time.

### Defined events

You can predefine events by mixing in the `oo.Events` mixin (see above), and by adding an `events` string array property in your definition.  Each event name will cause a shortcut methods to be created which is the cleanest interface for your class users.

    var MyClass = oo.Class("MyClass", oo.Events, {
      events: ["complete", "error", "progress"]
    });

Instances of `MyClass` will each have three extra methods; `complete`, `error` and `progress`.  These methods can be used to add listeners and fire the events.

#### Shortcut methods: Adding listeners

To add a listener to an event, just call the method and pass in a single `function` argument:

    var obj = new MyClass();
    obj.complete(function(){
      alert("It is complete!");
    });

#### Shortcut methods: Firing events

To fire an event, call the shortcut method with no arguments (or with any other arguments, apart from a single `function` argument):

    // fire the event
    obj.complete();

    // fire the event with some arguments
    obj.complete(true, 123, data);

### Class wide events

  * New in `v1.2.1`

When you mix in `oo.Events` to your class, the class itself also gets it's `on` and `fire` methods.  Listeners bound to the class will get called when _any_ event of that kind is fired on any of the instances.  The first argument will be the instance that is raising the event, followed by any other arguments that were passed when firing the event.

For example,

    var Animal = oo.Class("Animal", oo.Events, {
      init: function(name){
        this.name = name;
        this.on("speak", function(instance, noise){
          console.info(instance.name + " just made this noise: " + noise);
        });
      },
      say: function(noise) {
        this.fire("speak", noise);
      }
    });

    var dog = new Animal("dog");
    var cat = new Animal("cat");

    dog.say("woof");
    cat.say("meow");

    // result in the console will be:
    //
    //   dog just made this noise: woof
    //   cat just made this noise: meow

### Adding events at runtime

You can add events to any target by calling the `oo.Events.$addEvent` method:

    oo.Events.$addEvent(target, eventName);

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

The `$afterClassDefined` method is called after a new class has been completely defined.  I.e. mixins and base classes that appear after this class in the `oo.Class` method will have all been handled before this method is called.

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

Copyright (c) 2013 Mat Ryer

Please consider promoting this project if you find it useful.

Permission is hereby granted, free of charge, to any person obtaining a copy of this     software and associated documentation files (the "Software"), to deal in the Software     without restriction, including without limitation the rights to use, copy, modify, merge,     publish, distribute, sublicense, and/or sell copies of the Software, and to permit     persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or     substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,     INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR     PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE     FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR     OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER     DEALINGS IN THE SOFTWARE.
