/**
* Generics Support for Javascript
* Can be included in any class to enforce dynamic strong typing
**/
var Generics = (function() {

  var privateData = new WeakMap();

  function Generics(T){
    var privateMembers = {};
    if(T !== undefined && typeof T.constructor === 'function'){
      privateMembers.type = T;
    }else if(typeof T === 'string' || typeof T === 'number' || typeof T === 'boolean'){
      privateMembers.type = typeof T;
    }else{
      privateMembers.type = undefined;
    }
    privateData.set(this, privateMembers);
  }

  Generics.prototype.constructor = Generics;

  /**
  * Internal method that emulates Generics behaviour
  * @return {boolean} True if the element is of the Generics type or if Generics
  * are disabled.
  * @throws {IllegalArgumentException} If the element does not match the Generics type
  **/
  Generics.prototype.checkType = function(t){
    var T = privateData.get(this).type;
    if(T !== undefined && typeof T.constructor === 'function'){
      if(t instanceof T){
        return true;
      }else{
        console.error(T);
        throw new IllegalArgumentException("Parameter does not match the Generic Type " + T.name);
      }
    }else if(typeof T === 'string'){
      if(typeof t === 'string') return true;
      else throw new IllegalArgumentException("Parameter does not match the Generic Type string");
    }else if(typeof T === 'number'){
      if(typeof t === 'number') return true;
      else throw new IllegalArgumentException("Parameter does not match the Generic Type number");
    }else if(typeof T === 'boolean'){
      if(typeof t === 'boolean') return true;
      else throw new IllegalArgumentException("Parameter does not match the Generic Type boolean");
    }else{
      return true;
    }
  };
}());
