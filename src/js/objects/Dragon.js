import { Enemy } from './Enemy';
import { GameUtilities } from '../utils/game';
import { Timer } from '../Timer';

class Dragon extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.DRAGON);
		this.MAX_IDLE_TIME = 60;
		this.MAX_ATTACK_TIME = 1;
		this.MAX_MOUTH_TIME = 20;
		this.width = GameUtilities.TILE_WIDTH * 4;
		this.height = GameUtilities.TILE_HEIGHT * 4;
		this.health = 1;
		this.speed = 0;
		this.hasPickup = false;
		this.MAX_MOUTH_FRAMES = 4;
		this.isOpeningMouth = false;
		this.isClosingMouth = false;
		this.openingMouthTimer = new Timer(this.MAX_MOUTH_FRAMES, false, this.MAX_MOUTH_TIME);
		this.closingMouthTimer = new Timer(this.MAX_MOUTH_FRAMES, false, this.MAX_MOUTH_TIME);
		this.attackingTimer = new Timer(this.MAX_ATTACK_TIME);
		this.idleTimer = new Timer(this.MAX_IDLE_TIME);
		this.isAttacking = false;
		this.state = 0;
		this.State = {
			IDLE: 0,
			OPENING_MOUTH: 1,
			ATTACKING: 2,
			CLOSING_MOUTH: 3
		};
		this.idleTimer.start();
	}
	knockBack() {
		// dragon is too heavy to be knocked back
		return;
	}
	moveBehavior() {
		this.canBeAttacked = true;
		if (this.isAttacking) {
			this.isAttacking = false;
		}

		switch (this.state) {
			case this.State.IDLE:
				this.canBeAttacked = false;
				if (!this.idleTimer.update()) {
					this.state = this.State.OPENING_MOUTH;
					this.openingMouthTimer.start();
					this.isOpeningMouth = true;
				}
			break;
			case this.State.OPENING_MOUTH:
				if (!this.openingMouthTimer.update()) {
					this.state = this.State.ATTACKING;
					this.isOpeningMouth = false;
					this.isAttacking = true;
					this.attackingTimer.start();
				}	
			break;
			case this.State.ATTACKING:
				if (!this.attackingTimer.update()) {
					this.state = this.State.CLOSING_MOUTH;
					this.isClosingMouth = true;
					this.closingMouthTimer.start();
				}
			break;
			case this.State.CLOSING_MOUTH:
				if (!this.closingMouthTimer.update()) {
					this.state = this.State.IDLE;
					this.isClosingMouth = false;
					this.idleTimer.start();
				}
			break;
			default: break;
		}
	}
}

export { Dragon };
