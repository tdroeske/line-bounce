var window = Ti.UI.createWindow({backgroundColor:'white',
    orientationModes: [
        Ti.UI.PORTRAIT,
        Ti.UI.UPSIDE_PORTRAIT
    ]
});

// Obtain module and create game view
var alloy = require('co.lanica.platino');
var game = alloy.createGameView();

game.debug = true;
game.fps = 60;
game.color(0, 0, 0);

// Create scene
var scene = alloy.createScene();
game.pushScene(scene);

/***************************
 * 
 * VARIABLES
 */

var enemySprite1 = {image:'graphics/enemy.png', width:96, height:96};
var enemySprite2 = {image:'graphics/enemy2.png', width:96, height:96};
var playerSprite = {image:'graphics/player.png', width:96, height:96};
var LineBouncePlayer;
var walls_TESTBOTTOM; //@TODO DELETE LATER

var touchScaleX = 1;
var touchScaleY = 1;

var backgrounds;

// BouncableEntity
var BouncableEntities = [];
var GlobalEntities = [];
var BounceLines = [];
var TOTAL_LINE_LENGTH;

//Line Bounce Physics
var GRAVITY = 250;
var SPEED_LIMIT = GRAVITY*1.5;

var TEST_SHOOTER; //@TODO DELETE LATER

//Updating
var updateTimerId;
var lastTime = +new Date();


//@TODO MENU STUFF

var paused = true;
var mainmenu = true;
var gameover = false;
var score = 0;
var scoresprite;

var backgroundMenu;
var child;
var text;
var pause;



/*********************
 * 
 *  INCLUDES
 * 
 */

Ti.include('Physics/BouncableEntity.js');
Ti.include('Physics/Line.js');
Ti.include('Physics/LineBouncePhysics.js');
Ti.include('Physics/Point.js');
Ti.include('Physics/Vector2D.js');
Ti.include('Physics/Velocity.js');
Ti.include('Player.js');
Ti.include('Enemy.js');

/************************
 * 
 *  MAIN
 * 
 */
//var TESTSPRITE = alloy.createSpriteSheet({image:'graphics/enemy.png', width:96, height:96});
game.addEventListener('onload', function(e) {
    /**
     * INIT STUFF
     */
    game.start();
    initGameScreen();
    createBackground();
    
    
                
    // CREATE THE PLAYER, NOT ADDED TO BOUNCABLE ENTITIES
    LineBouncePlayer = new Player(alloy.createSpriteSheet(playerSprite));
    var BouncePlayer = new BouncableEntity(LineBouncePlayer);
    
    // SETTING UP THE WALLS
    walls_TESTBOTTOM = new Line(game.screen.width*1/4,game.screen.height,game.screen.width*3/4,game.screen.height);
    TOTAL_LINE_LENGTH = game.screen.width*2;
    BounceLines = [];
    BouncableEntity.addLine(walls_TESTBOTTOM);
    
    
    
    // @TODO ADDED IN BACKGROUND STUFF HERE
    createPauseButton();
    createMainMenu();
    createScore();
    
    
    
    createUpdateTimer();
});



var touchStartX;
var touchStartY;

game.addEventListener('touchstart', function(e) {
	touchStartX = e.x * touchScaleX;
	touchStartY = e.y * touchScaleY;
	
	//@TODO ADDED IN MENU STUFF HERE
	if(mainmenu){
	if(child.contains(touchStartX, touchStartY)){
		removeMenu();
		paused = !paused;
		mainmenu = !mainmenu;
	}
	}
	if(paused){
		if(child.contains(touchStartX, touchStartY)){
		removeMenu();
		paused = !paused;
		touchStartX = -1;
		touchStartY = -1;
	}
	if(child2!=null){
	if(child2.contains(touchStartX, touchStartY)){
		removeMenu();
		resetGame();
	}
	}
	}
	
	if(!paused){
		if(pauseButton.contains(touchStartX, touchStartY)){
			paused = !paused;
			createPauseMenu();
		}
	}
	
	
});

