import { GameObject } from './GameObject';

class EnemyExplosion extends GameObject {
	constructor() {
		super();
		this.animationFrame = 0;
		this.MAX_ANIMATION_FRAMES = 8;
	}
	update() {
		this.animationFrame++;
		if (this.animationFrame > this.MAX_ANIMATION_FRAMES) {
			this.isActive = false;
			this.animationFrame = 0;
		}
	}
}

export { EnemyExplosion };
