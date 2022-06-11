import { Player } from '../Player.js';


test('player has sword and shield', () => {
	const player = new Player();

	typeof player.sword === 'object';
	typeof player.shield === 'object';
});