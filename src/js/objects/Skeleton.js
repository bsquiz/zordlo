import { Enemy } from './Enemy';
import { Timer } from '../Timer';
import { GameUtilities } from '../utils/game';

class Skeleton extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.SKELETON);
		this.MAX_SPEED = 3;
		this.health = 1;
		this.rotateTimer = new Timer(240, true);
		this.rotateTimer.start();
		this.reset();
	}
	reset() {
		super.reset();
		this.state = this.State.MOVE;
		this.isMoving = true;
		this.rotate(
			GameUtilities.calculateRandomCardinalDirection()
		);
	}
	moveBehavior() {
		if (!this.rotateTimer.update()) {
			this.rotate(
				GameUtilities.calculateRandomCardinalDirection()
			);
		}
		this.linearMovement();
	}
}

export { Skeleton };