game.addEventListener('touchend', function(e) {

	if(touchStartX >= 0 && touchStartY >= 0){
var distance;
var distanceX;
var distanceY;
var angleDegrees;
var touchStopX;
var touchStopY;
	touchStopX = e.x * touchScaleX;
	touchStopY = e.y * touchScaleY;
	distanceX = touchStopX-touchStartX;
	distanceY = touchStopY-touchStartY;
	distance = Math.sqrt(Math.pow((distanceX), 2) + Math.pow((distanceY), 2));
	if(distance < 1)
		return;
	var disvec = new Vector2D(distanceX,distanceY);
	if(disvec.length() > TOTAL_LINE_LENGTH){
		disvec.unitEquals().multiplyEquals(TOTAL_LINE_LENGTH);
		touchStopX = touchStartX+disvec.x;
		touchStopY = touchStartY+disvec.y;
		distance = TOTAL_LINE_LENGTH;
	}
	if(!paused){
	angleDegrees = (Math.atan2(touchStartY - touchStopY, distanceX)*180)/Math.PI;
	var sprite = alloy.createSprite({height: 1, width: 1, image: 'graphics/pixel.png'});
	sprite.color(1,0,0);
	sprite.move(touchStopX-distanceX/2,touchStopY-distanceY/2);
	sprite.scaleBy(distance,5);
	sprite.rotate(-angleDegrees);
	
	
	var newline = new Line(touchStartX, touchStartY, touchStopX, touchStopY);
	newline.sprite = sprite;
	sprite.show();
	scene.add(sprite);
	BouncableEntity.addLine(newline);
	}
	}
});


function createUpdateTimer() {
    updateTimerID = setInterval(function(e) {
        delta = +new Date() - lastTime;
        lastTime = +new Date();
        update(delta);
    }, 10);
}


function update(delta){
	if(paused !== true){
	LineBouncePhysics.update(delta);
	}
}

/**
 * Adjusts the screen by an amount. Everything should move down to adjust for it.
 * Called when the player goes above center screen from the BouncableEntity.js
 * @param {Object} amount
 */
var spawnEnemy = 0;
function adjustScreen(amount){
	BouncableEntity.adjustEntities(amount);
	adjustBackground(amount);
	
	spawnEnemy+=amount;
	if(spawnEnemy >= game.screen.height*2/3){
		spawnEnemy -= game.screen.height*2/3;
		var es = new StandStillEnemy(Math.random()*(game.screen.width-150)+75,-150);
		es.sprite.width = es.sprite.width * 3;
		es.sprite.height = es.sprite.height * 3;
	}
	
	score+=amount;
	var acscore = Math.floor(score);//Math.floor(score/game.screen.height);
	if(acscore != scoreSprite.text)
	scoreSprite.text = acscore;
};


function adjustBackground(amount){
	
	
    for (var i = 0; i < backgrounds.length; i++) {
    	backgrounds[i].y+=amount;
    	if(backgrounds[i].y > game.screen.height){
        	backgrounds[i].x = Math.random() * (game.screen.width - backgrounds[i].width);
        	backgrounds[i].y = -backgrounds[i].height + (backgrounds[i].y - game.screen.height);
       }
    }
}









/************************
 * Initialize background
 */
function createBackground() {
    backgrounds = [
        alloy.createSpriteSheet({image: 'graphics/cloud.xml', frame:0}),
        alloy.createSpriteSheet({image: 'graphics/cloud.xml', frame:1}),
        alloy.createSpriteSheet({image: 'graphics/cloud.xml', frame:2}),
        alloy.createSpriteSheet({image: 'graphics/cloud.xml', frame:3}),
        alloy.createSpriteSheet({image: 'graphics/cloud.xml', frame:4})
    ];
    
    for (var i = 0; i < backgrounds.length; i++) {
        backgrounds[i].x = Math.random() * (game.screen.width - backgrounds[i].width);
        backgrounds[i].y = Math.random() * (game.screen.height - backgrounds[i].height);
        backgrounds[i].z = -1;
        backgrounds[i].ready = true;
        backgrounds[i].show();
        scene.add(backgrounds[i]);
    }
    var background = alloy.createSpriteSheet({x:0, y:0, width:game.screen.width, height: game.screen.height});
    	background.color(153,21,234);
    	background.ready = true;
    	background.show();
    	background.z = -5;
    	scene.add(background);
    
}

/**
 *  For scaling
 */
