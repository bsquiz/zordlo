import { GameObject } from './GameObject';

class Money extends GameObject {
	constructor(game) {
		super();
		const { PickupType } = game;

		this.type = PickupType.MOENY;
	}
} 

export { Money };