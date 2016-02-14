/**
* WeakMap Prototype
* Nomenclature chosen not to shadow native ECMAScript 2015 WeakMap
* To be used as a shim if the native ECMAScript version is not available.
* Be sure to use the WeakMap.prototype.destroy() method upon destruction of the
* WeakMap instance, in order to remove the reference from the privateData object.
**/
if (typeof WeakMap === 'undefined' ||
    ($global && $global.test && $global.test.flags && $global.test.flags.WeakMap)) {
  (function(){

    //Private Store for members of WeakMap
    var privateData = { };
    //To ensure map id non-writability
    var keySet = [];

    //Source
    //http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function generateUUID(){
      var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
      var d0 = Math.random()*0xffffffff|0;
      var d1 = Math.random()*0xffffffff|0;
      var d2 = Math.random()*0xffffffff|0;
      var d3 = Math.random()*0xffffffff|0;
      return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+
        lut[d1&0xff]+lut[d1>>8&0xff]+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
    }

    function WeakMap(iterable){
      var uuid,id;
      //To ensure uniqueness of Private Store Key
      do{
        uuid = generateUUID();
      }while(privateData[uuid]);
      //To ensure uniqueness of Map Key
      do{
        id = generateUUID();
      }while(keySet.indexOf(id) !== -1);

      this.uuid = uuid;
      privateData[uuid] = {
        keys: [],
        values: [],
        id: id,
        index: 0
      };

      if(iterable !== undefined && Array.isArray(iterable)){
        for(var i = 0 ; i < iterable.length; i++){
          if(Array.isArray(iterable[i]) && iterable[i].length === 2){
            this.set(iterable[i][0], iterable[i][1]);
          }
        }
      }
    }

    WeakMap.prototype.constructor = WeakMap;

    WeakMap.prototype.destroy = function(){
      delete privateData[this.uuid];
    };

    WeakMap.prototype.get = function(k){
      var map = privateData[this.uuid];
      if(k !== undefined && k !== null && k[map.id] !== undefined){
        return map.values[k[map.id]];
      }else{
        return undefined;
      }
    };

    WeakMap.prototype.set = function(k,v){
      var map = privateData[this.uuid];
      if(k !== undefined && k !== null && (typeof k === 'object' || typeof k === 'function')){
        if(k[map.id] === undefined){
          Object.defineProperty(k, map.id, {
            writable: true,
            enumerable: false,
            configurable: true,
            value: map.index++
          });
          map.keys.push(k);
          map.values.push(v);
        }else if(k[map.id] === null){
          k[map.id] = map.index++;
          map.keys.push(k);
          map.values.push(v);
        }else{
          map.values.push(v);
        }
        return this;
      }else{
        throw new TypeError("Invalid value used as weak map key");
      }
    };

    /**
    * WeakMap Delete Operation
    * Optimized for time complexity.
    * Runs in O(1). Could run in O(n) if optimized for space complexity.
    * It turns out that if it is optimized for space complexity (see commented
    * out code), the browser takes a seemingly infinite amount of time to compute.
    * I am aware of how memory inefficient this is, but I couldn't find any better.
    * @param k Key Object
    * @return Returns true or false depending on whether object has been
    *         successfully deleted or not
    **/
    WeakMap.prototype.delete = function(k){
      var map = privateData[this.uuid];
      if(k !== undefined && k !== null && k[map.id] !== undefined){
        //Optimized for space complexity, O(n)
        /*
        var i = k[map.id];
        k[map.id] = null;
        map.keys.splice(i, 1);
        map.values.splice(i, 1);
        map.index--;
        for(;i < map.keys.length; i++){
          var key = map.keys[i];
          key[map.id] = i;
        }
        */
        //Optimized for time complexity, leaves memory leaks
        //The delete operator is ridiculously time consuming
        //hence the references are simply updated to null
        var i = k[map.id];
        k[map.id] = null;
        map.keys[i] = null;
        map.values[i] = null;
        return true;
      }
      return false;
    };

    WeakMap.prototype.has = function(k){
      var map = privateData[this.uuid];
      return k !== undefined && k !== null && k[map.id] !== undefined && map.keys[k[map.id]] !== undefined;
    };

    if(!($global && $global.test && $global.test.flags && $global.test.flags.WeakMap)){
      window.WeakMap = WeakMap;
    }else{
      $global.test.types.WeakMap = WeakMap;
    }
  })();
}
