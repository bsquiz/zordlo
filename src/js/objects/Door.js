import { GameObject } from './GameObject';
import { GameUtilities } from '../utils/game';
import { Timer } from '../Timer';

class Door extends GameObject {
	constructor(type, x, y, width, height, direction,
		isLocked = false, isSealed = false,
		isBombable = false, isBombed = false) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.isLocked = isLocked;
		this.isSealed = isSealed;
		this.isBombable = isBombable;
		this.isBombed = isBombed;
		this.isOpening = false;
		this.isClosing = false;
		this.isActive = true;
		this.rotate(direction);
	}
	unseal() {
		this.isSealed = false;
	}
	unlock() {
		this.isLocked = false;
	}
	open() {
		this.isOpening = true;
	}
	seal() {
		this.isSealed = true;
	}
	close() {}
	
	blowUp() {
		this.isBombable = false;
		this.isBombed = true;
	}

	isPassable() {
		return !this.isBombable && !this.isSealed && !this.isLocked;
	}
	
	expandHitbox(dir) {
		/*
		 	Make hittest bigger to catch player before
			player tests with tile.
		*/
		if (dir === GameUtilities.Direction.WEST) {
			this.hitBox.x -= 32;
		}
		if (dir === GameUtilities.Direction.NORTH) {
			this.hitBox.y -= 32;
		}
		if (dir === GameUtilities.Direction.EAST) {
			this.hitBox.x -= 2;
		}
	}
	rotate(dir) {
		super.rotate(dir);
		this.expandHitbox(dir);
	}
} 

export { Door };