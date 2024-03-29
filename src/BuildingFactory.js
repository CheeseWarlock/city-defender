var BuildingFactory = {
	setup: function(scene) {
		this.scene = scene;
	},

	makeBuilding: function(x, z, transparent) {
		if (transparent) {
			this.makeWallSet(x, z);
			this.makeFloorSet(x, z);
		} else {
			this.makeWall(x + BUILDING_WIDTH, z, Math.PI/2, loadedMaterials["exterior_solid"]);
			this.makeWall(x - BUILDING_WIDTH, z, -Math.PI/2, loadedMaterials["exterior_solid"]);
			this.makeWall(x, z + BUILDING_WIDTH, 0, loadedMaterials["exterior_solid"]);
			this.makeWall(x, z - BUILDING_WIDTH, Math.PI, loadedMaterials["exterior_solid"]);
		}
	},

	makeWallSet: function(x, z) {
		this.makeWall(x + BUILDING_WIDTH, z, Math.PI/2, loadedMaterials["exterior"]);
		this.makeWall(x - BUILDING_WIDTH, z, -Math.PI/2, loadedMaterials["exterior"]);
		this.makeWall(x, z + BUILDING_WIDTH, 0, loadedMaterials["exterior"]);
		this.makeWall(x, z - BUILDING_WIDTH, Math.PI, loadedMaterials["exterior"]);
		this.makeWall(x + BUILDING_WIDTH, z, Math.PI/2, loadedMaterials["interior"]);
		this.makeWall(x - BUILDING_WIDTH, z, -Math.PI/2, loadedMaterials["interior"]);
		this.makeWall(x, z + BUILDING_WIDTH, 0, loadedMaterials["interior"]);
		this.makeWall(x, z - BUILDING_WIDTH, Math.PI, loadedMaterials["interior"]);

		this.makeWall(x, z + BUILDING_MARGIN, 0, new THREE.MeshBasicMaterial({color: 0x808080}));
		this.makeWall(x, z + BUILDING_MARGIN, Math.PI, new THREE.MeshBasicMaterial({color: 0x808080}));
		this.makeWall(x, z - BUILDING_MARGIN, 0, new THREE.MeshBasicMaterial({color: 0x808080}));
		this.makeWall(x, z - BUILDING_MARGIN, Math.PI, new THREE.MeshBasicMaterial({color: 0x808080}));

		this.makeWall(x + BUILDING_MARGIN, z, Math.PI / 2, new THREE.MeshBasicMaterial({color: 0x808080}));
		this.makeWall(x + BUILDING_MARGIN, z, Math.PI * 3 / 2, new THREE.MeshBasicMaterial({color: 0x808080}));
		this.makeWall(x - BUILDING_MARGIN, z, Math.PI / 2, new THREE.MeshBasicMaterial({color: 0x808080}));
		this.makeWall(x - BUILDING_MARGIN, z, Math.PI * 3 / 2, new THREE.MeshBasicMaterial({color: 0x808080}));
	},

	makeWall: function(x, z, rotation, p) {
		var wallGeometry = new THREE.PlaneGeometry(BUILDING_WIDTH * 2, BUILDING_WIDTH * 8);
		var wall = new THREE.Mesh(wallGeometry, p);
		wall.rotation.y = rotation;
		wall.position.x = x;
		wall.position.z = z;
		this.scene.add(wall);
	},

	makeFloorSet: function(x, z) {
		var floorGeometry = new THREE.PlaneGeometry(BUILDING_WIDTH * 2, BUILDING_WIDTH * 2);
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
