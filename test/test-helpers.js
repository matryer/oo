var stub = function(orig, func){
 
 // store the original
 func.orig = orig;
 
 // return the new function
 return func;
 
};
var unstub = function(func) {
 return func.orig;
};

function ok(something) {
  refute.isNull(something);
}
function something(something) {
  refute.equals("undefined", typeof something);
}
function isFunction(func) {
  assert.equals("function", typeof func);
}