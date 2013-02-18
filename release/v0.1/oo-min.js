/*
  oo
  The worlds simplest JavaScript OO implementation.
  For if you just need classes, and nothing else.

  Copyright (c) 2013 Mat Ryer
  Please consider promoting this project if you find it useful.
  Be sure to check out the Licence: https://github.com/stretchrcom/oo#licence
*/
var ooreset=function(){var oo={classes:[],classesmap:{},Class:function(className){if(oo.classesmap[className]){throw new oo.DuplicateClassNameException(className);return null;}
var klass=function(){this.$initialiseBases.apply(this);this.init.apply(this,arguments);};klass.prototype.init=function(){};klass.$bases={};klass.prototype.$initialiseBases=function(){for(var baseName in this.$class.$bases){var basePrototype=this.$class.$bases[baseName];for(var baseProperty in basePrototype.prototype){if(typeof basePrototype.prototype[baseProperty]=="function"){if(baseProperty.substr(0,1)!="$"){basePrototype.prototype[baseProperty]=basePrototype.prototype[baseProperty].bind(this);}}}}};for(var i=1,l=arguments.length-1;i<l;i++){var item=arguments[i];if(item.$isClass){klass.$bases[item.$className]=item;ooextend(item.prototype,klass.prototype);klass.prototype[item.$className]=item.prototype;}else if(typeof item=="object"){ooextend(item,klass.prototype);}}
if(arguments.length>1){ooextend(arguments[arguments.length-1],klass.prototype);}
klass.toString=function(){return"<{ oo.Class: "+this.$className+" }>";};klass.$isClass=true;klass.prototype.constructor=klass.prototype.$class=klass;oo.classes[oo.classes.length]=klass.$className=className;return oo.classesmap[className]=klass;}};oo.Exception=oo.Class("oo.Exception",{init:function(message){this.message=message;},toString:function(){return"<{ oo.Exception: \" + message + \" }>";}});oo.DuplicateClassNameException=oo.Class("oo.DuplicateClassNameException",oo.Exception,{init:function(className){"Cannot define a class because '"+className+"' already exists."}});return oo;};var ooextend=function(source,destination){for(var s in source){destination[s]=source[s];}};var oo=ooreset();var oobind=function(){var
_func=arguments[0]||null,_obj=arguments[1]||this,_args=[],i=2,l=arguments.length,bound;for(;i<l;i++){_args.push(arguments[i]);}
bound=function(){var theArgs=[];var i=0;for(i=0,l=_args.length;i<l;i++){theArgs.push(_args[i]);}
for(i=0,l=arguments.length;i<l;i++){theArgs.push(arguments[i]);}
return _func.apply(_obj,theArgs);};bound.func=_func;bound.context=_obj;bound.args=_args;return bound;};Function.prototype.bind=function(){var theArgs=[],i=0,l=arguments.length;theArgs.push(this);for(;i<l;i++){theArgs.push(arguments[i]);}
return oobind.apply(window,theArgs);};