var platino = require('co.lanica.platino');

var HomeScene = function(window, game) {
	var scene = platino.createScene();

	// forward declarations
	var red = null;

	// scene 'activated' event listener function (scene entry-point)
	var onSceneActivated = function(e) {

		Ti.API.info("HomeScene has been activated.");

		// ---- create sprites, add listeners, etc. ----

		red = platino.createSprite({
			width: 64,
			height: 64
		});
		game.setupSpriteSize(red);

		red.color(1.0, 0, 0);
		red.center = {
			x: game.STAGE_START.x + (game.TARGET_SCREEN.width * 0.5),
			y: game.STAGE_START.y + (game.TARGET_SCREEN.height * 0.5)
		};

		scene.add(red);
	};

	// scene 'deactivated' event listener function (scene exit-point)
	var onSceneDeactivated = function(e) {

		Ti.API.info("HomeScene has been deactivated.");

		// ---- remove sprites, listeners, etc. ----

		if (red) {
			scene.remove(red);
			red.dispose();
			red = null;
		}
		
		scene.dispose();
		scene = null;
	};

	// called when user presses the Android hardware back button
	// when this scene is the current scene
	scene.backButtonHandler = function() {

		// ---- your code here ----

	};

	scene.addEventListener('activated', onSceneActivated);
	scene.addEventListener('deactivated', onSceneDeactivated);
	return scene;
};

module.exports = HomeScene;