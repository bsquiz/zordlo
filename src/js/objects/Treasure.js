import { GameObject } from './GameObject';
import { Timer } from '../Timer';

class Treasure extends GameObject {
	constructor(type) {
		super(type);
		this.idleAnimation = new Timer(8, true, 16);
		this.idleAnimation.start();
	}
	update() {
		this.idleAnimation.update();
	}
}

export { Treasure };