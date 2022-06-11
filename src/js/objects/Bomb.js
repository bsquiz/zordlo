import { GameObject } from './GameObject';
import { Timer } from '../Timer';

class Bomb extends GameObject {
	constructor(type) {
		super(type);
		this.explosionWidth = 64 * 2;
		this.explosionHeight = 64 * 2;
		this.isExploding = false;
		this.explosionStarted = false;
		this.fuseTimer = new Timer(120);
		this.explodingTimer = new Timer(30);
		this.fuseAnimationTimer = new Timer(4, true, 12);
		this.explosionX = 0;
		this.explosionY = 0;
		this.explosionHitBox = {
			x: this.x, y: this.y,
			width: this.explosionWidth,
			height: this.explosionHeight
		};
	}
	spawn(x, y) {
		this.x = x;
		this.y = y;
		this.explosionX = this.x - this.width / 2;
		this.explosionY = this.y - this.height / 2;
		this.isActive = true;
		this.fuseTimer.start();
		this.fuseAnimationTimer.start();
		this.explosionHitBox = {
			x: this.explosionX, y: this.explosionY,
			width: this.explosionWidth,
			height: this.explosionHeight
		};
	}
	update() {
		if (this.explosionStarted) this.explosionStarted = false;
		if (!this.isExploding) {
			this.fuseAnimationTimer.update();
			if (this.fuseTimer.getTime() === 90) {
				this.fuseAnimationTimer.setUpdateDelay(9);
			} else if (this.fuseTimer.getTime() === 60) {
				this.fuseAnimationTimer.setUpdateDelay(6);
			}
			if (!this.fuseTimer.update()) {
				this.explosionStarted = true;
				this.explodingTimer.start();
				this.isExploding = true;
			}
		} else {
			if (!this.explodingTimer.update()) {
				this.isActive = false;
				this.isExploding = false;
			}
		}
	}
}

export { Bomb };
