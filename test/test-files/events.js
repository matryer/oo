var MyTestClass;
buster.testCase("Events", {
  
  setUp: function(){

    oo = ooreset();

    MyTestClass = oo.Class("MyTestClass", {

      success: new oo.Event(),
      error: new oo.Event(),
      progress: new oo.Event()

    });

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
    assert.equals(o.success, o.success.on(callback), "Event shortcut methods should chain.")

    assert.equals(1, o.success.callbacks.length, "Func should be added to obj.event.callbacks")
    assert.equals(callback, o.success.callbacks[0])

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
    o.success.on(cb1).on(cb2).on(cb3);

    // fire the event
    o.success();

    assert.equals(3, callbacks.length);
    assert.equals(1, callbacks[0]);
    assert.equals(2, callbacks[1]);
    assert.equals(3, callbacks[2]);

  }

});
