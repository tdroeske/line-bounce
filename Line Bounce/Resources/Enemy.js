var EnemyEntities = [];
function StandStillEnemy(x,y){
	this.sprite = alloy.createSprite({image: 'graphics/pig.png',width: 50,height: 50});
	this.x = x+this.sprite.width/2;
	this.y = y+this.sprite.height/2;
	this.sprite.move(x,y);
	scene.add(this.sprite);
	this.sprite.show();
	this.bouncableEntity = new BouncableEntity(this);
	this.bouncableEntity.noupdate = true; // Not affected by updates
	this.bouncableEntity.hostile = true;
	this.bouncableEntity.velocity.xvelocity = 0;
	this.bouncableEntity.velocity.yvelocity = 0;
	BouncableEntities.push(this.bouncableEntity);
}


function ShooterEnemy(x,y){
	this.sprite = alloy.createSprite({image: 'graphics/pig.png',width: 50,height: 50});
	this.x = x+this.sprite.width/2;
	this.y = y+this.sprite.height/2;
	this.sprite.move(x,y);
	scene.add(this.sprite);
	this.sprite.show();
	this.shotTimer = 0;
	this.shootTimer = 6000;
}
function ShooterEnemyShot(x,y){
	this.sprite = alloy.createSprite({image: 'graphics/Fireball.png',width: 35,height: 35});
	this.x = x;
	this.y = y;
	this.sprite.move(x-this.sprite.width/2,y-this.sprite.height/2);
	scene.add(this.sprite);
	this.sprite.show();
	
	// bounce entity stuff
	this.bouncableEntity = new BouncableEntity(this);
	this.bouncableEntity.nogravity = true; // Not affected by gravity
	this.bouncableEntity.nomultipier = true; // Not affected by multiplier
	
	this.aimAtPlayer();
	
	BouncableEntities.push(this.bouncableEntity);
}
ShooterEnemy.prototype.update = function(delta){
	this.shotTimer+=delta;
	if(this.shotTimer >= this.shootTimer){
		this.shotTimer -= this.shootTimer;
		var shot = new ShooterEnemyShot(this.x, this.y);
	}
};
ShooterEnemyShot.prototype.aimAtPlayer = function(){
	var px = LineBouncePlayer.x;
	var py = LineBouncePlayer.y;
	this.bouncableEntity.velocity.xvelocity = px-this.x;
	this.bouncableEntity.velocity.yvelocity = py-this.y;
	this.bouncableEntity.velocity.set(100); // Moves at '50' pixels per second
};
ShooterEnemyShot.prototype.update = function(delta){};
