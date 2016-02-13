/**
* WeakMap Prototype
* Nomenclature chosen not to shadow native ECMAScript 2015 WeakMap
* To be used as a shim if the native ECMAScript version is not available.
* Be sure to use the WeakMap.prototype.destroy() method upon destruction of the
* WeakMap instance, in order to remove the reference from the privateData object.
* @import com.jsadt.utils.structures.map.shim.WeakMap
**/
if (typeof WeakMap === 'undefined') {
  (function(){

    var privateData = {};

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
      var uuid;
      do{
        uuid = generateUUID();
      }while(privateData[uuid]);
      this.uuid = uuid;
      privateData[uuid] = [];
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
      if(k !== undefined && k !== null){
        for(var i = 0 ; i < map.length ; i++){
          if(map[i][0] === k){
            return map[i][1];
          }
        }
      }
      return undefined;
    };

    WeakMap.prototype.set = function(k,v){
      var map = privateData[this.uuid],
          set = false;
      if(k !== undefined && k !== null && v !== undefined && v !== null){
        for(var i = 0 ; i < map.length ; i++){
          if(map[i][0] === k){
            map[i][1] = v;
            set = true;
            break;
          }
        }
        if(!set){
          map.push([k, v]);
        }
      }
      return this;
    };

    WeakMap.prototype.delete = function(k){
      var map = privateData[this.uuid];
      if(k !== undefined && k !== null){
        for(var i = 0 ; i < map.length ; i++){
          if(map[i][0] === k){
            map.splice(i, 1);
            return true;
          }
        }
      }
      return false;
    };

    WeakMap.prototype.has = function(k){
      var map = privateData[this.uuid];
      if(k !== undefined && k !== null){
        for(var i = 0 ; i < map.length ; i++){
          if(map[i][0] === k){
            return true;
          }
        }
      }
      return false;
    };

    window.WeakMap = WeakMap;
  })();
}
