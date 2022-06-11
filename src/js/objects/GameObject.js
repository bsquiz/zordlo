"use strict";

import { GameUtilities } from '../utils/game';
import { Timer } from '../Timer';
import { HitBox } from '../HitBox';

class GameObject {
	constructor(type = 0, x = 0, y = 0) {
		this.MAX_SPEED = 3;
		this.MAX_RECOIL_SPEED = 3;

		this.State = {
			IDLE: 0,
			MOVE: 1
		};
		this.type = type;
		this._x = x;
		this._y = y;
		this.state = this.State.IDLE;
		this.dir = GameUtilities.Direction.NORTH;
		this.width = GameUtilities.TILE_WIDTH;
		this.height = GameUtilities.TILE_HEIGHT;
		this.maxSpeed = this.MAX_SPEED;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.recoilXSpeed = 0;
		this.recoilYSpeed = 0;
		this.health = 5;
		this.dialog = '';

		this.hasDialog = false;
		this.hasPickup = false;
		this.canBePushed = false;
		this.canMoveOnLand = true;
		this.canSwim = false;
		// if true, object deflects player attacks
		this.canBeAttacked = false;
		this.isActive = false;
		this.isAttacking = false;
		this.isFlying = false;
		this.isInvincible = false;
		this.isMoving = false;
		this.isPushing = false;
		this.isRecoiling = false;
		this.isStunned = false;
		this.isSwimming = false;

		this.recoilingTimer = new Timer(10);
		this.stunnedTimer = new Timer(30);
		this.invincibleTimer = new Timer(10);
		this.walkingAnimation = new Timer(2, true, 10);
        	this.invincibleTimer = new Timer(60);
		this.walkingAnimation.start();

		this.hitBox = new HitBox();
		this.tileHitBox = this.hitBox;
	}
	set x(val) {
		this._x = val;
		this.hitBox.move(this);
	}

	set y(val) {
		this._y = val;
		this.hitBox.move(this);
	}

	get x() { return this._x; }
	
	get y() { return this._y; }

	getCenter() {
		return {
			x: this.x + (this.width / 2),
			y: this.y + (this.height / 2)
		};
	}

	getHitBoxPoints() {
		return this.hitBox.getCornerPoints();
	}

	getFuturePosition(xSpeed = this.xSpeed, ySpeed = this.ySpeed) {
		return {
			x: this._x + xSpeed,
			y: this._y + ySpeed
		};
	}
	rotateRandomCardinalDirection() {
		this.rotate(GameUtilities.calculateRandomCardinalDirection());
	}
	blockedBehavior() {
		if (this.isRecoiling) {
			this.isRecoiling = false;
		}
		this.moveBackwards(1);
	}
	moveBackwards(amount = 30) {
		this.aboutFace();
		while(amount > 0) {
			amount--;
			this.linearMovement();
		}
		this.aboutFace();
	}
	knockBack(knockBackDir) {
		this.rotate(knockBackDir);
		this.isRecoiling = true;
		this.recoilingTimer.start();
	}
	takeDamage(knockBackDir) {
		this.health--;
		this.knockBack(knockBackDir);
		this.stunnedTimer.start();
		this.invincibleTimer.start();
		this.isInvincible = true;
		this.isStunned = true;
	}
	stop() {
		this.isMoving = false;
		this.xSpeed = 0;
		this.ySpeed = 0;
	}
	reset() {
		this.stop();
	}
	die() {
		this.isActive = false;
	}
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
	updateMovementVector() {
		const rads = GameUtilities.degreesToRadians(this.dir);
		const { xSpeed, ySpeed } =
			GameUtilities.calculateMovementVector(rads, this.maxSpeed);
		const { xSpeed: recoilXSpeed, ySpeed: recoilYSpeed } =
			GameUtilities.calculateMovementVector(
				rads,
				this.MAX_RECOIL_SPEED
			);

		// TODO: for some reason reversing x and y speed gives correct movement
		this.xSpeed = ySpeed;
		this.ySpeed = xSpeed;
		this.recoilXSpeed = recoilYSpeed;
		this.recoilYSpeed = recoilXSpeed;

		// y increases downwards
		this.ySpeed *= -1;
		this.recoilYSpeed *= -1;
	}
	rotate(dir) {
		this.dir = dir;
		this.updateMovementVector();
		this.hitBox.move(this);
	}
	attack() {}
	aboutFace() {
		this.dir = GameUtilities.reflectAngle(this.dir);
		this.rotate(this.dir);
	}
	linearMovement(xSpeed = this.xSpeed, ySpeed = this.ySpeed) {
		const { x, y } = this.getFuturePosition(xSpeed, ySpeed);
		this.x = x;
		this.y = y;
	}
	
	moveBehavior() {
		this.linearMovement();
	}
	recoil() {
		this.linearMovement(this.recoilXSpeed, this.recoilYSpeed);
		if (!this.recoilingTimer.update()) {
			this.isRecoiling = false;
		}
	}
	move() {
		if (this.isRecoiling) {
			this.recoil();
			return;
		}

		this.moveBehavior();

		if (this.walkingAnimation.isRunning()) {
			this.walkingAnimation.update();
		}
	}
	update() {
		if (this.isStunned) {
			if (!this.stunnedTimer.update()) {
				this.isStunned = false;
			}
		}
		if (this.isInvincible) {
			if (!this.invincibleTimer.update()) {
				this.isInvincible = false;
			}
		}
	}
}

export { GameObject };
