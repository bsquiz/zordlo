class InputMethod {
	constructor() {
		this.inputsActive = new Map();
		this.inputsReleased = new Map();
	}
	reset() {
		this.inputsActive.forEach((val, key) => {
			this.inputsActive.set(key, false);
		});
	}
	pressKey(keyId) {
		this.inputsActive.set(keyId, true);
		this.inputsReleased.set(keyId, false);
	}
	releaseKey(keyId) {
		this.inputsActive.set(keyId, false);
		this.inputsReleased.set(keyId, true);
	}
	init(InputCode) {
	}
}

export { InputMethod };