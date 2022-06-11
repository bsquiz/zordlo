import { Enemy } from './Enemy';
import { GameUtilities } from '../utils/game';

class Bat extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.BAT);
		this.isTrackingPlayer = true;
		this.attackRange = 100;
		this.maxSpeed = 2;
		this.originalX = this.x;
		this.originalY = this.y;
		this.shouldRotate = true;
		this.State = {
			IDLE: 0,
			TRACKING_PLAYER: 1,
			ABOUT_FACE: 2,
			RETREATING: 3
		};
		this.reset();
	}

	reset() {
		super.reset();
		this.state = this.State.TRACKING_PLAYER;
	}

	playerInRange(playerX, playerY) {
		const deltaX = playerX - this.x;
		const deltaY = playerY - this.y;
		const d = Math.sqrt(deltaX + deltaY);

		return d < 15;
	}
	withinRange(original, test, range) {
		return (test > original - range)
			 && (test < original + range);
	}
	hasReachedPosition(x, y) {
		return (
				this.withinRange(x, this.x, this.attackRange)
				&& this.withinRange(y, this.y, this.attackRange)
		);
	}
	moveBehavior() {
		switch (this.state) {
			case this.State.TRACKING_PLAYER:
				this.isMoving = true;
				// fly towards player
				this.rotate(
					GameUtilities.turnTowardsPoint(
						this.x, this.y,
						this.trackingX, this.trackingY
					)
				);

				if (
					GameUtilities.withinPointRange(
						this.x, this.y,
						this.trackingX, this.trackingY,
						10
					)
				) {
					this.state = this.State.ABOUT_FACE;	
				}
			break;

			case this.State.ABOUT_FACE:
				this.isMoving = false;
				this.rotate(GameUtilities.turnTowardsPoint(
					this.x, this.y,
					this.originalX, this.originalY
				));
				this.state = this.State.RETRACTING;
			break;

			case this.State.RETRACTING:
				this.isMoving = true;
				if (
					GameUtilities.withinPointRange(
						this.x, this.y,
						this.originalX, this.originalY,
						10
					)
				) {
					this.state = this.State.IDLE;
				}
			break;

			case this.State.IDLE:
				this.isMoving = false;
				if (this.playerInRange(this.trackingX, this.trackingY)) {
					this.state = this.State.TRACKING_PLAYER;
				}
			break;
			default: break;	
		}

		if (this.isMoving) {
			this.linearMovement();
		}

		if (
			this.x > GameUtilities.ScreenDimension.WIDTH
			|| this.x < 0
			|| this.y > GameUtilities.ScreenDimension.HEIGHT
			|| this.y < 0
		) {
			this.stop();
		}
	}
}

export { Bat };