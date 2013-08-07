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

  }

});