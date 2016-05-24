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
		return this.distance % 12 > BUILDING_WIDTH && this.distance % 12 < 12 - BUILDING_WIDTH - BUILDING_MARGIN;
	}

	update() {
		this.distance += MOVE_SPEED;
		if (this.distance > 10.5) {
			this.distance %= 10.5;
			this.direction = 0;
		}

		this.center = {
			x: this.distance,
			z: BUILDING_WIDTH + BUILDING_MARGIN
		};
		if (this.distance <= BUILDING_WIDTH) {

		} else if (this.isTurning()) {
			this.direction = (this.distance - BUILDING_WIDTH) / BUILDING_MARGIN; // from 0 to 1
			this.center = {
				x: BUILDING_WIDTH + BUILDING_MARGIN * Math.sin(this.direction * Math.PI / 2),
				z: BUILDING_WIDTH + BUILDING_MARGIN * Math.cos(this.direction * Math.PI / 2)
			}
		} else if (this.distance % 12 > 12 - BUILDING_WIDTH - BUILDING_MARGIN) {
			this.center = {
				x: BUILDING_WIDTH + BUILDING_MARGIN,
				z: BUILDING_WIDTH + BUILDING_MARGIN - this.distance + BUILDING_WIDTH
			}
		}

		this.camera.position.x = this.center.x + CAMERA_DISTANCE_BACK * Math.sin(this.direction * Math.PI / 2);
		this.camera.position.z = this.center.z + CAMERA_DISTANCE_BACK * Math.cos(this.direction * Math.PI / 2);
		this.camera.rotation.y = this.direction * Math.PI / 2 + ANGLING;

		this.model.position.x = this.center.x - offset * Math.cos(this.direction * Math.PI / 2);
		this.model.position.z = this.center.z + offset * Math.sin(this.direction * Math.PI / 2);

		var qq = this.distance + 0.2;
		if (qq <= 5) {
			this.model.rotation.y = 0;
		}
		if (qq > BUILDING_WIDTH && qq < BUILDING_WIDTH + BUILDING_MARGIN) {
			var q = (qq - BUILDING_WIDTH) / BUILDING_MARGIN;
			this.model.rotation.y = q * Math.PI / 2;
		}

		if (window.controller.pressed(controller.DOWN)) this.model.position.y -= 0.01;
		if (window.controller.pressed(controller.UP)) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT)) offset += 0.01;
		if (window.controller.pressed(controller.LEFT)) offset -= 0.01;
	}
}
