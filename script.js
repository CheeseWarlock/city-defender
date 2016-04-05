var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth - 1, window.innerHeight - 1 );
document.body.appendChild( renderer.domElement );

var buildings = [];
var mirrors = [];
var anim = 0;
var groundMirror = false;

scene = new THREE.Scene();
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
directionalLight.position.set( 0, 1, 1 );
scene.add( directionalLight );

var light = new THREE.AmbientLight( 0xffffff, 0.6 ); // soft white light
scene.add( light );
scene.fog = new THREE.Fog( 0xFF7CD3, 10, 40 );

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
renderer.setClearColor( 0xFF7CD3, 1);

loader = new THREE.TextureLoader();
loadedTextures = {};
loadedMaterials = {};
unloaded = 5;

loader.load("a.png", function(texture) {
	loadedTextures["exterior"] = texture;
	loadedMaterials["exterior"] = new THREE.MeshLambertMaterial( { map: texture, transparent: true, side: THREE.DoubleSide } );
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

function makeWallSet(x, z) {
	makeWall(x + 4.5, z, Math.PI/2, loadedMaterials["exterior"]);
	makeWall(x - 4.5, z, -Math.PI/2, loadedMaterials["exterior"]);
	makeWall(x, z + 4.5, 0, loadedMaterials["exterior"]);
	makeWall(x, z - 4.5, Math.PI, loadedMaterials["exterior"]);
	makeWall(x + 4.5, z, Math.PI/2, loadedMaterials["interior"]);
	makeWall(x - 4.5, z, -Math.PI/2, loadedMaterials["interior"]);
	makeWall(x, z + 4.5, 0, loadedMaterials["interior"]);
	makeWall(x, z - 4.5, Math.PI, loadedMaterials["interior"]);
	makeWall(x, z, 0, new THREE.MeshBasicMaterial({color: 0x4040404}));
	makeWall(x, z, Math.PI, new THREE.MeshBasicMaterial({color: 0x4040404}));
}

function makeWall(x, z, rotation, p) {
	var wallGeometry = new THREE.PlaneGeometry(9, 36);
	var wall = new THREE.Mesh(wallGeometry, p);
	wall.rotation.y = rotation;
	wall.position.x = x;
	wall.position.z = z;
	scene.add(wall);
}

function makeFloorSet(x, z) {
	var floorGeometry = new THREE.PlaneGeometry(9, 9);
	for (var y=-10;y<=10;y++) {
		var floor = new THREE.Mesh(floorGeometry, loadedMaterials[y > 0 ? "ceiling": "floor"]);
		floor.position.x = x;
		floor.position.y = y;
		floor.position.z = z;
		floor.rotation.x = Math.PI / 2;
		scene.add(floor);
	}
}

function loadingDone() {
	for (var i=0;i<=5;i++) {
		for (var j=0;j<=5;j++) {
			makeWallSet(i * 12 - 24, j * 12 - 24);
			makeFloorSet(i * 12 - 24, j * 12 - 24);
		}
	}

	var geometry = new THREE.PlaneGeometry(100, 100);
	var texture = new THREE.MeshBasicMaterial({color: 0x4040404});
	ground = new THREE.Mesh(geometry, texture);
	ground.rotation.x = 3 * Math.PI / 2;
	scene.add(ground);
	ground.position.y = -18;

	var fairyGeom = new THREE.CubeGeometry(.25, .125, .05);
	fairyThing = new THREE.Mesh(fairyGeom, new THREE.MeshPhongMaterial());
	fairyThing.position.z = 0;
	fairyThing.position.x = 6;
	scene.add(fairyThing);
}

function render() {
	requestAnimationFrame( render );

	distanceBack = 1.5;
	buildingWidth = 4.5;

	angling = -0.1;
	
	anim += 0.01;
	if (anim <= 5) {
		camera.rotation.y = angling;
		camera.position.x = anim;
		camera.position.z = distanceBack + buildingWidth;
	}
	if (anim > buildingWidth && anim < buildingWidth + distanceBack) {
		var q = (anim - buildingWidth) / distanceBack; // from 0 to 1
		camera.rotation.y = q * Math.PI / 2 + angling;
		camera.position.x = buildingWidth + distanceBack * Math.sin(q * Math.PI / 2);
		camera.position.z = buildingWidth + distanceBack * Math.cos(q * Math.PI / 2);
	}
	if (anim > buildingWidth + distanceBack) {
		camera.position.x = buildingWidth + distanceBack;
		camera.position.z = buildingWidth + distanceBack - anim + buildingWidth;
	}

	fairyThing.position.x = camera.position.x - Math.sin(camera.rotation.y) - 0.5 * Math.cos(camera.rotation.y);
	fairyThing.position.z = camera.position.z - Math.cos(camera.rotation.y) + 0.5 * Math.sin(camera.rotation.y);

	var qq = anim + 0.5;
	if (qq <= 5) {
		fairyThing.rotation.y = angling * -3;
	}
	if (qq > buildingWidth && qq < buildingWidth + distanceBack) {
		var q = (qq - buildingWidth) / distanceBack;
		fairyThing.rotation.y = q * Math.PI / 2 - angling * 3;
	}

	if (groundMirror) { groundMirror.render(); }
	renderer.render( scene, camera );
}

render();