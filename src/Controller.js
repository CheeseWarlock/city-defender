class Controller {
	constructor() {
		var self = this;

		this.keys = {};
		this.UP = 87;
		this.DOWN = 83;
		this.LEFT = 68;
		this.RIGHT = 65;

		window.onkeydown = function(e) {
			self.keys[e.keyCode] = true;
		};

		window.onkeyup = function(e) {
			self.keys[e.keyCode] = false;
		};
	}

	pressed(key) {
		return this.keys[key];
	}
}