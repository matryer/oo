buster.testCase("Class", {

  setUp: function(){
    oo = ooreset();
  },

  "oo.Class (defining a class)": function() {

    var classesCount = oo.classes.length;

    var MyClass = oo.Class("MyClass", {});

    assert.equals(MyClass.$className, "MyClass", "className");
    assert.equals(MyClass + "", "<{ oo.Class: MyClass }>")
    assert.equals(MyClass.$isClass, true);

    // ensure the class was added to the oo.classes array
    if (assert.equals(classesCount + 1, oo.classes.length)) {
      assert.equals("MyClass", oo.classes[0]);
    }
    assert.equals(MyClass, oo.classesmap["MyClass"], "classesmap['MyClass']")

  },

  "oo.Class init": function(){

    var MyClass = oo.Class("MyClass", {
      init: function(name) {
        this.text = "My name is " + name;
      }
    });

    var i = new MyClass("Mat");

    assert.equals(i.text, "My name is Mat");

  },

  "oo.Class instance methods": function(){

    var MyClass = oo.Class("MyClass", {
      getName: function(){ return this.name; }
    });

    var myInstance = new MyClass();

    assert.equals(MyClass, myInstance.$class);

    myInstance.name = "Mat";
    assert.equals(myInstance.getName(), "Mat");

  },

  "oo.Class class methods": function(){

    var MyClass = oo.Class("MyClass", {
      $getName: function(){ return this._name; }
    });

    MyClass._name = "A class name";

    assert.equals(MyClass.$getName(), "A class name");

  },

  "oo.Class with existing class name should throw error": function() {

    oo.Class("MyClass", {});

    assert.exception(function(){
      oo.Class("MyClass", {});
    })

  },

  "oo.Class mixin": function(){

    var NameAccessors = {
      getName: function(){ return this.name; },
      setName: function(n){ this.name = n; return this; }
    };
    var MyClass = oo.Class("MyClass", NameAccessors, {});

    var i = new MyClass();

    i.setName("Mat");

    assert.equals(i.name, "Mat");
    assert.equals(i.getName(), "Mat");

  },

  "oo.Class base class": function(){

    var BaseClass = oo.Class("BaseClass", {
      baseMethodGetName: function(){ return this.name; }
    });

    var ChildClass = oo.Class("ChildClass", BaseClass, {
      childMethodGetName: function(){ return this.name; }
    });

    var childInstance = new ChildClass();
    childInstance.name = "Mat";

    assert.equals(childInstance.childMethodGetName(), "Mat");
    assert.equals(childInstance.baseMethodGetName(), "Mat");

  },

  "oo.Class base class; overriding methods": function(){

    var BaseClass = oo.Class("BaseClass", {
      baseMethodGetName: function(){ return this.name; }
    });

    var ChildClass = oo.Class("ChildClass", BaseClass, {
      childMethodGetName: function(){ return this.name; },
      baseMethodGetName: function(){ return "OVERRIDDEN"; }
    });

    var childInstance = new ChildClass();
    childInstance.name = "Mat";

    assert.equals(childInstance.childMethodGetName(), "Mat");
    assert.equals(childInstance.baseMethodGetName(), "OVERRIDDEN");

  },

  "oo.Class base class; calling base methods": function(){

    var BaseClass = oo.Class("BaseClass", {
      getName: function(){ return "base: " + this.name; }
    });

    var ChildClass = oo.Class("ChildClass", BaseClass, {
      getName: function(){ return this.BaseClass.getName(); }
    });

    var childInstance = new ChildClass();
    childInstance.name = "Mat";

    assert.equals(childInstance.getName(), "base: Mat");

  }

});