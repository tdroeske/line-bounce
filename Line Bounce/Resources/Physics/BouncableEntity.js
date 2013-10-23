// Moved to app.js, here for reference
// var BouncableEntities = [];
// var BounceLines = [];

/*****************
 *
 * nogravity = true; // Not affected by gravity
 * nomultiplier = true; // Doesn't have its speed multiplied when it hits something (projectiles)
 * 
 *  
 */

function BouncableEntity(Parent){
	this.parent = Parent;
	this.velocity = new Velocity(Parent);
	this.unsafeLines = [];
	this.addLinesUnsafe();
}

BouncableEntity.addLine = function(Line){
	var LE = [];
	var totalsize = Line.length();
	while(BounceLines.length > 0){
		var ent = BounceLines.pop();
		totalsize+=ent.length();
		LE.push(ent);
	}
	BounceLines = LE;
	
	while(BounceLines.length > 0 && totalsize > TOTAL_LINE_LENGTH){
		var ent = BounceLines.pop();
		totalsize-=ent.length();
		if(ent.sprite !== null && ent.sprite !== undefined){
			ent.sprite.hide();
			scene.remove(ent.sprite);
			ent.sprite.dispose();
		}
	}
	reverseLineArray();
	
	
	BounceLines.push(Line);
	// // Add line as unsafe to everything
	// var BE = [];
	// LineBouncePlayer.bounceEntity.addLineUnsafe(Line);
	// while(BouncableEntities.length > 0){
		// var ent = BouncableEntities.pop();
		// ent.addLineUnsafe(Line);
		// BE.push(ent);
	// }
	// BouncableEntities = BE;
 };

/*
 * Removes a BouncableEntity object from the list of BouncableEntities. Good for when something that uses BouncableEntity no longer exists.
 */
BouncableEntity.deleteBouncableEntity = function(BouncableEntity) {
	var index = BouncableEntities.indexOf(BouncableEntity);
	if (index > -1) {
		delete BouncableEntities[index];
		BouncableEntities.splice(index, 1);
	}
};

/**
 * Adds all the Lines contained within the provided array to the entities list of lines it deems unsafe to bounce off of. 
 * @param {Object} Lines
 */
BouncableEntity.prototype.addLinesUnsafe = function(){
	var LE = [];
	while(BounceLines.length > 0){
		var ent = BounceLines.pop();
		this.unsafeLines.push(ent);
		LE.push(ent);
	}
	BounceLines = LE;
	reverseLineArray();
};

/**
 * Adds a line to the list of unsafe lines to bounce off of. 
 * @param {Object} Lines
 */
BouncableEntity.prototype.addLineUnsafe = function(Line){
	this.unsafeLines.push(Line);
};

/**
 *	This method will make the Entity check each line it considers unsafe and check if it is now safe.
 */
BouncableEntity.prototype.checkUnsafeLines = function(Point, distance){
	var USL = [];
	while( this.unsafeLines.length > 0 ){
		var unline = this.unsafeLines.pop();
		if(unline.isPointWithin(Point,distance)){
			USL.push(unline);
		}
	}
	this.unsafeLines = USL;
};

BouncableEntity.prototype.update = function(delt){
	var mvec = this.velocity.limitReturn(this.velocity.length()*delt);
	var increm = mvec.length() > this.parent.sprite.width/2;
	var incrnum;
	var incrvec;
	var incrfin;
	Ti.API.info("increm "+increm);
	if(increm){
		incrnum = Math.floor(mvec.length()/(this.parent.sprite.width/2));
		incrvec = this.velocity.limitReturn(this.parent.sprite.width/2);
		incrfin = this.velocity.limitReturn(mvec.length()-incrnum*incrvec.length());
		this.updateMultimove(incrnum, incrvec, incrfin);
		return;
	}
	
	//  move in the direction
	this.parent.x += mvec.x;
	this.parent.y += mvec.y;
	var mpoint = new Point(this.parent.x, this.parent.y);
	
	var BL = [];
	// For each line
	while(BounceLines.length > 0){
		var cline = BounceLines.pop();
		BL.push(cline);
		// If the line is safe
		if(this.unsafeLines.indexOf(cline) < 0){
			if(cline.isPointWithin(mpoint, this.parent.sprite.width/2)){
				this.addLineUnsafe(cline);
				
				var multifactor = 0;
				
				if(this.nomultipier != true){
					multifactor = BouncableEntity.getMultiplier(cline);
				}
	
				// And reflect the players vector
				cline.reflectVelocity(this.velocity, multifactor);
				
				while(BounceLines.length > 0){
					var moveline = BounceLines.pop();
					BL.push(moveline);
				}
				BounceLines = BL;
				reverseLineArray();
				return;
			}
		}
	}
	BounceLines = BL;
	reverseLineArray();
};


