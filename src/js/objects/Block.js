import { GameObject } from './GameObject';
import { GameUtilities } from '../utils/game';

class Block extends GameObject {
	constructor() {
		super();
		this.targetXPosition = 64 * 7;
		this.canBePushed = true;
		this.canMove = true;
		this.type = GameUtilities.GameObjectType.BLOCK;
		this.targetYPosition = 64 * 5;
		this.hasReachedTargetPosition = false;
		this.pushableDirection = GameUtilities.Direction.NORTH;
		this.isActive = true;
	}
	initDisplacement(TILE_WIDTH, TILE_HEIGHT) {
		this.maxXDisplacement = TILE_WIDTH + this.x;
		this.maxYDisplacement = TILE_HEIGHT + this.y;
	} 
	valIsClose(val, target, range) {
		if (Math.abs(target - val) < range) {
			return true;
		}
		return false;
	}
	move() {
		if (this.canMove) {

		const { x, y } = this.getFuturePosition();

		this.y = y;

		/*
		if (this.x !== this.maxXDisplacement) {
			this.x = x;
		}
		*/
			if (
				this.valIsClose(this.y, this.targetYPosition, 2)
			) {
				this.canMove = false;
				this.canBePushed = false;
				this.hasReachedTargetPosition = true;
			}
		}
    }
	bePushed(dir) {
		this.rotate(dir);
		this.move();
	}
}

export { Block };
