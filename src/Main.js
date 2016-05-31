// Scene size configuration
BUILDING_WIDTH = 4.5;
BUILDING_MARGIN = 1.5;
CAMERA_DISTANCE_BACK = 1;
SPACING = 12;
ANGLING = -0.15;
MOVE_SPEED = 0.015;
DEBUG_VIEW = false;
DEBUG_LIGHTS = false;

controller = new Controller();

SceneManager.init();
SceneManager.addLights();
scene = SceneManager.scene;
renderer = SceneManager.renderer;
BuildingFactory.setup(scene);

var buildings = [];
var anim = 0;
var character = null;

renderer.setClearColor(0xFF7CD3, 1);

function render() {
	requestAnimationFrame(render);
	if (character != null) {
		character.update();
		character.bullets.forEach(function(bullet) {
			bullet.update();
		});
	}
	if (character != null) renderer.render(scene, character.camera);
}

