// Scene size configuration
BUILDING_WIDTH = 4.5;
BUILDING_MARGIN = 1.5;
CAMERA_DISTANCE_BACK = 1;
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
var mirrors = [];
var anim = 0;
var character = null;
var groundMirror = false;

renderer.setClearColor( 0xFF7CD3, 1);

loader = new THREE.TextureLoader();
loadedTextures = {};
loadedMaterials = {};
unloaded = 5;
keys = {};
offset = 0;

// var renderer2 = new THREE.WebGLRenderer();
// renderer2.setSize(200, 200);
// document.body.appendChild( renderer2.domElement );
// var scene2 = new THREE.Scene();
// var light2 = new THREE.AmbientLight( 0xffffff, 0.6 );
// scene2.add( light2 );
// var camera2 = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
// camera2.position.z = 20;

// var cc = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshBasicMaterial({color: 0x404040}));

// scene2.add(cc);

// var dd = new THREE.Mesh(new THREE.PlaneGeometry(1,100), new THREE.MeshBasicMaterial({color: 0xff0000}));

// scene2.add(dd);

loader.load("a.png", function(texture) {
	loadedTextures["exterior"] = texture;
	loadedMaterials["exterior"] = new THREE.MeshLambertMaterial( { map: texture, transparent: true, side: THREE.DoubleSide } );
	loadedMaterials["exterior_solid"] = new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide } );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 9, 36 );
	texture.magFilter = THREE.NearestFilter;
	if (!--unloaded) loadingDone();
});

loader.load("a_interior.png", function(texture) {
	loadedTextures["interior"] = texture;
	loadedMaterials["interior"] = new THREE.MeshLambertMaterial( { map: texture, side: THREE.BackSide } );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 9, 36 );
	texture.magFilter = THREE.NearestFilter;
	if (!--unloaded) loadingDone();
});

loader.load("b.png", function(texture) {
	loadedTextures["floor"] = texture;
	loadedMaterials["floor"] = new THREE.MeshLambertMaterial( { map: texture, side: THREE.BackSide } );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	if (!--unloaded) loadingDone();
});

loader.load("ceil.png", function(texture) {
	loadedTextures["ceiling"] = texture;
	loadedMaterials["ceiling"] = new THREE.MeshLambertMaterial( { map: texture } );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(8, 8);
	texture.magFilter = THREE.NearestFilter;
	if (!--unloaded) loadingDone();
});

loader.load("fairy.png", function(texture) {
	loadedTextures["fairy"] = texture;
	loadedMaterials["fairy"] = new THREE.MeshLambertMaterial( { map: texture, transparent: true, side: THREE.DoubleSide } );
	texture.magFilter = THREE.NearestFilter;
	if (!--unloaded) loadingDone();
});

function loadingDone() {
	for (var i=0;i<=5;i++) {
		for (var j=0;j<=5;j++) {
			BuildingFactory.makeBuilding(i * 12 - 24, j * 12 - 24, true);
		}
	}

	var geometry = new THREE.PlaneGeometry(100, 100);
	var texture = new THREE.MeshBasicMaterial({color: 0x4040404});
	ground = new THREE.Mesh(geometry, texture);
	ground.rotation.x = 3 * Math.PI / 2;
	scene.add(ground);
	ground.position.y = -18;

	window.character = new Character();
	character.setup(scene);
}

function render() {
	requestAnimationFrame( render );
	if (character != null) character.update();
	
	//renderer.autoClear = false;
	//renderer.clear();
	if (character != null) renderer.render( scene, character.camera );
	//renderer.clearDepth();
	//renderer2.render(scene2, camera2);
}

render();
