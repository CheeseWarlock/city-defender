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
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
		var intent = 0;
		if (window.controller.combination([[controller.UP, true], [controller.DOWN, false], [controller.SHIFT, true]])) {
			intent = -1;
		} else if (window.controller.combination([[controller.DOWN, true], [controller.UP, false], [controller.SHIFT, true]])) {
			intent = 1;
		} else {
			intent = 0;
		}

		this.inIntersection = true;
		if (intent == -1) {
			this.startAngle = Math.floor(this.direction + 0.2) % 4;
			this.addOn = 1;
			this.pivot = {
				x: this.backing.x + BUILDING_WIDTH * (this.startAngle == 2 || this.startAngle == 3 ? -1 : 1),
				z: this.backing.z + BUILDING_WIDTH * (this.startAngle == 1 || this.startAngle == 2 ? -1 : 1)
			};
		} else if (intent == 1) {
			this.startAngle = Math.floor(this.direction + 0.2) % 4;
			this.addOn = -1;
			var xx;
			var zz;
			switch(this.startAngle) {
				case 0:
					xx = 4.5;
					zz = 7.5;
					break;
				case 1:
					xx = 7.5;
					zz = -4.5;
					break;
				case 2:
					xx = -4.5;
					zz = -7.5;
					break;
				case 3:
					xx = -7.5;
					zz = 4.5;
					break;

			}
			this.pivot = {
				x: this.backing.x + xx,
				z: this.backing.z + zz
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
			if (this.addOn == -1) {
				this.backing = {
					x: this.backing.x + 12 * (this.startAngle == 3 || this.startAngle == 2 ? -1 : 1),
					z: this.backing.z + 12 * (this.startAngle == 2 || this.startAngle == 1 ? -1 : 1)
				};
			}
		} else {
			this.backing = {
				x: this.backing.x + 3 * Math.cos(this.direction * Math.PI / 2),
				z: this.backing.z - 3 * Math.sin(this.direction * Math.PI / 2)
			};
		}
		
		this.pivot = null;
	}

	update() {
		var old = {
			x: this.center.x,
			z: this.center.z
		}
		if (window.controller.combination([[controller.DOWN, true], [controller.UP, false], [controller.SHIFT, false]]) && this.model.position.y >= -0.5) this.model.position.y -= 0.01;
		if (window.controller.combination([[controller.UP, true], [controller.DOWN, false], [controller.SHIFT, false]]) && this.model.position.y <= 0.5) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT) && offset <= 1) offset += 0.01;
		if (window.controller.pressed(controller.LEFT) && offset >= -1) offset -= 0.01;

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
			this.direction = this.startAngle + (this.sectionDistance * this.addOn) / BUILDING_MARGIN / 2;
			this.direction = (this.direction + 4) % 4;
			this.center = {
				x: this.pivot.x + BUILDING_MARGIN * Math.sin(this.direction * Math.PI / 2) * this.addOn,
				z: this.pivot.z + BUILDING_MARGIN * Math.cos(this.direction * Math.PI / 2) * this.addOn
			}
		} else {
			this.center = {
				x: this.backing.x + (BUILDING_WIDTH + BUILDING_MARGIN) * Math.sin(this.direction * Math.PI / 2) + (this.sectionDistance - BUILDING_WIDTH) * Math.cos(this.direction * Math.PI / 2),
				z: this.backing.z + (BUILDING_WIDTH + BUILDING_MARGIN) * Math.cos(this.direction * Math.PI / 2) - (this.sectionDistance - BUILDING_WIDTH) * Math.sin(this.direction * Math.PI / 2)
			}
		}

		if (Math.abs(old.x - this.center.x) > 2 || Math.abs(old.z - this.center.z) > 2) {
			console.log("oh no~!");
			console.log(old);
			console.log(this.center);
			console.log(Math.abs(old.x - this.center.x), Math.abs(old.z - this.center.z));
		}

		if (DEBUG_VIEW) {
			this.camera.rotation.x = -1;
			this.camera.position.y = 10;
			this.camera.position.x = 5;
			this.camera.position.z = 9;
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
