import { Enemy } from './Enemy';
import { Timer } from '../Timer';
import { GameUtilities } from '../utils/game';

class Slime extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.SLIME);
		this.MAX_SPEED = 1;
		this.idleTimer = new Timer(60);
		this.moveTimer = new Timer(120);
		this.changeDirTimer = new Timer(240, true);

		this.reset();

		this.changeDirTimer.start();
		this.idleTimer.start();
	}
	reset() {
		super.reset();
		this.state = this.State.IDLE;
		this.rotate(GameUtilities.Direction.EAST);
		this.isMoving = false;
		this.changeDirTimer.stop();
		this.idleTimer.stop();
		this.moveTimer.stop();
	}
	moveBehavior() {
		switch(this.state) {
			case this.State.IDLE:
				if (!this.idleTimer.update()) {
					this.rotate(
						GameUtilities.calculateRandomCardinalDirection()
					);
					this.state = this.State.MOVE;
					this.moveTimer.start();
					this.isMoving = true;
				}
			break;
			case this.State.MOVE:
				const { x, y } = this.getFuturePosition();
				this.x = x;
				this.y = y;

				if (!this.moveTimer.update()) {
					this.state = this.State.IDLE;
					this.idleTimer.start();
					this.isMoving = false;
				}
			break;
			default: break;
		}	
	}
}

export { Slime };
