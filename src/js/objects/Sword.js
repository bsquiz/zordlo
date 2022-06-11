import { GameObject } from './GameObject';

class Sword extends GameObject {
	constructor() {
		super();
		this.hitBox.width = this.width / 4;
		this.hitBox.height = this.height / 4;
	}
}

export { Sword };