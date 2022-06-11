"use strict";
import { GameObject } from './GameObject';
import { Timer } from '../Timer';
import { GameUtilities } from '../utils/game';

class Enemy extends GameObject {
	constructor(type) {
		super();
		this.type = type;
		this.canBeAttacked = true;
		this.isTrackingPlayer = false;
		this.isDisappearing = false;
		this.isSpawning = false;
		this.isActive = true;
		this.trackingX = 0;
		this.trackingY = 0;
		this.hasPickup = true;
		this.spawnTimer = new Timer(32);
		this.disappearTimer = new Timer(32);
		this.health = 1;
	}
	reset() {
		super.reset();
		this.isSpawning = false;
		this.isDisappearing = false;
	}
        setTrackingPoint(x, y) {
                this.trackingX = x;
                this.trackingY = y;
        }
        facePlayer() {
                let dir = GameUtilities.turnTowardsPoint(
			this.x, this.y,
                	this.trackingX, this.trackingY
                );
                this.rotate(dir);
        }
	blockedBehavior() {
		super.blockedBehavior();
		let newDir = this.dir + 90;

		if (newDir >= 360) {
			newDir = 0;
		}
		this.rotate(newDir);
	}
	spawn() {
		this.isSpawning = true;
		this.spawnTimer.start();
	}
	moveBehavior() {
		this.isMoving = true;
		if (!this.changeDirTimer.update()) {
			this.rotateRandomCardinalDirection();
		} else {
			const { x, y } = this.getFuturePosition();

			this.x = x;
			this.y = y;
		}
	}
	update() {
		super.update();

		if (this.isSpawning) {
			if (!this.spawnTimer.update()) {
				this.isSpawning = false;
			}

			return;
		}

		if (this.isDisappearing) {
			if (!this.disappearTimer.update()) {
				this.isDisappearing = false;
				if (this.health <= 0) {
					this.die();
				}

			}	
			return;
		}

		if (this.health <= 0) {
			this.isDisappearing = true;
			this.disappearTimer.start();
			return;
		}
		this.move();
	}
}

export { Enemy };
