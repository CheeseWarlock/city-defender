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
		
		this.inIntersection = false;
		this.sectionDistance = 0;
		this.direction = 0;
		this.startAngle = 0;
		this.backing = {
			x: 0,
			z: 0
		}
	}

	isTurning() {
		return !!this.pivot;
	}

	enterIntersection() {
		this.inIntersection = true;
		if (Math.random() > .5 /* INTENT LOGIC */) {
			this.startAngle = Math.floor(this.direction + 0.2) % 4;
			this.pivot = {
				x: this.backing.x + BUILDING_WIDTH * (this.startAngle == 2 || this.startAngle == 3 ? -1 : 1),
				z: this.backing.z + BUILDING_WIDTH * (this.startAngle == 1 || this.startAngle == 2 ? -1 : 1)
			};
		} else {
			this.backing = {
				x: this.backing.x + 9 * Math.cos(this.direction * Math.PI / 2),
				z: this.backing.z - 9 * Math.sin(this.direction * Math.PI / 2)
			};
		}
	}

	exitIntersection() {
		this.inIntersection = false;
		this.direction = Math.floor(this.direction + 0.2) % 4;
		if (this.pivot) {
			// exiting a turn
		} else {
			console.log(this.direction, ":", 3 * Math.cos(this.direction * Math.PI / 2), -3 * Math.sin(this.direction * Math.PI / 2));
			this.backing = {
				x: this.backing.x + 3 * Math.cos(this.direction * Math.PI / 2),
				z: this.backing.z - 3 * Math.sin(this.direction * Math.PI / 2)
			};
		}
		
		this.pivot = null;
	}

	update() {
		if (window.controller.pressed(controller.DOWN)) this.model.position.y -= 0.01;
		if (window.controller.pressed(controller.UP)) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT)) offset += 0.01;
		if (window.controller.pressed(controller.LEFT)) offset -= 0.01;

		this.sectionDistance += MOVE_SPEED;
		if (this.sectionDistance >= (this.inIntersection ? 3 : 9)) {
			if (this.inIntersection) {
				this.exitIntersection();
			} else {
				this.enterIntersection();
			}
			this.sectionDistance = 0;
		}

		if (this.isTurning()) {
			this.direction = this.startAngle + (this.sectionDistance) / BUILDING_MARGIN / 2;
			this.center = {
				x: this.pivot.x + BUILDING_MARGIN * Math.sin(this.direction * Math.PI / 2),
				z: this.pivot.z + BUILDING_MARGIN * Math.cos(this.direction * Math.PI / 2)
			}
		} else {
			this.center = {
				x: this.backing.x + (BUILDING_WIDTH + BUILDING_MARGIN) * Math.sin(this.direction * Math.PI / 2) + (this.sectionDistance - BUILDING_WIDTH) * Math.cos(this.direction * Math.PI / 2),
				z: this.backing.z + (BUILDING_WIDTH + BUILDING_MARGIN) * Math.cos(this.direction * Math.PI / 2) - (this.sectionDistance - BUILDING_WIDTH) * Math.sin(this.direction * Math.PI / 2)
			}
		}

		if (DEBUG_VIEW) {
			this.camera.rotation.x = -1;
			this.camera.position.y = 10;
			this.camera.position.x = 5;
			this.camera.position.z = 6;
			this.model.position.y = -16;
		} else {
			this.camera.position.x = this.center.x + CAMERA_DISTANCE_BACK * Math.sin(this.direction * Math.PI / 2);
			this.camera.position.z = this.center.z + CAMERA_DISTANCE_BACK * Math.cos(this.direction * Math.PI / 2);
			this.camera.rotation.y = this.direction * Math.PI / 2 + ANGLING;
		}

		this.model.position.x = this.center.x - offset * Math.cos(this.direction * Math.PI / 2);
		this.model.position.z = this.center.z + offset * Math.sin(this.direction * Math.PI / 2);

		this.model.rotation.y = this.direction * Math.PI / 2;
	}
}
