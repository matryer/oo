buster.testCase("oobind", {

  "oobind remains context": function(){

    var context = null;
    var f = function(){ context = this; };

    var obj1 = {};
    var obj2 = {};

    var boundToObj1 = oobind(f, obj1);
    var boundToObj2 = oobind(f, obj2);

    // make sure the result of bind is a function
    assert.equals(typeof boundToObj1, "function", "objx.bind must return a function.");
    assert.equals(typeof boundToObj2, "function", "objx.bind must return a function.");

    boundToObj1();
    assert.equals(context, obj1, "Context must get bound correctly with objx.bind");

    boundToObj2();
    assert.equals(context, obj2, "Context must get bound correctly with objx.bind");

  },

  "oobind argument handling": function(){

    var c = {
            args: []
    };

    // a function that adds the arguments to args
    var f = function(){
            for (var i = 0; i < arguments.length; i++)
                    this.args.push(arguments[i]);
    };

    var f2 = oobind(f, c, 1, 2, 3, 4, 5);

    f2(6, 7);
    f2(8, 9);

    assert.equals(c.args[0], 1, "Arguments should be passed in the right order.");
    assert.equals(c.args[1], 2, "Arguments should be passed in the right order.");
    assert.equals(c.args[2], 3, "Arguments should be passed in the right order.");
    assert.equals(c.args[3], 4, "Arguments should be passed in the right order.");
    assert.equals(c.args[4], 5, "Arguments should be passed in the right order.");
    assert.equals(c.args[5], 6, "Arguments should be passed in the right order.");
    assert.equals(c.args[6], 7, "Arguments should be passed in the right order.");

    assert.equals(c.args[7], 1, "Arguments should be passed in the right order.");
    assert.equals(c.args[8], 2, "Arguments should be passed in the right order.");
    assert.equals(c.args[9], 3, "Arguments should be passed in the right order.");
    assert.equals(c.args[10], 4, "Arguments should be passed in the right order.");
    assert.equals(c.args[11], 5, "Arguments should be passed in the right order.");

    assert.equals(c.args[12], 8, "Arguments should be passed in the right order.");
    assert.equals(c.args[13], 9, "Arguments should be passed in the right order.");

  },

  "oobind keeps reference to the target function": function(){

    var orig = function(){};
    var context = {};
    var arg1 = {};
    var arg2 = {};
    var bound = oobind(orig, context, arg1, arg2);

    something(bound.func, "bound.func should exist");
    isFunction(bound.func, "bound.func should be a function");

    assert.equals(bound.func, orig);
    assert.equals(bound.context, context);
    assert.equals(bound.args[0], arg1);
    assert.equals(bound.args[1], arg2);

  },

  ".bind command added to function prototype": function(){

    ok(function(){}.bind, "function(){}.bind should exist.");

  },


  "function(){}.bind calls oobind": function(){

    // stub oobind
    var callTooobindArgs = null;
    var boundFunction = function(){};

    oobind = stub(oobind, function(){
            callTooobindArgs = arguments;
            
            return boundFunction;
            
    });

    var func = function(){ return this; };
    var context = {};
    var arg = {};
    var bound = func.bind(context, arg);

    ok(callTooobindArgs, "function(){}.bind should have called oobind");
    assert.equals(bound, boundFunction, "function(){}.bind should return bound object");
    isFunction(bound, "function(){}.bind should return bound object (which should be a function)");

    assert.equals(func, callTooobindArgs[0], "function(){}.bind should call oobind with function as first argument.");
    assert.equals(context, callTooobindArgs[1], "function(){}.bind should call oobind with function as second argument.");
    assert.equals(arg, callTooobindArgs[2], "function(){}.bind should call oobind with function as third argument.");

    // put oobind back
    oobind = unstub(oobind);

  },

  "oobind binds source objects only when ODebug or OAlwaysRememberBoundSource is true": function(){

    ok(typeof OAlwaysRememberBoundSource != "undefined", "OAlwaysRememberBoundSource should exist.");

    var orig = function(){};
    var context = {};
    var arg1 = {};
    var arg2 = {};
    var bound = oobind(orig, context, arg1, arg2);

    assert.equals(bound.func, orig);
    assert.equals(bound.context, context);
    assert.equals(bound.args[0], arg1);
    assert.equals(bound.args[1], arg2);

  }
});
