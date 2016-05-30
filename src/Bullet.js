class Bullet {
	constructor(x, y, z, angle) {
		this.angle = angle;
		var geometry = new THREE.CubeGeometry(.06, .015, .015);
		this.model = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			color: 0xFFFF00
		}));
		this.model.position.x = x;
		this.model.position.y = y;
		this.model.position.z = z;
		this.model.rotation.y = angle * Math.PI / 2;
	}

	update() {
		this.model.position.x += Math.cos(this.angle * Math.PI / 2) * 0.045;
		this.model.position.z -= Math.sin(this.angle * Math.PI / 2) * 0.045;
	}
}