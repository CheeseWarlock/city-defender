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
		this.anim = 0;
	}

	canTurn() {
		return this.anim % 12 > 4.5 && this.anim % 12 < 6;
	}

	update() {
		this.anim += 0.01;
		this.anim = this.anim % 12;
		if (this.canTurn) {
			this.camera.rotation.y = ANGLING;
			this.camera.position.x = this.anim;
			this.camera.position.z = DISTANCE_BACK + BUILDING_WIDTH;
		}
		if (this.anim > BUILDING_WIDTH && this.anim < BUILDING_WIDTH + DISTANCE_BACK) {
			var q = (this.anim - BUILDING_WIDTH) / DISTANCE_BACK; // from 0 to 1
			this.camera.rotation.y = q * Math.PI / 2 + ANGLING;
			this.camera.position.x = BUILDING_WIDTH + DISTANCE_BACK * Math.sin(q * Math.PI / 2);
			this.camera.position.z = BUILDING_WIDTH + DISTANCE_BACK * Math.cos(q * Math.PI / 2);
		}
		if (this.anim > BUILDING_WIDTH + DISTANCE_BACK) {
			console.log('doin it');
			this.camera.rotation.y = Math.PI / 2 + ANGLING;
			this.camera.position.x = BUILDING_WIDTH + DISTANCE_BACK;
			this.camera.position.z = BUILDING_WIDTH + DISTANCE_BACK - this.anim + BUILDING_WIDTH;
		}

		this.model.position.x = this.camera.position.x - Math.sin(this.camera.rotation.y) - offset * Math.cos(this.camera.rotation.y);
		this.model.position.z = this.camera.position.z - Math.cos(this.camera.rotation.y) + offset * Math.sin(this.camera.rotation.y);

		var qq = this.anim + 0.2;
		if (qq <= 5) {
			this.model.rotation.y = 0;
		}
		if (qq > BUILDING_WIDTH && qq < BUILDING_WIDTH + DISTANCE_BACK) {
			var q = (qq - BUILDING_WIDTH) / DISTANCE_BACK;
			this.model.rotation.y = q * Math.PI / 2;
		}

		if (window.controller.pressed(controller.DOWN)) this.model.position.y -= 0.01;
		if (window.controller.pressed(controller.UP)) this.model.position.y += 0.01;
		if (window.controller.pressed(controller.RIGHT)) offset += 0.01;
		if (window.controller.pressed(controller.LEFT)) offset -= 0.01;
	}
}