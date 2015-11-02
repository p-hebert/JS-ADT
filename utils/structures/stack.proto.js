/**
* Stack Prototype
* Implementation of the Stack ADT with Generics enabled.
* If the type is not specified, act as a Stack ADT without Generics.
* @param capacity {int} Maximum capacity of the stack.
* @param type {object / function} Either an object of the Generic type or the
* constructor of the Generic type. Requires a constructor function.
**/
function Stack(capacity, type){
  this._data = [];
  /*
  * Maximum capacity of the Stack.
  * Acts as upper bound for the _data.length
  * @default: 18000 ; 5 transmission per second, for an hour.
  */
  this._capacity =  (capacity !== undefined && capacity > 0)? capacity : 18000;

  //type is an object if the generic type
  if(type !== undefined && typeof type.constructor === 'function'){
    this._type = type;
  }else{
    this._type = undefined;
  }
}

Stack.prototype.constructor = Stack;

/**
* Internal method that emulates Generics behaviour
* @return {boolean} True if the element is of the Generics type or if Generics
* are disabled.
* @throws {IllegalArgumentException} If the element does not match the Generics type
**/
Stack.prototype._checkType = function(element){
  if(this._type !== undefined){
    if(element instanceof this._type){
      return true;
    }else{
      console.error(element);
      throw new IllegalArgumentException("Parameter does not match the Generic Type " + this._type.name);
    }
  }else{
    return true;
  }
};

Stack.prototype.push = function(element){
  if(this._checkType(element)){
    while(this._data.length >= this._capacity){
      this._data.shift();
    }
    this._data.push(element);
  }
};

Stack.prototype.peek = function(index){
  if(typeof index === "number" && index > -1 && index < this._data.length){
    return this._data[index];
  } else {
    return undefined;
  }
};

Stack.prototype.top = function(){
  return this._data[this._data.length -1];
};

Stack.prototype.pop = function(){
  return this._data.pop();
};

Stack.prototype.size = function(){
  return this._data.length;
};

Stack.prototype.getCapacity = function() {
  return this.capacity;
};

Stack.prototype.setCapacity = function(capacity) {
  if(typeof capacity === "number" && capacity > 0){
    this.capacity = capacity;
  }else{
    throw new IllegalArgumentException("Parameter is not a valid number within accepted range (1, Integer.MAX)");
  }
};
