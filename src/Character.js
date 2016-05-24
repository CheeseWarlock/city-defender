class Character {
	setup(scene) {
		// setup model
		this.scene = scene;
		var fairyGeom = new THREE.CubeGeometry(.125, .075, .05);
		this.model = new THREE.Mesh(fairyGeom, new THREE.MeshPhongMaterial());
		this.model.position.z = 0;
		this.model.position.x = 6;
		scene.add(this.model);

		// setup camera
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		// setup motion
		this.distance = 0;
		this.direction = 0;
	}

	isTurning() {
		return this.distance % 12 > BUILDING_WIDTH && this.distance % 12 < 12 - BUILDING_WIDTH;
	}

	update() {
		if (window.controller.pressed(controller.DOWN)) this.model.position.y -= 0.01;
		if (window.controller.pressed(controller.UP)) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT)) offset += 0.01;
		if (window.controller.pressed(controller.LEFT)) offset -= 0.01;

		this.distance += MOVE_SPEED;
		if (this.distance > 10.5) {

		}

		if (this.distance <= BUILDING_WIDTH) {
			this.center = {
				x: this.distance,
				z: BUILDING_WIDTH + BUILDING_MARGIN
			};
		} else if (this.isTurning()) {
			if (!this.pivot) {
				this.pivot = {
					x: BUILDING_WIDTH,
					z: BUILDING_WIDTH
				};
			}
			this.direction = (this.distance - BUILDING_WIDTH) / BUILDING_MARGIN / 2;
			this.center = {
				x: this.pivot.x + BUILDING_MARGIN * Math.sin(this.direction * Math.PI / 2),
				z: this.pivot.z + BUILDING_MARGIN * Math.cos(this.direction * Math.PI / 2)
			}
		} else if (this.distance > 12 - BUILDING_WIDTH - BUILDING_MARGIN) {
			this.center = {
				x: BUILDING_WIDTH + BUILDING_MARGIN,
				z: BUILDING_MARGIN - BUILDING_WIDTH - this.distance + 15
			}
		}

		this.camera.position.x = this.center.x + CAMERA_DISTANCE_BACK * Math.sin(this.direction * Math.PI / 2);
		this.camera.position.z = this.center.z + CAMERA_DISTANCE_BACK * Math.cos(this.direction * Math.PI / 2);
		this.camera.rotation.y = this.direction * Math.PI / 2 + ANGLING;
		// this.camera.position.y = 10;
		// this.camera.rotation.x = -1;
		// this.camera.position.x = 5;
		// this.camera.position.z = 6;

		this.model.position.x = this.center.x - offset * Math.cos(this.direction * Math.PI / 2);
		this.model.position.z = this.center.z + offset * Math.sin(this.direction * Math.PI / 2);

		this.model.rotation.y = this.direction * Math.PI / 2;
	}
}
