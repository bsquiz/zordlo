import { GameObject } from './GameObject';
import { GameUtilities } from '../utils/game';
import { Timer } from '../Timer';
import { Sword } from './Sword';

class Player extends GameObject {
	constructor() {
		super();
		this.MAX_HEALTH = 3;
		this.MAX_USING_SWORD_TIME = 20;
		this.MAX_BOMB_COOLDOWN_TIME = 60;

		this.health = 3;
		this.money = 0;
		this.bombs = 0;
		this.dir = 0;
		this.keys = 0;
		this.MAX_SPEED = 6;
		this.maxSpeed = 6;
		this.type = 0;
		this.hasMultipleFaces = true;
		this.sword = new Sword();
		this.shield = new GameObject();
		this.sword.width = GameUtilities.TILE_WIDTH;
		this.sword.height = GameUtilities.TILE_HEIGHT;
		this.shield.width = GameUtilities.TILE_WIDTH;
		this.shield.height = GameUtilities.TILE_HEIGHT;
		this.x = GameUtilities.TILE_WIDTH * 7;
		this.y = GameUtilities.TILE_HEIGHT * 7;
		this.rotate(0);
		this.moveSword();
		this.moveShield();

		this.isFlying = false;
		this.isDescendingStairs = false;
		this._canUseBomb = true;
		this.canUseSword = true;
		this.hasGottenPickup = false;
		this.tookDamage = false;
		this.hasTreasure = false;
		this.hasFlippers = false;
		this.canSwim = false;
		this.hasSword = true;
		this.hasBow = false;
		this.hasMap = false;
		this.hasCompass = false;
		this.hasBossKey = false;
		this.hasPotion = false;

		this.bombCooldownTimer = new Timer(this.MAX_BOMB_COOLDOWN_TIME);
		this.descendingStairsTimer = new Timer(30);
		this.invincibleTimer = new Timer(60);
		this.usingSwordTimer = new Timer(this.MAX_USING_SWORD_TIME);
	}

	canUseBomb() {
		return this._canUseBomb && this.bombs > 0;
	}

	isUsingBomb() {
		return this._isUsingBomb;
	}

	usePotion() {
		this.health = this.MAX_HEALTH;
		this.hasPotion = false;
	}
	swordStrikeRecoil() {
		this.usingSwordTimer.stop();
		this.moveBackwards(1);
		this.moveSword();
		this.moveShield();
	}

	rotate(dir) {
		super.rotate(dir);
		this.sword.rotate(dir);
		this.shield.rotate(dir);
	}
	descendStairs() {
		this.isDescendingStairs = true;
		this.descendingStairsTimer.start();
	}
	useSword() {
		this.sword.isActive = true;
		this.usingSwordTimer.start();
		this.canUseSword = false;
		this.moveSword();
		this.moveShield();
		this.stop();
	}
	useBow() {}
	useKey() {
		this.keys--;
	}
	useBomb() {
		this._isUsingBomb = true;
		this.bombCooldownTimer.start();
		this.bombs--;
	}
	attack() {
		this.useSword();
	}

	moveShield() {
		let x = this.x + 25;
		let y = this.y + 10;

		switch (this.dir) {
			case GameUtilities.Direction.NORTH:
				x = this.x - 20;
				y = this.y + 5;
			break;
			case GameUtilities.Direction.EAST:
				x = this.x + 25;
				y = this.y + 10;
			break;
			case GameUtilities.Direction.WEST:
				x = this.x - 22;
				y = this.y + 10;
			break;
			default:
			break;
		}
		this.shield.x = x;
		this.shield.y = y;

		if (this.sword.isActive) {
			if (this.dir === GameUtilities.Direction.EAST) {
				this.shield.x = this.x - 20;
				this.shield.y = this.y + 3;
			} else if (this.dir === GameUtilities.Direction.WEST) {
				this.shield.x = this.x + 20;
				this.shield.y = this.y + 3;
			} else if (this.dir === GameUtilities.Direction.NORTH) {
				this.shield.x = this.x - 25;
			}
		}
	}
	moveSword() {
		switch (this.dir) {
			case GameUtilities.Direction.NORTH:
				this.sword.x = this.x + 25;
				this.sword.y = this.y - 30;
			break;
			case GameUtilities.Direction.EAST:
				this.sword.x = this.x + 40;
				this.sword.y = this.y + 8;
			break;
			case GameUtilities.Direction.SOUTH:
				this.sword.x = this.x - 20;
				this.sword.y = this.y + 35;
			break;
			case GameUtilities.Direction.WEST:
				this.sword.x = this.x  - 40;
				this.sword.y = this.y + 8;
			break;
			default:
				this.sword.x = this.x - 25;
				this.sword.y = this.y + 30;
			break;
		}
	}

	update() {
		super.update();
		this.hasGottenPickup = false;
		this._isUsingBomb = false;

		if (this.isDescendingStairs) {
			if (!this.descendingStairsTimer.update()) {
				this.isDecendingStairs = false;
			}
		}

		if (this.bombCooldownTimer.isRunning()) {
			this._canUseBomb = false;

			if (!this.bombCooldownTimer.update()) {
				this._canUseBomb = true;
			}
		}

		if (this.sword.isActive) {
			this.isAttacking = true;
			if (!this.usingSwordTimer.update()) {
				this.sword.isActive = false;
				this.isAttacking = false;
				this.moveShield();
			}
		}
		if (this.isPushing) {
			this.maxSpeed = parseInt(this.MAX_SPEED / 4);
			this.rotate(this.dir);
		} else {
			this.maxSpeed = this.MAX_SPEED;
		}
		if (this.isMoving) {
			this.move();
			this.moveSword();
			this.moveShield();
		}

		this.isPushing = false;
	}

	reset() {
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.x = 0;
		this.y = 0;
	}
		
	getPickup(pickup) {
		const { type } = pickup;
		this.hasGottenPickup = true;
		switch (type) {
			case GameUtilities.PickupType.BOMBS:
				this.bombs++;
			break;
			case GameUtilities.PickupType.KEY:
				this.keys++;
			break;
			case GameUtilities.PickupType.BOSS_KEY:
				this.hasBossKey = true;
			break;
			case GameUtilities.PickupType.POTION:
				this.hasPotion = true;
			break;	
			case GameUtilities.PickupType.RUPEE:
				this.money++;
			break;
			case GameUtilities.PickupType.HEART:
				if (this.health < this.MAX_HEALTH) {
					this.health++;
				}
			break;
			case GameUtilities.PickupType.COMPASS:
				this.hasCompass = true;
			break;
			case GameUtilities.PickupType.MAP:
				this.hasMap = true;
			break;
			case GameUtilities.PickupType.TREASURE:
				this.hasTreasure = true;
			break;
			default: break;
		}
	} 
};

export { Player };
