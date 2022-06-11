import { Timer } from './Timer';

class Tile {
	constructor(type, row, col, isWalkable, isBombable, animationFrames = 1) {
		this.type = type;
		this.row = row;
		this.col = col;
		this.isWalkable = isWalkable;
		this.isBombable = isBombable;
		this.shouldWarp = false;
		this._warpTo = null;
		this.animationFrames = animationFrames;
		this.isAnimated = false;
		this.currentFrame = 1;
		this.isFirstDraw = true;

		if (this.animationFrames > 1) {
			this.isAnimated = true;
			this.animationTimer = new Timer(this.animationFrames, true, 30);
			this.animationTimer.start();
		}
	}
	set warpTo(val) {
		this._warpTo = val;
		this.shouldWarp = true;
	}
	get warpTo() { return this._warpTo; }
	hasChanged() {
		const { isAnimated, animationTimer, currentFrame } = this;

		if (!isAnimated) return false;

		const newFrame = animationTimer.getTime();

		if (newFrame !== currentFrame) {
			this.currentFrame = newFrame;

			return true;
		}

		return false;
	}
	update() {
		if (this.isAnimated) {
			this.animationTimer.update();
		}
	}
}

export { Tile };
