var MyTestClass;
buster.testCase("Events", {
  
  setUp: function(){

    oo = ooreset();

    MyTestClass = oo.Class("MyTestClass", oo.Properties, {

      properties: ["name", "age"],
      setters: ["style"],
      getters: ["description"]

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

  }

});