/*
  oo
  v1.0
  
  The worlds simplest JavaScript OO implementation.
  For if you just need classes, and nothing else.

  Copyright (c) 2013 Mat Ryer
  Please consider promoting this project if you find it useful.
  Be sure to check out the Licence: https://github.com/stretchrcom/oo#licence
*/
var ooreset=function(){var e={version:"1.0",classes:[],classesmap:{},Class:function(t){if(e.classesmap[t]){throw new e.DuplicateClassNameException(t);return null}var n=function(){this.$initialiseBases.apply(this);this.init.apply(this,arguments)};n.prototype.init=function(){};n.$bases={};n.prototype.$initialiseBases=function(){for(var e in this.$class.$bases){var t=this.$class.$bases[e];for(var n in t.prototype){if(typeof t.prototype[n]=="function"){if(n.substr(0,1)!="$"){t.prototype[n]=t.prototype[n].bind(this)}}}}};for(var r=1,i=arguments.length-1;r<i;r++){var s=arguments[r];if(s.$isClass){n.$bases[s.$className]=s;ooextend(s.prototype,n.prototype);n.prototype[s.$className]=s.prototype}else if(typeof s=="object"){ooextend(s,n.prototype)}}if(arguments.length>1){ooextend(arguments[arguments.length-1],n.prototype)}n.toString=function(){return"<{ oo.Class: "+this.$className+" }>"};n.$isClass=true;n.prototype.constructor=n.prototype.$class=n;e.classes[e.classes.length]=n.$className=t;return e.classesmap[t]=n}};e.Exception=e.Class("oo.Exception",{init:function(e){this.message=e},toString:function(){return'<{ oo.Exception: " + message + " }>'}});e.DuplicateClassNameException=e.Class("oo.DuplicateClassNameException",e.Exception,{init:function(e){"Cannot define a class because '"+e+"' already exists."}});return e};var ooextend=function(e,t){for(var n in e){t[n]=e[n]}};var oo=ooreset();var oobind=function(){var e=arguments[0]||null,t=arguments[1]||this,n=[],r=2,i=arguments.length,s;for(;r<i;r++){n.push(arguments[r])}s=function(){var r=[];var s=0;for(s=0,i=n.length;s<i;s++){r.push(n[s])}for(s=0,i=arguments.length;s<i;s++){r.push(arguments[s])}return e.apply(t,r)};s.func=e;s.context=t;s.args=n;return s};Function.prototype.bind=function(){var e=[],t=0,n=arguments.length;e.push(this);for(;t<n;t++){e.push(arguments[t])}return oobind.apply(window,e)}