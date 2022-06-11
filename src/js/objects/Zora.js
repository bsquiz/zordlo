import { Enemy } from './Enemy';
import { Timer } from '../Timer';
import { GameUtilities } from '../utils/game';

class Zora extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.ZORA);
		this.State = {
			IDLE: 0,
			ATTACK: 1,
			SWIM: 2
		};
		this.idleTimer = new Timer(100);
		this.swimTimer = new Timer(60);
		this.attackTimer = new Timer(50);
		this.attackDelayTimer = new Timer(30);

		this.isTrackingPlayer = true;
		this.canSwim = true;
		this.canMoveOnLand = false;

		this.reset();
	}
	reset() {
		super.reset();
		this.state = this.State.SWIM;
		this.isAttacking = false;
		this.attackDelayTimer.stop();
		this.attackTimer.stop();
		this.swimTimer.stop();
		this.dir = GameUtilities.Direction.SOUTH;
		this.swimTimer.start();
	}	
	turn() {
		// prefers to move right and left
		const r = Math.floor(Math.random() * 8);
		let dir = 0;

		if (r >= 0 && r < 3) {
			dir = GameUtilities.Direction.EAST;
		} else if (r >= 3 && r < 6) {
			dir = GameUtilities.Direction.WEST;
		} else if (r === 6) {
			dir = GameUtilities.Direction.NORTH;
		} else {
			dir = GameUtilities.Direction.SOUTH;
		}

		this.rotate(dir);
	}
	moveBehavior() {
		switch (this.state) {
			case this.State.IDLE:
				// stand still and attack
				if (!this.attackDelayTimer.update()) {
					this.facePlayer();
					this.aboutFace();
					this.state = this.State.ATTACK;
					this.isAttacking = true;
					this.attackTimer.start();
				}
			break;
			case this.State.ATTACK:
				if (!this.attackTimer.update()) {
					this.state = this.State.SWIM;
					this.isMoving = true;
					this.isAttacking = false;
					this.swimTimer.start();
					this.turn();
				}
			break;
			case this.State.SWIM:
			if (!this.swimTimer.update()) {
				this.isMoving = false;
				this.attackDelayTimer.start();
				this.state = this.State.IDLE;
			}
			default: break;
		}

		// move underwater
		if (this.isMoving) {
			const { x, y } = this.getFuturePosition();
			this.x = x;
			this.y = y;
		}
	}
}

export { Zora };
