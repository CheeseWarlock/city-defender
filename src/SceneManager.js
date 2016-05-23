SceneManager = {
	scene: null,
	lights: [],

	init: function() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth - 1, window.innerHeight - 1);
		document.body.appendChild(this.renderer.domElement);
		this.scene = new THREE.Scene();
	},

	addLights: function() {
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
		directionalLight.position.set( 1, 3, 2 );
		this.scene.add( directionalLight );

		var light = new THREE.AmbientLight( 0xffffff, 0.6 ); // soft white light
		this.scene.add( light );
		this.scene.fog = new THREE.Fog( 0xFF7CD3, 10, 40 );
	}
}