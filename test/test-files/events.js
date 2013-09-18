var MyTestClass;
buster.testCase("Events", {

  setUp: function(){

    oo = ooreset();

    MyTestClass = oo.Class("MyTestClass", oo.Events, {

      events: ["success", "error", "progress"]

    });

  },

  "oo.Events": function(){

    var MyClass = oo.Class("MyClass", oo.Events, {});
    var myObj = new MyClass();

    var callbackThis = null;
    var callbackArgs = null;
    var callbackCount = 0;

    // fire the event with no handlers
    myObj.fire("something", 1, 2, 3);
    assert.equals(0, callbackCount, "Nothing should happen.")

    var callback = function(){
      callbackCount++;
      callbackThis = this;
      callbackArgs = arguments;
    };

    // register for an event
    assert.equals(myObj, myObj.on("something", callback));

    // fire the event not here is a handler
    myObj.fire("something", 1, 2, 3);

    // make sure it was fired
    assert.equals(1, callbackCount, "Callback should get called once")
    assert.equals(myObj, callbackThis);
    assert.equals(3, callbackArgs.length);
    assert.equals(1, callbackArgs[0]);
    assert.equals(2, callbackArgs[1]);
    assert.equals(3, callbackArgs[2]);

    // remove the callback
    myObj.removeCallback("something", callback);

    myObj.fire("something", 1, 2, 3);
    assert.equals(1, callbackCount, "Callback not get called again");

    // withEvent should call the beforeevent and afterevent
    // versions of the event name.
    var before = false, after = false, block = false;

    myObj.on("before:something", function(){
      before = true;
    });
    myObj.on("something", function(){
      after = true;
    });
    myObj.withEvent("something", function(){
      block = true;
    });

    assert.equals(before, true, "before block called?");
    assert.equals(after, true, "after block called?");
    assert.equals(block, true);

  },

  "withEvent - before handler cancels event": function(){

    var MyClass = oo.Class("MyClass", oo.Events, {});
    var myObj = new MyClass();

    // withEvent should call the beforeevent and afterevent
    // versions of the event name.
    var before = false, after = false, block = false;
    var beforeArgs = [], afterArgs = [];

    myObj.on("before:something", function(){
      before = true;
      beforeArgs = arguments;
      return false;
    });
    myObj.on("something", function(){
      after = true;
      afterArgs = arguments;
    });

    myObj.withEvent("something", 1, 2, 3, function(){
      block = true;
      return 123;
    });

    assert.equals(before, true);
    assert.equals(after, false);

  },

  "withEvent with arguments": function(){

    var MyClass = oo.Class("MyClass", oo.Events, {});
    var myObj = new MyClass();

    // withEvent should call the beforeevent and afterevent
    // versions of the event name.
    var before = false, after = false, block = false;
    var beforeArgs = [], afterArgs = [];

    myObj.on("before:something", function(){
      before = true;
      beforeArgs = arguments;
    });
    myObj.on("something", function(){
      after = true;
      afterArgs = arguments;
    });

    myObj.withEvent("something", 1, 2, 3, function(){
      block = true;
      return 123;
    });

    assert.equals(beforeArgs.length, 3, "before args");
    assert.equals(beforeArgs[0], 1);
    assert.equals(beforeArgs[1], 2);
    assert.equals(beforeArgs[2], 3);

    assert.equals(afterArgs.length, 4, "after args");
    assert.equals(afterArgs[0], 1);
    assert.equals(afterArgs[1], 2);
    assert.equals(afterArgs[2], 3);
    assert.equals(afterArgs[3], 123);

  },

  "oo.Event": function(){
    ok(oo.Event)
  },

  "instance methods": function(){

    var o = new MyTestClass();

    isFunction(o.success);
    isFunction(o.error);
    isFunction(o.progress);

  },

  "Using shortcut method": function(){

    var o = new MyTestClass();

    var callbackCallCount = 0;
    var callbackThis = null;
    var callbackArguments = null;
    var callback = function(){
      callbackCallCount++;
      callbackThis = this;
      callbackArguments = arguments;
    };

    // add a callback
    assert.equals(o.success(callback), o, "Event shortcut methods should chain.")

    assert.equals(1, o.ooevents.success.length, "Func should be added to obj.event.callbacks")
    assert.equals(callback, o.ooevents.success[0])

    // fire the event
    assert.equals(o, o.success(1, 2, 3))

    assert.equals(1, callbackCallCount, "Callback should have been called")
    assert.equals(o, callbackThis, "Context of event handler should be the object itself.")
    assert.equals(3, callbackArguments.length, "Arguments should be sent")
    assert.equals(1, callbackArguments[0], "Argument")
    assert.equals(2, callbackArguments[1], "Argument")
    assert.equals(3, callbackArguments[2], "Argument")

  },

  "Cancelling by returning false": function(){

    var o = new MyTestClass();

    var callCount = 0;
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; return false; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });
    o.on("something", function(){ callCount++; });

    // fire the event
    o.fire("something");

    assert.equals(callCount, 5, "callCount");

  },

  "Testing multiple callbacks": function() {

    var callbacks = [];
    var cb1 = function(){
      callbacks.push(1)
    };
    var cb2 = function(){
      callbacks.push(2)
    };
    var cb3 = function(){
      callbacks.push(3)
    };

    var o = new MyTestClass();

    // bind multiple callbacks
    o.success(cb1).success(cb2).success(cb3);

    // fire the event
    o.success();

    assert.equals(3, callbacks.length);
    assert.equals(1, callbacks[0]);
    assert.equals(2, callbacks[1]);
    assert.equals(3, callbacks[2]);

  },

  "Removing callbacks": function(){

    var callbacks = [];
    var cb1 = function(){
      callbacks.push(1);
    };
    var cb2 = function(){
      callbacks.push(2);
    };
    var cb3 = function(){
      callbacks.push(3);
    };

    var o = new MyTestClass();

    // bind multiple callbacks
    o.success(cb1).success(cb2).success(cb3);

    // remove the 2nd callback
    assert.equals(true, o.removeCallback("success", cb2), "return of removeCallback should be true")

    // fire the event
    o.success();

    assert.equals(2, callbacks.length);
    assert.equals(1, callbacks[0]);
    assert.equals(3, callbacks[1]);

  },

  "Class wide events": function(){

    var MyClass = oo.Class("MyClass", oo.Events, {
      events: ["something"]
    });

    // bind to the class event
    var classWideArgs = [];
    var classWideCallbackCalledCount = 0;
    var classWideCallbackThis = null;
    MyClass.on("something", function(){
      classWideCallbackCalledCount++;
      classWideCallbackThis = this;
      classWideArgs.push(arguments);
    });

    // create two instances
    var instance1 = new MyClass();
    var instance2 = new MyClass();

    // fire the event on both of them
    instance1.something(1, 2, 3);
    instance2.something(4, 5, 6);

    // make sure the class wide handler was called
    assert.equals(classWideCallbackCalledCount, 2, "classWideCallbackCalledCount");
    assert.equals(classWideArgs[0][0], instance1, "classWideArgs[0][0]");
    assert.equals(classWideArgs[0].length, 4, "classWideArgs[0].length")
    assert.equals(classWideArgs[1][0], instance2, "classWideArgs[1][0]");
    assert.equals(classWideArgs[1].length, 4, "classWideArgs[1].length")

  },

  "Scope events": function(){

    var MyClass = oo.Class("MyClass", oo.Events, {
      events: ["something"]
    });

    var callbackCallCount = 0;
    var callbackThis = null;
    var callbackArguments = null;
    var callback = function(){
      callbackCallCount++;
      callbackThis = this;
      callbackArguments = arguments;
    };

    var i = new MyClass();

    // fire event
    i.fire("something", 1, 2, 3);

    assert.equals(0, callbackCallCount, "Callback should NOT have been called")

    i.fireWith("something", {
      "something": callback
    }, 1, 2, 3);

    assert.equals(1, callbackCallCount, "Callback should have been called")
    assert.equals(i, callbackThis, "Context of event handler should be the object itself.")
    assert.equals(3, callbackArguments.length, "Arguments should be sent")
    assert.equals(1, callbackArguments[0], "Argument")
    assert.equals(2, callbackArguments[1], "Argument")
    assert.equals(3, callbackArguments[2], "Argument")

    // trigger the event again - should NOT fire the
    // scoped one.
    i.fire("something", 1, 2, 3);

    assert.equals(1, callbackCallCount, "Callback should not get called again.")

  }

});
