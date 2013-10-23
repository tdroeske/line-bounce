function Point(x,y){
	this.x=x;
	this.y=y;
}

function distancePointToPoint(Point1,Point2){
	return Math.sqrt((Point1.x-Point2.x)*(Point1.x-Point2.x)+(Point1.y-Point2.y)*(Point1.y-Point2.y));
}

Point.prototype.distance = function(Point){
	return Math.sqrt((this.x-Point.x)*(this.x-Point.x)+(this.y-Point.y)*(this.y-Point.y));
};
