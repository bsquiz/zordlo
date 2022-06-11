import { GameObject } from './GameObject';

class Pickup extends GameObject {
	constructor(type, x, y) {
		super();
		this.type = type;
		this.x = x;
		this.y = y;
		this.hitBox.width = this.width / 4;
		this.hitBox.height = this.height / 4;
		this.isActive = true;
	}
}

export { Pickup };