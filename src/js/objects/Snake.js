import { Enemy } from './Enemy';
import { GameUtilities } from '../utils/game';

class Snake extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.SNAKE);
		this.state = 0;
		this.State = {
			IDLE: 0,
			RUSH: 1
		};
		this.rushTargetX = 0;
		this.rushTargetY = 0;
		this.isTrackingPlayer = true;
		this.reset();
	}
	reset() {
		super.reset();
		this.state = this.State.IDLE;
		this.isMoving = true;
		this.rotate(GameUtilities.calculateRandomCardinalDirection());
	}
	targetToTheSide() {
		let isToTheSide = false;
		switch (this.dir) {
			case GameUtilities.Direction.NORTH:
			case GameUtilities.Direction.SOUTH:
				if (this.x === this.trackingX) {
					isToTheSide = true;
				}
			break;
			case GameUtilities.Direction.EAST:
			case GameUtilities.Direction.WEST:
				if (this.withinRange(this.y, this.trackingY, 10)) {
					isToTheSide = true;
				}
			break;
			default: break;
		}

		return isToTheSide;
	}
	withinRange(val1, val2, range) {
		return (Math.abs(val1 - val2) < range);
	}
	moveBehavior() {
		this.isMoving = true;
		switch (this.state) {
			case this.State.IDLE:
				const { x, y } = this.getFuturePosition();

				this.x = x;
				this.y = y;
				if (this.targetToTheSide()) {
					//move towards target
					GameUtilities.turnTowardsPoint(
						this.x, this.y,
						this.trackingX,
						this.trackingY);
					// rush
					this.rushTargetX = x;
					this.rushTargetY = y;
					this.maxSpeed = 2;
					this.state = this.State.RUSH;
				}
			break;
			case this.State.RUSH:
				if (this.dir === GameUtilities.Direction.NORTH
					|| this.dir === GameUtilities.Direction.SOUTH) {
					this.y += this.ySpeed;
					if (this.y === this.rushTargetY) {
						this.state = this.State.IDLE;
					}
				} else {
					this.x += this.xSpeed;
					if (this.x === this.rushTargetX) {
						this.state = this.State.IDLE;
					}
				}
			break;
			default: break;
		}
	}
}

export { Snake };
