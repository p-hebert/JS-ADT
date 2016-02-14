/**
* Map Prototype
* Nomenclature chosen not to shadow native ECMAScript 2015 Map
* To be used as a shim if the native ECMAScript version is not available.
* Be sure to use the Map.prototype.destroy() method upon destruction of the
* Map instance, in order to remove the reference from the privateData object.
* @import com.jsadt.utils.structures.map.shim.WeakMap
**/
if (typeof Map === 'undefined' ||
    ($global && $global.test && $global.test.flags && $global.test.flags.Map)) {
  (function(){

    //Private Store for members of Map
    var privateData = new WeakMap();

    /**
    * Inner Class HashMap
    * Object with the WeakMap interface used as a HashMap
    **/
    function HashMap(){
      return {
        get: function(k){
          return this.store[k];
        },
        set: function(k, v){
          this.store[k] = v;
          return this;
        },
        has: function(k){
          return this.store[k] !== undefined;
        },
        delete: function(k){
          if(this.store[k] !== undefined){
            delete this.store[k];
            return true;
          }
          return false;
        },
        store: {}
      };
    }

    function Map(iterable){
      var privateMembers = {
        'weak': new WeakMap(),
        'hash': new HashMap(),
        'null': undefined,
        'nullIsIndex': false,
        'undefined': undefined,
        'undefinedIsIndex': false
      };
      privateData.set(this, privateMembers);

      if(iterable !== undefined && Array.isArray(iterable)){
        for(var i = 0 ; i < iterable.length; i++){
          if(Array.isArray(iterable[i]) && iterable[i].length === 2){
            this.set(iterable[i][0], iterable[i][1]);
          }
        }
      }
    }

    Map.prototype.constructor = Map;
    Map.prototype.size = 0;

    Map.prototype.destroy = function(){
      return privateData.delete(this);
    };

    Map.prototype.get = function(k){
      var map = privateData.get(this);
      if(k!== undefined && k !== null && typeof k === 'function' || typeof k === 'object'){
        return map.weak.get(k);
      }else if(k === undefined){
        return map.undefined;
      }else if(k === null){
        return map.null;
      }else{
        return map.hash.get(k);
      }
    };

    //Yes, the ECMAScript 2015 Map support NULL and undefined indexes, if you were wondering.
    Map.prototype.set = function(k,v){
      var map = privateData.get(this);
      if(k!== undefined && k !== null && typeof k === 'function' || typeof k === 'object'){
        if(!map.weak.has(k)) this.size++;
        map.weak.set(k,v);
      }else if(k === undefined){
        map.undefined = v;
        if(!map.undefinedIsIndex) this.size++;
        map.undefinedIsIndex = true;
      }else if(k === null){
        map.null = v;
        if(!map.nullIsIndex) this.size++;
        map.nullIsIndex = true;
      }else if(k !== 'undefined' && k !== 'null'){
        if(!map.hash.has(k)) this.size++;
        map.hash.set(k,v);
      }
      return this;
    };

    Map.prototype.delete = function(k){
      var map = privateData.get(this),
          deleted = false;
      if(k!== undefined && k !== null && typeof k === 'function' || typeof k === 'object'){
        deleted = map.weak.delete(k) && true;
        if(deleted) this.size--;
        return deleted;
      }else if(k === undefined){
        if(map.undefinedIsIndex){
          map.undefined = undefined;
          map.undefinedIsIndex = false;
          this.size--;
          return true;
        }else{
          return false;
        }
      }else if(k === null){
        if(map.nullIsIndex){
          map.null = undefined;
          map.nullIsIndex = false;
          this.size--;
          return true;
        }else{
          return false;
        }
      }else{
        deleted = map.hash.delete(k) && true;
        if(deleted) this.size--;
        return deleted;
      }
    };

    Map.prototype.has = function(k){
      var map = privateData.get(this);
      if(k!== undefined && k !== null && typeof k === 'function' || typeof k === 'object'){
        return map.weak.get(k) && true;
      }else if(k === undefined){
        return map.undefined && true;
      }else if(k === null){
        return map.null && true;
      }else{
        return map.hash.get(k) && true;
      }
    };

    if(!($global && $global.test && $global.test.flags && $global.test.flags.Map)){
      window.Map = Map;
    }else{
      $global.test.types.Map = Map;
    }
  })();
}
