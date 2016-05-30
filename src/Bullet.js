class Bullet {
	constructor(x, y, z, angle) {
		console.log(angle + "?");
		this.angle = angle;
		var geometry = new THREE.CubeGeometry(.125, .075, .05);
		this.model = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
		this.model.position.x = x;
		this.model.position.y = y;
		this.model.position.z = z;
		this.model.rotation.y = angle * Math.PI / 2;
	}

	update() {
		this.model.position.x += Math.cos(this.angle * Math.PI / 2) * 0.2;
		this.model.position.z -= Math.sin(this.angle * Math.PI / 2) * 0.2;
	}
}