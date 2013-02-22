buster.testCase("Class events", {
  
  setUp: function(){
    oo = ooreset();
  },

	"$beforeInherited": function() {

		var calls = [];

		var MyClass = oo.Class("MyClass", {

			"$beforeInherited": function() {
				calls.push(arguments);
			}

		});

		var def = {};
		var InheritedMyClass = oo.Class("InheritedMyClass", MyClass, def);

		if (assert.equals(calls.length, 1, "Method should get called")) {
			assert.equals(calls[0][0], InheritedMyClass)
			assert.equals(calls[0][1][0], "InheritedMyClass");
			assert.equals(calls[0][1][1], MyClass);
			assert.equals(calls[0][1][2], def);
		}

	},

	"$afterInherited": function(){

		var calls = [];

		var MyClass = oo.Class("MyClass", {

			"$afterInherited": function() {
				calls.push(arguments);
			}

		});

		var def = {};
		var InheritedMyClass = oo.Class("InheritedMyClass", MyClass, def);

		if (assert.equals(calls.length, 1, "Method should get called")) {
			assert.equals(calls[0][0], InheritedMyClass)
			assert.equals(calls[0][1][0], "InheritedMyClass");
			assert.equals(calls[0][1][1], MyClass);
			assert.equals(calls[0][1][2], def);
		}

	},

	"$afterClassDefined": function(){

		var calls = [];

		var MyClass = oo.Class("MyClass", {

			"$afterClassDefined": function(klass) {
				calls.push(arguments);

				assert.equals(klass.prototype.testMixin, true, "$afterClassDefined should get called after ALL things have been inherited and mixed in")
				assert.equals(klass.prototype.defDone, true, "$afterClassDefined should get called after ALL things have been inherited and mixed in")

			}

		});

		var def = {
			defDone: true
		};
		var InheritedMyClass = oo.Class("InheritedMyClass", MyClass, {
			testMixin: true
		}, def);

		if (assert.equals(calls.length, 1, "Method should get called")) {

			assert.equals(calls[0][0], InheritedMyClass)
			assert.equals(calls[0][1][0], "InheritedMyClass");
			assert.equals(calls[0][1][1], MyClass);
			assert.equals(calls[0][1][2], def);

			assert.equals(calls[0][0].prototype.testMixin, true, "$afterClassDefined should get called after ALL things have been inherited and mixed in")
			assert.equals(calls[0][0].prototype.defDone, true, "$afterClassDefined should get called after ALL things have been inherited and mixed in")

		}

	}

});