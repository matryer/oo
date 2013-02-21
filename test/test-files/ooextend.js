buster.testCase("ooextend", {

	"ooextend": function() {

		var obj1 = {
			"one": 1,
			"two": 2,
			"three": 3
		};

		var obj2 = {
			"three": "THREE",
			"four": "FOUR",
			"five": "FIVE"
		};

		ooextend(obj2, obj1);

		assert.equals(obj1["one"], 1);
		assert.equals(obj1["two"], 2);
		assert.equals(obj1["three"], "THREE", "Properties should be overwritten");
		assert.equals(obj1["four"], "FOUR");
		assert.equals(obj1["five"], "FIVE");

	}

});