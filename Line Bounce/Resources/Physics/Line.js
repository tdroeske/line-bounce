/**
 * Constructs a line, a line is defined by a single point, and a vector with a positive Y translation.
 * The second Y point is higher than the first, the second X point may not be.
 * A line also has a variable called "left" which determines if the second point is to the left of the first point or not.
 * This means that a line is left it is shaped like "\", but is right if it is shaped like "/" or "|".
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
function Line(x1,y1,x2,y2){
	if(y1<=y2){
		this.x=x1;
		this.y=y1;
		
		if(x1===x2)
			this.x=x1+.01;
		if(y1===y2)
			this.y=y1+.01;
			
		this.vector = new Vector2D(x2-this.x,y2-this.y);
		this.left = x2<this.x;
	}
	else{
		this.x=x2;
		this.y=y2;
		
		if(x1===x2)
			this.x=x2+.01;
		if(y1===y2)
			this.y=y2+.01;
		
		this.vector = new Vector2D(x1-this.x,y1-this.y);
		this.left = x1<this.x;
	}
}

// Length of the line. Length of the "vector" variable of the line.
Line.prototype.length = function(){
	return this.vector.length();
};

/**
 * Takes a line, a point, and a distance and returns 'true' if the point is within distance of the line.
 * @param {Object} Line
 * @param {Object} Point
 * @param {Object} distance
 */
function isPointWithin(Line, Point, distance){
	return Line.isPointWithin(Point, distance);
}


/**
 *	Returns the slope of a line 
 */
Line.prototype.slope = function(){
	if(this.vector.x === this.x)
		return 10000;
		if(this.vector.x === 0)
		return this.vector.y/.00001;
	return (this.vector.y)/(this.vector.x);
};

/**
 * Takes a point and a distance and determines if the point is within 'distance' of the line. 
 * @param {Object} Point
 * @param {Object} distance
 */
Line.prototype.isPointWithin = function(Point, distance){
	var actualDist = Math.abs( (this.vector.x)*(this.y-Point.y)-(this.x-Point.x)*(this.vector.y) );
	var actualDistDiv = Math.sqrt(this.vector.x*this.vector.x+this.vector.y*this.vector.y);
	
	if(actualDistDiv === 0)
		actualDist = actualDist / .0001;
	else
		actualDist = actualDist / actualDistDiv;
		
	return this.containedWithin(Point,distance) && (actualDist <= distance);
};

/**
 * Returns the distance from the line 
 */
Line.prototype.pointDistance = function(Point){
	var actualDist = Math.abs( (this.vector.x)*(this.y-Point.y)-(this.x-Point.x)*(this.vector.y) );
	var actualDistDiv = Math.sqrt(this.vector.x*this.vector.x+this.vector.y*this.vector.y);
	
	if(actualDistDiv === 0)
		actualDist = actualDist / .0001;
	else
		actualDist = actualDist / actualDistDiv;
		
	return actualDist;
};

/**
 *	returns whether the point is contained within a box around the line that is "distance" bigger on all sides than the line itself
 * A box of size 2 by 2 with a distance of 1 would check if the point is within 4x4 of the line (since an extra 1 on each side)
 * 
 * Supposed to be used in the "isPointWithing(Point, distance)" function
 * 
 * Can also be used to see if a line intersects another line by setting Distance to 0, and putting the intersect point as 'Point'
 *  
 */
Line.prototype.containedWithin = function(Point, distance){
	if(this.left){
		if(Point.x <= this.x+distance && 
			Point.x >= this.x+this.vector.x-distance && 
			Point.y >= this.y-distance &&
			Point.y <= this.y+this.vector.y+distance ){
				return true;
			}
	}
	else{
		if(Point.x >= this.x-distance && 
			Point.x <= this.x+this.vector.x+distance && 
			Point.y >= this.y-distance &&
			Point.y <= this.y+this.vector.y+distance ){
				return true;
			}
	}
	return false;
};

