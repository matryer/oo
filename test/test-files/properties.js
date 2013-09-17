var MyTestClass;
buster.testCase("Properties", {

  setUp: function(){

    oo = ooreset();

    MyTestClass = oo.Class("MyTestClass", oo.Events, oo.Properties, {

      properties: ["name", "age"],
      setters: {"style":null},
      getters: {"description":null},

      // overridden handler
      setAge: function(age) {
        if (age < 0) { age = 0; }
        this.setProperty("age", age);
        return this;
      }

    });

  },

  "addProperty": function(){

    var o = {};
    assert.equals(o, oo.Properties.$addProperty(o, "added", "getAdded", "setAdded"));

    ok(o.getAdded, "getter");
    o._added = "Mat";
    assert.equals(o.getAdded(), "Mat");
    assert.equals(o, o.setAdded("Laurie"));
    assert.equals(o._added, "Laurie");
    assert.equals(o.getAdded(), "Laurie");

  },

  "addProperty default getter and setter names": function(){

    var o = {};
    assert.equals(o, oo.Properties.$addProperty(o, "added", true, true));

    ok(o.added, "getter");
    o._added = "Mat";
    assert.equals(o.added(), "Mat");
    assert.equals(o, o.setAdded("Laurie"));
    assert.equals(o._added, "Laurie");
    assert.equals(o.added(), "Laurie");

  },

  "class addProperty": function(){

    var o = new MyTestClass();
    assert.equals(o, o.addProperty("added", "getAdded", "setAdded"));

    ok(o.getAdded, "getter");
    o._added = "Mat";
    assert.equals(o.getAdded(), "Mat");
    assert.equals(o, o.setAdded("Laurie"));
    assert.equals(o._added, "Laurie");
    assert.equals(o.getAdded(), "Laurie");

  },

  "class properties": function(){

    var o = new MyTestClass();

    ok(o.name, "getter");
    o._name = "Mat";
    assert.equals(o.name(), "Mat");
    o.setName("Laurie");
    assert.equals(o._name, "Laurie");
    assert.equals(o.name(), "Laurie");

    // getters only
    o._description = "Something";
    assert.equals(typeof o.setDescription, "undefined");
    assert.equals(o.description(), "Something");

    // setters only
    o._style = "Something";
    assert.equals(typeof o.style, "undefined");
    assert.equals(o.setStyle("Else"), o);
    assert.equals(o._style, "Else");

  },

  "class properties with explicit setter": function(){

    var o = new MyTestClass();

    o.setAge(10);
    assert.equals(o.age(), 10);
    o.setAge(-100);
    assert.equals(o.age(), 0);

  },

  "properties and events": function(){

    var o = new MyTestClass();

    refute.equals(typeof o.nameChanged, "undefined", "typeof o.nameChanged");

    o.setName("Tyler");

    var newName = null;
    var beforeOld = null;
    var beforeNew = null;

    o.nameChanged(function(old, value){
      newName = value;
    });
    o.on("before:nameChanged", function(oldName, newName){
      beforeOld = oldName;
      beforeNew = newName;
    });

    var propChangedName, propChangedOld, propChangedNew;
    o.propertyChanged(function(name, oldValue, newValue){
      propChangedName = name;
      propChangedOld = oldValue;
      propChangedNew = newValue;
    });

    o.setName("Mat");
    assert.equals(newName, "Mat");
    assert.equals(o.name(), "Mat");

    assert.equals(beforeOld, "Tyler");
    assert.equals(beforeNew, "Mat");

    assert.equals(propChangedName, "name");
    assert.equals(propChangedOld, "Tyler");
    assert.equals(propChangedNew, "Mat");

  },

  "defaults": function(){

    var ClassWithDefaults = oo.Class("ClassWithDefaults", oo.Properties, {

      properties: {
        "name": "Mat",
        "age": 30
      },

      getters: {
        "something": true
      },

      setters: {
        "else": 90210
      }

    });

    var i = new ClassWithDefaults();
    assert.equals(i._name, "Mat");
    assert.equals(i._age, 30);
    assert.equals(i._something, true);
    assert.equals(i._else, 90210);
    assert.equals(i.name(), "Mat");
    assert.equals(i.age(), 30);
    assert.equals(i.something(), true);

  }

});
