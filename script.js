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

var texturePainting = new THREE.TextureLoader().load( "a.png", function() {

	var blah = new THREE.TextureLoader().load("b.png", function() {

		var interior = new THREE.TextureLoader().load("a_interior.png", function() {

			var ceil = new THREE.TextureLoader().load("ceil.png", function() {
				var materialPainting = new THREE.MeshLambertMaterial( { color: 0xffffff, map: texturePainting, transparent: true, side: THREE.FrontSide } );
				texturePainting.wrapS = THREE.RepeatWrapping;
				texturePainting.wrapT = THREE.RepeatWrapping;
				texturePainting.repeat.set( 9, 36 );
				texturePainting.magFilter = THREE.NearestFilter;

				var interiorP = new THREE.MeshLambertMaterial( { color: 0xffffff, map: interior, transparent: true, side: THREE.BackSide } );
				interior.wrapS = THREE.RepeatWrapping;
				interior.wrapT = THREE.RepeatWrapping;
				interior.repeat.set( 9, 36 );
				interior.magFilter = THREE.NearestFilter;

				var buildingGeometry = new THREE.BoxGeometry(9, 36, 9);
				var wallGeometry = new THREE.PlaneGeometry(9, 36);
				var floorGeometry = new THREE.PlaneGeometry(9, 9);

				for (var i=0;i<=5;i++) {
					for (var j=0;j<=5;j++) {
						var wall1 = new THREE.Mesh(wallGeometry, materialPainting);
						wall1.position.x = i * 12 - 24;
						wall1.position.z = -4.5 + j * -12 + 24;
						wall1.rotation.y = Math.PI;
						scene.add(wall1);

						var wall2 = new THREE.Mesh(wallGeometry, materialPainting);
						wall2.position.x = i * 12 - 24;
						wall2.position.z = 4.5 + j * -12 + 24;
						scene.add(wall2);

						var wall3 = new THREE.Mesh(wallGeometry, materialPainting);
						wall3.position.x = -4.5 + i * 12 - 24;
						wall3.position.z = j * -12 + 24;
						wall3.rotation.y = -Math.PI / 2;
						scene.add(wall3);

						var wall4 = new THREE.Mesh(wallGeometry, materialPainting);
						wall4.position.x = 4.5 + i * 12 - 24;
						wall4.position.z = j * -12 + 24;
						wall4.rotation.y = Math.PI / 2;
						scene.add(wall4);

						var wall1 = new THREE.Mesh(wallGeometry, interiorP);
						wall1.position.x = i * 12 - 24;
						wall1.position.z = -4.5 + j * -12 + 24;
						wall1.rotation.y = Math.PI;
						scene.add(wall1);

						var wall2 = new THREE.Mesh(wallGeometry, interiorP);
						wall2.position.x = i * 12 - 24;
						wall2.position.z = 4.5 + j * -12 + 24;
						scene.add(wall2);

						var wall3 = new THREE.Mesh(wallGeometry, interiorP);
						wall3.position.x = -4.5 + i * 12 - 24;
						wall3.position.z = j * -12 + 24;
						wall3.rotation.y = -Math.PI / 2;
						scene.add(wall3);

						var wall4 = new THREE.Mesh(wallGeometry, interiorP);
						wall4.position.x = 4.5 + i * 12 - 24;
						wall4.position.z = j * -12 + 24;
						wall4.rotation.y = Math.PI / 2;
						scene.add(wall4);



						var materialPainting2 = new THREE.MeshLambertMaterial( { color: 0xffffff, map: blah, side: THREE.DoubleSide } );
						blah.magFilter = THREE.NearestFilter;

						var materialPainting3 = new THREE.MeshLambertMaterial( { color: 0xffffff, map: ceil } );
						ceil.wrapS = THREE.RepeatWrapping;
						ceil.wrapT = THREE.RepeatWrapping;
						ceil.repeat.set(8, 8);
						ceil.magFilter = THREE.NearestFilter;

						for (var k=-10;k<=10;k++) {
							var floor = new THREE.Mesh(floorGeometry, (k > 0 ? materialPainting3: materialPainting2));
							floor.position.x = i * 12 - 24;
							floor.position.z = j * -12 + 24;
							floor.rotation.x = Math.PI / 2;
							floor.position.y = k;
							scene.add(floor);
						}
					}
				}
			});
		});
		

		var geometry = new THREE.PlaneGeometry(100, 100);
		var texture = new THREE.MeshBasicMaterial({color: 0x4040404});
		ground = new THREE.Mesh(geometry, texture);
		ground.rotation.x = 3 * Math.PI / 2;
		scene.add(ground);
		ground.position.y = -18;
	});
} );


function render() {
	requestAnimationFrame( render );

	distanceBack = 1.5;
	buildingWidth = 4.5;

	angling = -0.05;
	
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

	if (groundMirror) { groundMirror.render(); }
	renderer.render( scene, camera );
}

render();