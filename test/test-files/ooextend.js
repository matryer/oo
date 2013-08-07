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

	},

	"ooextend array": function() {

		var arr1 = [1,2,3];
		var arr2 = [4,5,6];

		ooextend(arr2, arr1);

		assert.equals(arr1[0], 1);
		assert.equals(arr1[1], 2);
		assert.equals(arr1[2], 3);
		assert.equals(arr1[3], 4);
		assert.equals(arr1[4], 5);
		assert.equals(arr1[5], 6);

	},

	"ooextend arguments": function(){

		var arr1 = [1,2,3];
		(function(){
			ooextend(arguments, arr1);
		})(4,5,6);

		assert.equals(arr1[0], 1);
		assert.equals(arr1[1], 2);
		assert.equals(arr1[2], 3);
		assert.equals(arr1[3], 4);
		assert.equals(arr1[4], 5);
		assert.equals(arr1[5], 6);

	}

});