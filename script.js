BUILDING_WIDTH = 4.5;
DISTANCE_BACK = 1.5;
ANGLING = -0.1;

SceneManager = {
	scene: null,
	lights: [],

	init: function() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth - 1, window.innerHeight - 1);
		document.body.appendChild(this.renderer.domElement);
		this.scene = new THREE.Scene();
	},

	addLights: function() {
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
		directionalLight.position.set( 1, 3, 2 );
		this.scene.add( directionalLight );

		var light = new THREE.AmbientLight( 0xffffff, 0.6 ); // soft white light
		this.scene.add( light );
		this.scene.fog = new THREE.Fog( 0xFF7CD3, 10, 40 );
	}
}

BuildingFactory = {
	setup: function(scene) {
		this.scene = scene;
	},

	makeBuilding: function(x, z, transparent) {
		if (transparent) {
			this.makeWallSet(x, z);
			this.makeFloorSet(x, z);
		} else {
			this.makeWall(x + 4.5, z, Math.PI/2, loadedMaterials["exterior_solid"]);
			this.makeWall(x - 4.5, z, -Math.PI/2, loadedMaterials["exterior_solid"]);
			this.makeWall(x, z + 4.5, 0, loadedMaterials["exterior_solid"]);
			this.makeWall(x, z - 4.5, Math.PI, loadedMaterials["exterior_solid"]);
		}
	},

	makeWallSet: function(x, z) {
		this.makeWall(x + 4.5, z, Math.PI/2, loadedMaterials["exterior"]);
		this.makeWall(x - 4.5, z, -Math.PI/2, loadedMaterials["exterior"]);
		this.makeWall(x, z + 4.5, 0, loadedMaterials["exterior"]);
		this.makeWall(x, z - 4.5, Math.PI, loadedMaterials["exterior"]);
		this.makeWall(x + 4.5, z, Math.PI/2, loadedMaterials["interior"]);
		this.makeWall(x - 4.5, z, -Math.PI/2, loadedMaterials["interior"]);
		this.makeWall(x, z + 4.5, 0, loadedMaterials["interior"]);
		this.makeWall(x, z - 4.5, Math.PI, loadedMaterials["interior"]);
		this.makeWall(x, z, 0, new THREE.MeshBasicMaterial({color: 0x4040404}));
		this.makeWall(x, z, Math.PI, new THREE.MeshBasicMaterial({color: 0x4040404}));
	},

	makeWall: function(x, z, rotation, p) {
		var wallGeometry = new THREE.PlaneGeometry(9, 36);
		var wall = new THREE.Mesh(wallGeometry, p);
		wall.rotation.y = rotation;
		wall.position.x = x;
		wall.position.z = z;
		this.scene.add(wall);
	},

	makeFloorSet: function(x, z) {
		var floorGeometry = new THREE.PlaneGeometry(9, 9);
		for (var y=-10;y<=10;y++) {
			var floor = new THREE.Mesh(floorGeometry, loadedMaterials[y > 0 ? "ceiling": "floor"]);
			floor.position.x = x;
			floor.position.y = y;
			floor.position.z = z;
			floor.rotation.x = Math.PI / 2;
			this.scene.add(floor);
		}
	}
}

Character = {
	model: null,
	camera: null,

	setup: function(scene) {
		// setup model
		this.scene = scene;
		var fairyGeom = new THREE.CubeGeometry(.125, .075, .05);
		this.model = new THREE.Mesh(fairyGeom, new THREE.MeshPhongMaterial());
		this.model.position.z = 0;
		this.model.position.x = 6;
		scene.add(this.model);

		// setup camera
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	},

	update: function() {
		anim += 0.01;
		if (anim <= 5) {
			this.camera.rotation.y = ANGLING;
			this.camera.position.x = anim;
			this.camera.position.z = DISTANCE_BACK + BUILDING_WIDTH;
		}
		if (anim > BUILDING_WIDTH && anim < BUILDING_WIDTH + DISTANCE_BACK) {
			var q = (anim - BUILDING_WIDTH) / DISTANCE_BACK; // from 0 to 1
			this.camera.rotation.y = q * Math.PI / 2 + ANGLING;
			this.camera.position.x = BUILDING_WIDTH + DISTANCE_BACK * Math.sin(q * Math.PI / 2);
			this.camera.position.z = BUILDING_WIDTH + DISTANCE_BACK * Math.cos(q * Math.PI / 2);
		}
		if (anim > BUILDING_WIDTH + DISTANCE_BACK) {
			this.camera.position.x = BUILDING_WIDTH + DISTANCE_BACK;
			this.camera.position.z = BUILDING_WIDTH + DISTANCE_BACK - anim + BUILDING_WIDTH;
		}

		Character.model.position.x = this.camera.position.x - Math.sin(this.camera.rotation.y) - offset * Math.cos(this.camera.rotation.y);
		Character.model.position.z = this.camera.position.z - Math.cos(this.camera.rotation.y) + offset * Math.sin(this.camera.rotation.y);

		var qq = anim + 0.2;
		if (qq <= 5) {
			Character.model.rotation.y = 0;
		}
		if (qq > BUILDING_WIDTH && qq < BUILDING_WIDTH + DISTANCE_BACK) {
			var q = (qq - BUILDING_WIDTH) / DISTANCE_BACK;
			Character.model.rotation.y = q * Math.PI / 2;
		}

		if (window.controller.pressed(controller.DOWN)) Character.model.position.y -= 0.01;
		if (window.controller.pressed(controller.UP)) Character.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT)) offset += 0.01;
		if (window.controller.pressed(controller.LEFT)) offset -= 0.01;
	}
}

class Controller {
	constructor() {
		var self = this;

		this.keys = {};
		this.UP = 87;
		this.DOWN = 83;
		this.LEFT = 68;
		this.RIGHT = 65;

		window.onkeydown = function(e) {
			self.keys[e.keyCode] = true;
		};

		window.onkeyup = function(e) {
			self.keys[e.keyCode] = false;
		};
	}

	pressed(key) {
		return this.keys[key];
	}
}

controller = new Controller();

SceneManager.init();
SceneManager.addLights();
scene = SceneManager.scene;
renderer = SceneManager.renderer;
BuildingFactory.setup(scene);


var buildings = [];
var mirrors = [];
var anim = 0;
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

	Character.setup(scene);
}

function render() {
	requestAnimationFrame( render );
	Character.update();
	
	//renderer.autoClear = false;
	//renderer.clear();
	renderer.render( scene, Character.camera );
	//renderer.clearDepth();
	//renderer2.render(scene2, camera2);
}

render();
