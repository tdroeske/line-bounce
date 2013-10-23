
function Player(Sprite){
	this.bounceEntity = new BouncableEntity(this);
	this.x=game.screen.width/2;
	this.y=game.screen.height/2;
	
	this.sprite = Sprite;
	this.sprite.show();
	this.sprite.ready = true;
	this.sprite.move(this.x-this.sprite.width/2,this.y-this.sprite.width/2);
	scene.add(this.sprite);
}

Player.prototype.update = function(delta){
	
};

Player.prototype.getX = function(){
	return this.x;
};
Player.prototype.getY = function(){
	return this.y;
};
Player.prototype.resetGame = function(){
	this.x=game.screen.width/2;
	this.y=game.screen.height/2;
	this.bounceEntity.velocity.set(0);
	this.sprite.move(this.x-this.sprite.width/2,this.y-this.sprite.width/2);
};
