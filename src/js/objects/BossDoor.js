import { Door } from './Door';
import { Timer } from '../Timer';
import { GameUtilities } from '../utils/game';

class BossDoor extends Door {
	constructor(type, x, y, width, height, direction) {
		super(
			type, x, y, width, height, direction,
			true, false, false, false
			);
		this.ANIMATION_TIME = 40;
		this.isUnlocking = false;
		this.isOpen = false;
		this.isOpening = false;
		this.unlockingAnimationTimer = new Timer(this.ANIMATION_TIME);
		this.openingAnimationTimer = new Timer(this.ANIMATION_TIME);
		// always put boss door in top center of screen
		this.x = GameUtilities.TILE_WIDTH * 6;
		this.y = 0;
		this.width = GameUtilities.TILE_WIDTH * 4;
		this.height = GameUtilities.TILE_HEIGHT * 2;
	}
	unlock() {
		this.isUnlocking = true;
		this.isLocked = false;
		this.unlockingAnimationTimer.start();
	}
	open() {
		this.isOpening = true;
		this.openingAnimationTimer.start();
	}
	getCurrentAnimationFrame() {
		let currentFrame = 1;

		if (this.isOpening) {
			currentFrame = this.openingAnimationTimer.getTime();
		}

		if (this.isUnlocking) {
			currentFrame = this.unlockingAnimationTimer.getTime();
		}

		return currentFrame;
	}
	update() {
		if (this.isUnlocking) {
			if (!this.unlockingAnimationTimer.update()) {
				this.isUnlocking = false;
				this.open();
			}
		}
		if (this.isOpening) {
			if (!this.openingAnimationTimer.update()) {
				this.isOpening = false;
				this.isOpen = true;
			}
		}
	}
}

export { BossDoor };
