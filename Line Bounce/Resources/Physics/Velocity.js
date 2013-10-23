/**
 * Constructs a basic velocity object
 */
function Velocity(Parent) {
    this.parent = Parent;
    this.xvelocity = 0;
    this.yvelocity = 0;
}

/**
 *	Returns a value equal to the length of the velocity.
 */
Velocity.prototype.length = function(){
	return Math.sqrt(this.yvelocity*this.yvelocity+this.xvelocity*this.xvelocity);
};

/**
 * Limits the velocity of this object to a maximum length provided. Effectively caps speed at a certain value.
 * @param {Object} value
 */
Velocity.prototype.limit = function(value){
	if(this.length() > value){
		var tempVector = new Vector2D(this.xvelocity,this.yvelocity);
		tempVector.unitEquals();
		tempVector.multiplyEquals(value);
		this.xvelocity=tempVector.x;
		this.yvelocity=tempVector.y;
	}
};


/**
 * Limits the velocity of this object to a maximum length provided. Effectively caps speed at a certain value.
 * @param {Object} value
 */
Velocity.prototype.set = function(value){
	
		var tempVector = new Vector2D(this.xvelocity,this.yvelocity);
		tempVector.unitEquals();
		tempVector.multiplyEquals(value);
		this.xvelocity=tempVector.x;
		this.yvelocity=tempVector.y;
	
};

Velocity.prototype.setExactly = function(x,y){
	this.xvelocity = x;
	this.yvelocity = y;
};

/**
 * Limits the velocity of this object to a maximum length provided. Returns the vector.
 * @param {Object} value
 */
Velocity.prototype.limitReturn = function(value){
	var tempVector = new Vector2D(this.xvelocity,this.yvelocity);
	tempVector.unitEquals();
	tempVector.multiplyEquals(value);
	return tempVector;
};

/**
 * Adds the provided amount to the velocity vector
 * @param {Object} value
 */
Velocity.prototype.add = function(value){
	var tempVector = new Vector2D(this.xvelocity,this.yvelocity);
	tempVector.unitEquals();
	tempVector.addEquals(value);
	this.xvelocity+=tempVector.x;
	this.xvelocity+=tempVector.y;
	delete tempVector;
};
