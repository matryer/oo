var stub = function(orig, func){
 
 // store the original
 func.orig = orig;
 
 // return the new function
 return func;
 
};
var unstub = function(func) {
 return func.orig;
};
var stubbed = function(func) {
  return typeof func.orig == "function";
};

function ok(something) {
  refute.isNull(something);
}
function something(something) {
  refute.equals(typeof something, "undefined");
}
function isFunction(func) {
  assert.equals(typeof func, "function", "Expected to be a function.");
}