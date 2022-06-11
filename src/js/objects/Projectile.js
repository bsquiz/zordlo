import { GameObject } from './GameObject';
import { Timer } from '../Timer';

class Projectile extends GameObject {
	constructor() {
		super();
	}
	spawn(x, y, dir) {
		this.x = x;
		this.y = y;
		this.maxSpeed = 8;
		this.MAX_SPEED = 8;
		this.rotate(dir);
		this.isActive = true;
		this.animationTimer = new Timer(2, true, 12);
		this.animationTimer.start();
	}
	move () {
		const { x, y } = this.getFuturePosition();

		this.x = x;
		this.y = y;
	}
	update(screenWidth, screenHeight) {
		this.move();
		this.animationTimer.update();

		if (
			this.x > screenWidth
			|| this.x < 0
			|| this.y > screenHeight
			|| this.y < 0
		) {
			this.isActive = false;
		}
	}
}

export { Projectile };