/**
 * Provide the function with the Point you wish to test, as well as the 'distance' that is being used for that point.
 * The 'distance' should be the distance used within the other methods. If you don't have a distance, make this number
 * bigger than the object that the point is refering to, or just make it a large number.
 * 
 * 
 * This function will return 'true' if the point is "Above or equal to" the line. On a graph, the 'Point' will actually be below
 * the line, but because of the way the canvas is shaped, below becomes above.
 * This function returns 'false' if the point is "Below" the line on a canvas.
 * @param {Object} Point
 */
Line.prototype.pointIsAbove = function(Point, distance){
	
	var ratio;
	if(this.vector.x !== 0)
		ratio = this.vector.y/this.vector.x;
	else
		ratio = this.vector.y/.0001;
	
	
	var tempx;
	var tempy;
	if(this.left){
	 tempx = this.x+distance*2;
	 tempy = this.y+distance*2*ratio;
	 }else{
	 tempx = this.x-distance*2;
	 tempy = this.y-distance*2*ratio;
	}
	
	
	if(this.left){
		
		var newslope; 
		if(tempx !== Point.x)
			newslope = (tempy-Point.y)/(tempx-Point.x);
		else
			newslope = (tempy-Point.y)/(.0001);
			
		if(newslope > ratio)
			return false;
		else
			return true;
	}else{
		
		var newslope; 
		if(tempx !== Point.x)
			newslope = (tempy-Point.y)/(tempx-Point.x);
		else
			newslope = (tempy-Point.y)/(.0001);
			
		if(newslope <= ratio)
			return true;
		else
			return false;
	}

};


/**
 * Returns NULL if the lines do not intersect
 * Returns the Point they intersect at if they do 
 * @param {Object} OtherLine
 */
Line.prototype.intersectPoint = function(OtherLine){
	
	var x1 = this.x;
	var y1 = this.y;
	var x2 = this.x+this.vector.x;
	var y2 = this.y+this.vector.y;
	var x3 = OtherLine.x;
	var y3 = OtherLine.y;
	var x4 = OtherLine.x+OtherLine.vector.x;
	var y4 = OtherLine.y+OtherLine.vector.y;
	
	var denom = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
	if(denom === 0)
		return null;
	var newXcoord = (x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4);
	newXcoord /= denom;
	var newYcoord = (x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4);
	newYcoord /= denom;
	
	// var thisSlope = this.slope();
	// var otherSlope = OtherLine.slope();
// 	
	// if(thisSlope === otherSlope)
		// return null;
// 	
	// var thisYintercept = this.y-thisSlope*this.x;
	// var otherYintercept = OtherLine.y-otherSlope*OtherLine.x;
// 	
	// var newXcoord = (thisYintercept-otherYintercept)/(thisSlope-otherSlope);
	// var newYcoord = otherYintercept + otherSlope * newXcoord;
	
	return new Point(newXcoord, newYcoord);
};

/**
 * Takes a Velocity and reflects it perfectly off this line.
 * Power is a multiplier, which will multiply the velocity by an amount provided.
 * @param {Object} Velocity
 * @param {Object} Point
 * @param {Object} distance
 */
Line.prototype.reflectVelocity = function(Velocity, power){
			var vVec = new Vector2D(Velocity.xvelocity,Velocity.yvelocity);
			var rVec = vVec.multiply(1);
			var nVec = this.vector.perp().negEquals();
			
			nVec = nVec.unitEquals();
			rVec = rVec.unitEquals();
			
			var vDotN = rVec.dot(nVec);
			
			rVec = nVec.multiplyEquals(vDotN);
			rVec = rVec.multiplyEquals(-2);
			rVec = rVec.addEquals(vVec.unit());
			rVec = rVec.multiplyEquals(vVec.length());
			Ti.API.info("rVec B"+rVec.length());
			// multiplier
			rVec.addEquals(rVec.unit().multiplyEquals(power));
			Ti.API.info("rVec A"+rVec.length());
			
			Velocity.setExactly(rVec.x,rVec.y);
};