BouncableEntity.prototype.updateMultimove = function(incrnum, incrvec, incrfin){
	for(var i=0;i<=incrnum;i++){
		if(i===incrnum){
			//  move in the direction
			this.parent.x += incrfin.x;
			this.parent.y += incrfin.y;
			var mpoint = new Point(this.parent.x, this.parent.y);
			
			var BL = [];
			// For each line
			while(BounceLines.length > 0){
				var cline = BounceLines.pop();
				BL.push(cline);
				// If the line is safe
				if(this.unsafeLines.indexOf(cline) < 0){
					if(cline.isPointWithin(mpoint, this.parent.sprite.width/2)){
						this.addLineUnsafe(cline);
						
						var multifactor = 0;
						if(this.nomultipier != true){
							multifactor = BouncableEntity.getMultiplier(cline);
						}
			
						// And reflect the players vector
						cline.reflectVelocity(this.velocity, multifactor);
						
						while(BounceLines.length > 0){
							var moveline = BounceLines.pop();
							BL.push(moveline);
						}
						BounceLines = BL;
						reverseLineArray();
						return;
					}
				}
			}
			BounceLines = BL;
			reverseLineArray();
		}else{
			//  move in the direction
			this.parent.x += incrvec.x;
			this.parent.y += incrvec.y;
			var mpoint = new Point(this.parent.x, this.parent.y);
			
			var BL = [];
			// For each line
			while(BounceLines.length > 0){
				var cline = BounceLines.pop();
				BL.push(cline);
				// If the line is safe
				if(this.unsafeLines.indexOf(cline) < 0){
					if(cline.isPointWithin(mpoint, this.parent.sprite.width/2)){
						this.addLineUnsafe(cline);
						
						var multifactor = 0;
						if(this.nomultipier != true){
							multifactor = BouncableEntity.getMultiplier(cline);
						}
						Ti.API.info("vel before "+this.velocity.length());
						// And reflect the players vector
						cline.reflectVelocity(this.velocity, multifactor);
						Ti.API.info("vel after "+this.velocity.length());
						
						while(BounceLines.length > 0){
							var moveline = BounceLines.pop();
							BL.push(moveline);
						}
						BounceLines = BL;
						reverseLineArray();
						return;
					}
				}
			}
			BounceLines = BL;
			reverseLineArray();
		}
	}
};

BouncableEntity.getMultiplier = function(cline){
	var multifactor = 8-4*(cline.length()/(game.screen.width));
	if(multifactor < 4)
		multifactor = 4;
	if(multifactor > 8)
		multifactor = 8;
	multifactor *= GRAVITY/4*multifactor;
	Ti.API.info("multifactor = "+multifactor);
	return multifactor;
};

BouncableEntity.checkUnsafeLines = function(){
	var BE = [];
	while(BouncableEntities.length > 0){
		var ent = BouncableEntities.pop();
		var entpoint = new Point(ent.parent.x,ent.parent.y);
		ent.checkUnsafeLines(entpoint, ent.parent.sprite.width/1.95);
		BE.push(ent);
	}
	BouncableEntities = BE;
};


BouncableEntity.adjustEntities = function(amount){
	// Adjust bouncable entities down @TODO remove this, we'll do it in an entity datastructure later
	var BE = [];
	while(BouncableEntities.length > 0){
		var ent = BouncableEntities.pop();
		ent.parent.y+=amount;
		ent.parent.sprite.move(ent.parent.x-ent.parent.sprite.width/2, ent.parent.y-ent.parent.sprite.width/2);
		BE.push(ent);
	}
	BouncableEntities = BE;
	
	// Adjust lines down
	var LE = [];
	while(BounceLines.length > 0){
		var ent = BounceLines.pop();
		// Move the line
		ent.y+=amount;
		// Move the sprite
		if(ent.sprite != null && ent.sprite != undefined){
			ent.sprite.move(ent.sprite.x,ent.sprite.y+amount);
		}
		// Check if the line is on the screen
		if(ent.y <= game.screen.height){
			LE.push(ent);
		}
		// Otherwise destroy the sprite if it's off the screen'
		else if(ent.sprite != null && ent.sprite != undefined){
			ent.sprite.hide();
			ent.sprite.dispose();
		}
	}
	BounceLines = LE;
	reverseLineArray();
};

function reverseLineArray(){
	var LE = [];
	while(BounceLines.length > 0){
		var ent = BounceLines.pop();
		LE.push(ent);
	}
	BounceLines = LE;
}

function resetLines(){
	while(BounceLines.length > 0){
		var ent = BounceLines.pop();
		if(ent.sprite !== null && ent.sprite !== undefined){
			ent.sprite.hide();
			scene.remove(ent.sprite);
			ent.sprite.dispose();
		}
	}
	
	walls_TESTBOTTOM = new Line(game.screen.width*1/4,game.screen.height,game.screen.width*3/4,game.screen.height);
    BounceLines = [];
    BouncableEntity.addLine(walls_TESTBOTTOM);
}

function resetBouncableEntities(){
	while(BouncableEntities.length > 0){
		var ent = BouncableEntities.pop();
		if(ent.parent.sprite !== null && ent.parent.sprite !== undefined){
			ent.parent.sprite.hide();
			scene.remove(ent.parent.sprite);
			ent.parent.sprite.dispose();
		}
	}
    BouncableEntities = [];
}
