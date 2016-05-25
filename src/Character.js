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
		this.center = {
			x: null,
			z: null
		};
		this.stopTurning();
		this.sectionDistance = 0;
		this.direction = 0;
		this.zz = 0;
	}

	isTurning() {
		return !!this.pivot;
	}

	startTurning() {
		this.zz = Math.floor(this.direction + 0.2) % 4;
		this.pivot = {
			x: this.backing.x + BUILDING_WIDTH* (this.zz == 2 || this.zz == 3 ? -1 : 1),
			z: this.backing.z + BUILDING_WIDTH * (this.zz == 1 || this.zz == 2 ? -1 : 1)
		};
		this.backing = null;
	}

	stopTurning() {
		this.direction = Math.floor(this.direction + 0.2) % 4;
		this.backing = {
			x: 0,
			z: 0
		};
		this.pivot = null;
	}

	update() {
		if (window.controller.pressed(controller.DOWN)) this.model.position.y -= 0.01;
		if (window.controller.pressed(controller.UP)) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT)) offset += 0.01;
		if (window.controller.pressed(controller.LEFT)) offset -= 0.01;

		this.sectionDistance += MOVE_SPEED;
		if (this.sectionDistance >= (this.isTurning() ? 3 : 9)) {
			if (this.isTurning()) {
				this.stopTurning();
			} else {
				this.startTurning();
			}
			this.sectionDistance = 0;
		}

		if (this.isTurning()) {
			this.direction = this.zz + (this.sectionDistance) / BUILDING_MARGIN / 2;
			this.center = {
				x: this.pivot.x + BUILDING_MARGIN * Math.sin(this.direction * Math.PI / 2),
				z: this.pivot.z + BUILDING_MARGIN * Math.cos(this.direction * Math.PI / 2)
			}
		} else {
			this.center = {
				x: (BUILDING_WIDTH + BUILDING_MARGIN) * Math.sin(this.direction * Math.PI / 2) + (this.sectionDistance - BUILDING_WIDTH) * Math.cos(this.direction * Math.PI / 2),
				z: (BUILDING_WIDTH + BUILDING_MARGIN) * Math.cos(this.direction * Math.PI / 2) - (this.sectionDistance - BUILDING_WIDTH) * Math.sin(this.direction * Math.PI / 2)
			}
		}

		console.log(this.direction);

		this.camera.position.x = this.center.x + CAMERA_DISTANCE_BACK * Math.sin(this.direction * Math.PI / 2);
		this.camera.position.z = this.center.z + CAMERA_DISTANCE_BACK * Math.cos(this.direction * Math.PI / 2);
		this.camera.rotation.y = this.direction * Math.PI / 2 + ANGLING;
		// this.camera.position.y = 10;
		// this.camera.rotation.x = -1;
		// this.camera.position.x = 5;
		// this.camera.position.z = 6;
		// this.model.position.y = -16;

		this.model.position.x = this.center.x - offset * Math.cos(this.direction * Math.PI / 2);
		this.model.position.z = this.center.z + offset * Math.sin(this.direction * Math.PI / 2);

		this.model.rotation.y = this.direction * Math.PI / 2;
	}
}
