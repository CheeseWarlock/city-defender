class Controller {
	constructor() {
		var self = this;

		this.keys = {};
		this.UP = 87;
		this.DOWN = 83;
		this.LEFT = 68;
		this.RIGHT = 65;
		this.SPACE = 32;
		this.SHIFT = 16;

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

	combination(keys) {
		var self = this;
		return keys.reduce(function(acc, next) {
			return acc && !!self.keys[next[0]] == !!next[1]
		}, true);
	}
}