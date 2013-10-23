

function LineBouncePhysics(){}

LineBouncePhysics.update = function(delta){
	var delt = delta/1000;
	BouncableEntity.checkUnsafeLines();
	var BEARRAY = [];
	while(BouncableEntities.length > 0){
		var BE = BouncableEntities.pop();
		
		//apply gravity
		if(BE.nogravity != true)
			BE.velocity.yvelocity += delt * GRAVITY;
		
		BE.velocity.limit(SPEED_LIMIT);
		
		//update entity
		if(BE.noupdate != true)
			BE.update(delt);
		
		// If it's still on screen, then push it back onto the stack
		if(BE.parent.y < game.screen.height+BE.parent.sprite.height*2 &&
		   BE.parent.x < game.screen.width+BE.parent.sprite.width*2 &&
		   BE.parent.y > BE.parent.sprite.height*-2 &&
		   BE.parent.x > BE.parent.sprite.width*-2 ){
			BEARRAY.push(BE);
			BE.parent.sprite.move(BE.parent.x-BE.parent.sprite.width/2, BE.parent.y-BE.parent.sprite.width/2);
		}
		else{
			//@TODO GET RID OF IT
			BE.parent.sprite.hide();
			scene.remove(BE.parent.sprite);
			BE.parent.sprite.dispose();
		}
		if(BE.hostile === true){
			var BEp = new Point(BE.parent.x, BE.parent.y);
			var Plp = new Point(LineBouncePlayer.x, LineBouncePlayer.y);
			if(BEp.distance(Plp) < BE.parent.sprite.width/2 + LineBouncePlayer.sprite.width/2){
				if(BEp.y >= Plp.y){
					if(BE.parent.sprite !== null && BE.parent.sprite !== undefined){
						BE.parent.sprite.hide();
						scene.remove(BE.parent.sprite);
						BE.parent.sprite.dispose();
					}
					var index = BEARRAY.indexOf(BE);
					if (index > -1) {
						delete BEARRAY[index];
						BEARRAY.splice(index, 1);
					}
				}
				else{
					while(BouncableEntities.length > 0){
					BE = BouncableEntities.pop();
					BEARRAY.push(BE);
					}
					BouncableEntities = BEARRAY;
					resetGame();
					return;
				}
			}
		}
	}
	BouncableEntities = BEARRAY;
	
	Ti.API.info("BEFORE PLAYER");
	// Handle player seperately
	var ent = LineBouncePlayer.bounceEntity;
	var entpoint = new Point(ent.parent.x,ent.parent.y);
	ent.checkUnsafeLines(entpoint, ent.parent.sprite.width/1.95);

	LineBouncePlayer.bounceEntity.velocity.yvelocity += delt * GRAVITY;
	LineBouncePlayer.bounceEntity.velocity.limit(SPEED_LIMIT);
	LineBouncePlayer.bounceEntity.update(delt);
	Ti.API.info("AFTER PLAYER");
	// Bounce off the walls
	if(LineBouncePlayer.x < LineBouncePlayer.sprite.width/2){
		LineBouncePlayer.x = LineBouncePlayer.sprite.width/2;
		LineBouncePlayer.bounceEntity.velocity.xvelocity = Math.abs(LineBouncePlayer.bounceEntity.velocity.xvelocity);
	}
	if(LineBouncePlayer.x > game.screen.width - LineBouncePlayer.sprite.width/2){
		LineBouncePlayer.x = game.screen.width - LineBouncePlayer.sprite.width/2;
		LineBouncePlayer.bounceEntity.velocity.xvelocity = -1*Math.abs(LineBouncePlayer.bounceEntity.velocity.xvelocity);
	}
	
	// If the player would move above center screen, move him back and call the "AdjustScreen" method
	var midpoint = game.screen.height*2/5;
	if(LineBouncePlayer.y < midpoint){
		adjustScreen(midpoint-LineBouncePlayer.y);
		LineBouncePlayer.y = midpoint;
		LineBouncePlayer.sprite.move(LineBouncePlayer.x-LineBouncePlayer.sprite.width/2,LineBouncePlayer.y-LineBouncePlayer.sprite.width/2);
	}
	else{
		var BE = LineBouncePlayer.bounceEntity;
		BE.parent.sprite.move(BE.parent.x-BE.parent.sprite.width/2, BE.parent.y-BE.parent.sprite.width/2);
	}
	if(LineBouncePlayer.y - LineBouncePlayer.sprite.height > game.screen.height){
		resetGame();
	}
};
