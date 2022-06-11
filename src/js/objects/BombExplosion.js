import { GameObject } from './GameObject';

class BombExplosion extends GameObject {
	constructor() {
		super();
		this.MAX_ANIMATION_FRAME = 28;
		this.animationFrame = 0;
	}
	update() {
		this.animationFrame++;
		if (this.animationFrame === this.MAX_ANIMATION_FRAME) {
			this.isActive = false;
		}
	}
}

export { BombExplosion };
