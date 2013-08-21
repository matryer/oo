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

    assert.equals(before, true);
    assert.equals(after, true);
    assert.equals(block, true);

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

  }

});
