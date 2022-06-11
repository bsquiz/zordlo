import { Enemy } from './Enemy';
import { Timer } from '../Timer';
import { GameUtilities } from '../utils/game';

class BladeTrap extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.BLADE_TRAP);
		this.State = {
			RELEASING: 0,
			RETRACTING: 1,
			IDLE: 2
		};
		this.canBeAttacked = false;
		this.MAX_SPEED = 6;
		this.stateTimer = new Timer(260, true);
		this.behavior = 1;
		this.Behavior = {
			WAIT: 0,
			BOUNCE: 1
		};
		this.reset();
	}
	reset() {
		super.reset();
		this.isActive = true;
		this.state = this.State.RELEASING;
		this.stateTimer.start();
		this.rotate(GameUtilities.Direction.EAST);
	}
	blockedBehavior() {
		this.aboutFace();
	}
	moveBehavior() {
		this.isMoving = true;
		if (this.behavior = this.Behavior.WAIT) {
			if (this.state === this.State.IDLE) return;	

			if (!this.stateTimer.update()) {
				this.aboutFace();
				if (this.state === this.State.RELEASING) {
					this.MAX_SPEED = 3;
					this.state = this.State.RETRACTING;
				} else {
					this.MAX_SPEED = 6;
					//	this.state = this.State.IDLE;
				}
			}
		}
		this.linearMovement();
	}
}

export { BladeTrap };