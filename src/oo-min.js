/*
  oo
  v1.2
  
  The worlds simplest JavaScript OO implementation.
  For if you just need classes, and nothing else.

  Copyright (c) 2013 Mat Ryer
  Please consider promoting this project if you find it useful.
  Be sure to check out the Licence: https://github.com/stretchr/oo#licence
*/
var ooreset=function(){var oo={version:"1.2",classes:[],classesmap:{},Class:function(className){if(oo.classesmap[className]){throw new oo.DuplicateClassNameException(className);return null}var klass=function(){if(!this.$initialiseBases){throw new oo.IncorrectSyntaxException(className);}this.$initialiseBases.apply(this);this.init.apply(this,arguments)};klass.prototype.init=function(){};klass.$bases={};klass.prototype.$initialiseBases=function(){for(var baseName in this.$class.$bases){var basePrototype=this.$class.$bases[baseName];for(var baseProperty in basePrototype.prototype){if(typeof basePrototype.prototype[baseProperty]=="function"){if(baseProperty.substr(0,1)!="$"){basePrototype.prototype[baseProperty]=basePrototype.prototype[baseProperty].bind(this)}}}}};var afterClassDefinedList=[];for(var i=1,l=arguments.length-1;i<l;i++){var item=arguments[i];if(item.$beforeInherited){item=item.$beforeInherited(klass,arguments)}if(!item)continue;if(item.$isClass){klass.$bases[item.$className]=item;ooextend(item.prototype,klass.prototype);klass.prototype[item.$className]=item.prototype}else if(typeof item=="object"){ooextend(item,klass.prototype)}if(item.$afterInherited){item.$afterInherited(klass,arguments)}if(item.$afterClassDefined){afterClassDefinedList.push(item.$afterClassDefined.bind(item,klass,arguments))}}if(arguments.length>1){var definition=arguments[arguments.length-1];for(var property in definition){var theProperty=definition[property];if(property.substr(0,1)==="$"){klass[property]=theProperty}else{klass.prototype[property]=theProperty}}}klass.toString=function(){return"<{ oo.Class: "+this.$className+" }>"};klass.$isClass=true;klass.prototype.constructor=klass.prototype.$class=klass;oo.classes[oo.classes.length]=klass.$className=className;oo.classesmap[className]=klass;if(afterClassDefinedList.length>0){for(var i in afterClassDefinedList){afterClassDefinedList[i]()}}return klass}};oo.Events={$afterClassDefined:function(klass){if(klass.prototype.events){for(var i in klass.prototype.events){var event=klass.prototype.events[i];klass.prototype[event]=(function(){var $event=event;return function(){if(arguments.length===1&&typeof arguments[0]=="function"){var args=[$event,arguments[0]];this.on.apply(this,args)}else{var args=[$event];ooextend(arguments,args);this.fire.apply(this,args)}return this}})()}}},on:function(event,callback){this.ooevents=this.ooevents||{};this.ooevents[event]=this.ooevents[event]||[];this.ooevents[event].push(callback);return this},fire:function(event){if(this.ooevents&&this.ooevents[event]){var args=[];for(var i=1;i<arguments.length;i++){args.push(arguments[i])}for(var i in this.ooevents[event]){var func=this.ooevents[event][i];func.apply(this,args)}}},removeCallback:function(event,callback){if(this.ooevents&&this.ooevents[event]){for(var i in this.ooevents[event]){var func=this.ooevents[event][i];if(func==callback){this.ooevents[event].splice(i,1);return true}}}return false},withEvent:function(event){var codeblock=arguments[arguments.length-1];if(typeof codeblock!=="function"){throw new oo.IncorrectArgumentsException("withEvent","The last argument must be the codeblock to execute.");}var args=[];for(var i=1;i<arguments.length-1;i++){args.push(arguments[i])}args.unshift("before:"+event);var result=this.fire.apply(this,args);if(typeof result==="boolean"&&result===false){return false}result=codeblock();args.push(result);args[0]=event;this.fire.apply(this,args);return result}};oo.Exception=oo.Class("oo.Exception",{init:function(message){this.message=message},toString:function(){return"oo.Exception: \" + message + \""}});oo.DuplicateClassNameException=oo.Class("oo.DuplicateClassNameException",oo.Exception,{init:function(className){this["oo.Exception"].init("Cannot define a class because '"+className+"' already exists, consider namespacing your class names; e.g. YourCompany."+className)}});oo.IncorrectSyntaxException=oo.Class("oo.IncorrectSyntaxException",oo.Exception,{init:function(className){this["oo.Exception"].init("Incorrect syntax when creating a new instance; don't just call the method, use the new keyword: var obj = new "+className+"();")}});oo.IncorrectArgumentsException=oo.Class("oo.IncorrectArgumentsException",oo.Exception,{init:function(methodName,message){this["oo.Exception"].init("Incorrect syntax when calling "+methodName+"; "+message)}});return oo};var ooextend=function(source,destination){if(typeof source.length!="undefined"&&typeof destination.length!="undefined"){for(var s in source){destination.push(source[s])}}else{for(var s in source){destination[s]=source[s]}}};var oo=ooreset();var oobind=function(){var _func=arguments[0]||null,_obj=arguments[1]||this,_args=[],i=2,l=arguments.length,bound;for(;i<l;i++){_args.push(arguments[i])}bound=function(){var theArgs=[];var i=0;for(i=0,l=_args.length;i<l;i++){theArgs.push(_args[i])}for(i=0,l=arguments.length;i<l;i++){theArgs.push(arguments[i])}return _func.apply(_obj,theArgs)};bound.func=_func;bound.context=_obj;bound.args=_args;return bound};Function.prototype.bind=function(){var theArgs=[],i=0,l=arguments.length;theArgs.push(this);for(;i<l;i++){theArgs.push(arguments[i])}return oobind.apply(window,theArgs)};