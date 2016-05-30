textures = [
	{
		file: "a.png",
		name: "exterior",
		repeats: [9, 36],
		side: THREE.DoubleSide
	},
	{
		file: "a.png",
		name: "exterior_solid",
		repeats: [9, 36],
		side: THREE.DoubleSide
	},
	{
		file: "a_interior.png",
		name: "interior",
		repeats: [9, 36],
		side: THREE.BackSide
	},
	{
		file: "b.png",
		name: "floor",
		repeats: [1, 1],
		side: THREE.BackSide
	},
	{
		file: "ceil.png",
		name: "ceiling",
		repeats: [8, 8],
		side: THREE.FrontSide
	}
];

loader = new THREE.TextureLoader();
loadedTextures = {};
loadedMaterials = {};
unloaded = textures.length;

textures.forEach(function(texture) {
	var _texture = texture;
	loader.load(texture.file, function(loadedTexture) {
		loadedTextures[_texture.name] = loadedTexture;
		loadedMaterials[_texture.name] = new THREE.MeshLambertMaterial(
			{
				map: loadedTexture,
				side: _texture.side
			}
		);
		loadedTexture.wrapS = THREE.RepeatWrapping;
		loadedTexture.wrapT = THREE.RepeatWrapping;
		loadedTexture.repeat.set(_texture.repeats[0], _texture.repeats[1]);
		loadedTexture.magFilter = THREE.NearestFilter;
		if (!--unloaded) loadingDone();
	});
});

function loadingDone() {
	for (var i=0;i<5;i++) {
		for (var j=0;j<5;j++) {
			BuildingFactory.makeBuilding(i * SPACING - SPACING * 2,
										 j * SPACING - SPACING * 2,
										 false);
		}
	}

	var geometry = new THREE.PlaneGeometry(100, 100);
	var texture = new THREE.MeshBasicMaterial({color: 0x4040404});
	ground = new THREE.Mesh(geometry, texture);
	ground.rotation.x = 3 * Math.PI / 2;
	scene.add(ground);
	ground.position.y = -18;

	window.character = new Character();
	character.setup(scene);

	render();
}