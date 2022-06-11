import { Enemy } from './Enemy';
import { GameUtilities } from '../utils/game';
import { Timer } from '../Timer';

class Ghost extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.GHOST);
		this.isFlying = true;
		this.MAX_SPEED = 1;

		this.walkingAnimation = new Timer(2, true, 20);
		this.changeDirTimer = new Timer(360, true);
		this.moveTimer = new Timer(300);
		this.idleTimer = new Timer(260);
		this.walkingAnimation.start();
		this.reset();
	}

	reset() {
		super.reset();
		this.state = this.State.MOVE;
		this.isMoving = true;
		this.rotate(
			GameUtilities.calculateRandomCardinalDirection()
		);
		this.moveTimer.start();
		this.idleTimer.stop();
		this.changeDirTimer.start();
	}
	moveBehavior() {
		switch (this.state) {
			case this.State.IDLE:
				if (!this.idleTimer.update()) {
					this.isMoving = true;
					this.state = this.State.MOVE;
					this.moveTimer.start();
				}
			break;
			case this.State.MOVE:
				if (!this.moveTimer.update()) {
					this.isMoving = false;
					this.state = this.State.IDLE;
					this.idleTimer.start();
				}
			break;
			default: break;
		}

		if (this.isMoving) {
			this.linearMovement();
		}

		if (!this.changeDirTimer.update()) {
			this.rotate(Math.floor(Math.random() * 360));
		}
	}
}

export { Ghost };