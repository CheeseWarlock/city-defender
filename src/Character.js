class Character {
	setup(scene) {
		// setup model
		this.scene = scene;
		this.offset = 0;
		var playerGeometry = new THREE.CubeGeometry(.125, .075, .05);
		this.model = new THREE.Mesh(playerGeometry, new THREE.MeshPhongMaterial());
		this.model.position.z = 0;
		this.model.position.x = 6;
		scene.add(this.model);
		this.bullets = [];

		// setup camera
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);

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

		var mb = new THREE.CubeGeometry(2, 1.3, .1);
		this.moveBox = new THREE.Mesh(mb, new THREE.MeshPhongMaterial({ color: 0xff6666, transparent: true }));
		scene.add(this.moveBox);
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
					xx = BUILDING_WIDTH;
					zz = (BUILDING_WIDTH + BUILDING_MARGIN * 2);
					break;
				case 1:
					xx = (BUILDING_WIDTH + BUILDING_MARGIN * 2);
					zz = -BUILDING_WIDTH;
					break;
				case 2:
					xx = -BUILDING_WIDTH;
					zz = -(BUILDING_WIDTH + BUILDING_MARGIN * 2);
					break;
				case 3:
					xx = -(BUILDING_WIDTH + BUILDING_MARGIN * 2);
					zz = BUILDING_WIDTH;
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
					x: this.backing.x + SPACING * (this.startAngle == 3 || this.startAngle == 2 ? -1 : 1),
					z: this.backing.z + SPACING * (this.startAngle == 2 || this.startAngle == 1 ? -1 : 1)
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
		if (window.controller.combination([[controller.DOWN, true], [controller.UP, false], [controller.SHIFT, false]]) && this.model.position.y >= -0.65) this.model.position.y -= 0.01;
		if (window.controller.combination([[controller.UP, true], [controller.DOWN, false], [controller.SHIFT, false]]) && this.model.position.y <= 0.65) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT) && this.offset <= 1) this.offset += 0.01;
		if (window.controller.pressed(controller.LEFT) && this.offset >= -1) this.offset -= 0.01;

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
			this.camera.position.x = 6;
			this.camera.position.z = 9;
			this.model.position.y = -2;
		} else {
			this.camera.position.x = this.center.x + CAMERA_DISTANCE_BACK * Math.sin(this.direction * Math.PI / 2);
			this.camera.position.z = this.center.z + CAMERA_DISTANCE_BACK * Math.cos(this.direction * Math.PI / 2);
			this.camera.rotation.y = this.direction * Math.PI / 2 + ANGLING;
			this.camera.position.y = this.model.position.y * 0.3;
		}

		this.model.position.x = this.center.x - this.offset * Math.cos(this.direction * Math.PI / 2);
		this.model.position.z = this.center.z + this.offset * Math.sin(this.direction * Math.PI / 2);

		this.model.rotation.y = this.direction * Math.PI / 2;

		this.moveBox.position.x = this.center.x;
		this.moveBox.position.z = this.center.z;

		this.moveBox.rotation.y = this.direction * Math.PI / 2;

		this.moveBox.material.opacity = Math.max(Math.abs(this.offset) - .85, Math.abs(this.model.position.y) - .5);

		// pew pew
		if (this.cooldown) this.cooldown--;
		if (!this.cooldown && window.controller.pressed(controller.SPACE)) {
			this.cooldown = 5;
			var bullet = new Bullet(this.model.position.x, this.model.position.y, this.model.position.z, this.direction);
			scene.add(bullet.model);
			this.bullets.push(bullet);
		}
	}
}