function initGameScreen() {
    var sscale = 1;
    if (game.size.height >= game.size.width) {
        sscale = game.size.height / 800;
    } else {
        sscale = game.size.width  / 480;
    }
    game.screen = {width:game.size.width / sscale, height:game.size.height / sscale};

    touchScaleX = game.screen.width  / game.size.width;
    touchScaleY = game.screen.height / game.size.height;
}


/************************************************************************
 * 
 * @TODO MENU STUFF HERE
 * 
 * 
 */

function createPauseButton(){
	pauseButton = alloy.createSprite({width: game.screen.width/8, height: game.screen.width/16, center: {x: game.screen.width-game.screen.width/16, y: 0+game.screen.width/16}});
	pauseButton.color(.2,0,0);
	pauseButton.z = 7;
	pauseButton.ready = true;
	scene.add(pauseButton);
}

function createMainMenu(){
	createMenuBack();
    child = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'Start Game', fontSize:20, textalign: 'center'});
    child.color(0,1,0);
    child.z=9;
    child.ready = true;
    text = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'Line Bounce', fontSize:20, textalign: 'center'});
    text.color(0,1,0);
    text.z=9;
    text.ready = true;
    backgroundMenu.addChildNode(child);
    backgroundMenu.addChildNode(text);
    child.center = {x: backgroundMenu.width/2, y: backgroundMenu.height/2};
    text.center = {x: backgroundMenu.width/2, y: backgroundMenu.height/4};
    scene.add(backgroundMenu);
}
var child2 = null;
function createPauseMenu(){
	createMenuBack();
    child = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'Resume', fontSize:20, textalign: 'center'});
    child.color(0,1,0);
    child.z=9;
    child.ready = true;
    child2 = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'End Game', fontSize:20, textalign: 'center'});
    child2.color(0,1,0);
    child2.z=9;
    child2.ready = true;
    text = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'Paused', fontSize:20, textalign: 'center'});
    text.color(0,1,0);
    text.z=9;
    text.ready = true;
    backgroundMenu.addChildNode(child);
    backgroundMenu.addChildNode(text);
    child.addChildNode(child2);
    child.center = {x: backgroundMenu.width/2, y: backgroundMenu.height/2};
    text.center = {x: backgroundMenu.width/2, y: backgroundMenu.height/4};
    child2.center = {x: backgroundMenu.width/2, y: (backgroundMenu.height/2)+25};
    scene.add(backgroundMenu);
}
function createGameOver(ascore){
	createMenuBack();
	ascore = Math.floor(score);
    child = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'Play Again', fontSize:20, textalign: 'center'});
    child.color(0,1,0);
    child.z=9;
    child.ready = true;
    text = alloy.createTextSprite({width: game.screen.width/3, height: game.screen.height / 6, text:'Game Over: '+ascore, fontSize:20, textalign: 'center'});
    text.color(0,1,0);
    text.z=9;
    text.ready = true;
    backgroundMenu.addChildNode(child);
    backgroundMenu.addChildNode(text);
    child.center = {x: backgroundMenu.width/2, y: backgroundMenu.height/2};
    text.center = {x: backgroundMenu.width/2, y: backgroundMenu.height/4};
    scene.add(backgroundMenu);
}
function createMenuBack(){
	backgroundMenu = alloy.createSprite({width: game.screen.width, height: game.screen.height, center: {x: game.screen.width/2, y: game.screen.height/2}});
	backgroundMenu.color(1,0,0);
	backgroundMenu.z = 8;
	backgroundMenu.ready = true;
}

function removeMenu(){
		scene.remove(backgroundMenu);
		child.dispose();
		text.dispose();
		backgroundMenu.dispose();
}
function createScore(){
	 scoreSprite = alloy.createTextSprite({width: game.screen.width/4, height: 128, text: score, fontSize:20, textalign: 'center'});
    scoreSprite.color(0,0,1);
    scoreSprite.z=7;
    scoreSprite.ready = true;
    scene.add(scoreSprite);
}
/***********************************
 * 
 * MENU STUFF OVER
 * 
 * 
 */

function resetGame(){
	paused = true;
	createGameOver();
 spawnEnemy = 0;
 scoreSprite.text = 0;
 	child2=null;

	resetBouncableEntities();
	resetLines();
	score = 0;
	LineBouncePlayer.resetGame();
}



// load debug functions
Ti.include("debug.js");

window.add(game);
window.open({fullscreen:true, navBarHidden:true});
