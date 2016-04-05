scene = new THREE.Scene();

var buildings = [];
var mirrors = [];
var anim = 0;
var groundMirror = false;

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
directionalLight.position.set( 0, 1, 1 );
scene.add( directionalLight );

var light = new THREE.AmbientLight( 0xffffff, 0.8 ); // soft white light
scene.add( light );
scene.fog = new THREE.Fog( 0xFF7CD3, 10, 40 );

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor( 0xFF7CD3, 1);
renderer.setSize( window.innerWidth - 1, window.innerHeight - 1 );

document.body.appendChild( renderer.domElement );

loader = new THREE.TextureLoader();

texturePainting = loader.load( "a.png", function() {
	blah = loader.load("b.png", function() {
		interior = loader.load("a_interior.png", function() {
			ceil = loader.load("ceil.png", function() {
				loadingDone();
			});
		});
	});
});

function makeWallSet(x, z) {
	makeWall(x + 4.5, z, Math.PI/2, exteriorP);
	makeWall(x - 4.5, z, -Math.PI/2, exteriorP);
	makeWall(x, z + 4.5, 0, exteriorP);
	makeWall(x, z - 4.5, Math.PI, exteriorP);
	makeWall(x + 4.5, z, Math.PI/2, interiorP);
	makeWall(x - 4.5, z, -Math.PI/2, interiorP);
	makeWall(x, z + 4.5, 0, interiorP);
	makeWall(x, z - 4.5, Math.PI, interiorP);
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
		var floor = new THREE.Mesh(floorGeometry, (y > 0 ? ceilingP: floorP));
		floor.position.x = x;
		floor.position.y = y;
		floor.position.z = z;
		floor.rotation.x = Math.PI / 2;
		scene.add(floor);
	}
}

function loadingDone() {
	exteriorP = new THREE.MeshLambertMaterial( { map: texturePainting, transparent: true, side: THREE.FrontSide } );
	texturePainting.wrapS = THREE.RepeatWrapping;
	texturePainting.wrapT = THREE.RepeatWrapping;
	texturePainting.repeat.set( 9, 36 );
	texturePainting.magFilter = THREE.NearestFilter;

	interiorP = new THREE.MeshLambertMaterial( { map: interior, side: THREE.BackSide } );
	interior.wrapS = THREE.RepeatWrapping;
	interior.wrapT = THREE.RepeatWrapping;
	interior.repeat.set( 9, 36 );
	interior.magFilter = THREE.NearestFilter;

	floorP = new THREE.MeshLambertMaterial( { map: blah, side: THREE.BackSide } );
	blah.magFilter = THREE.NearestFilter;

	ceilingP = new THREE.MeshLambertMaterial( { map: ceil } );
	ceil.wrapS = THREE.RepeatWrapping;
	ceil.wrapT = THREE.RepeatWrapping;
	ceil.repeat.set(8, 8);
	ceil.magFilter = THREE.NearestFilter;

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
}

function render() {
	requestAnimationFrame( render );

	distanceBack = 1.5;
	buildingWidth = 4.5;

	angling = -0.1;
	
	anim += 0.03;
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

	if (groundMirror) { groundMirror.render(); }
	renderer.render( scene, camera );
}

render();