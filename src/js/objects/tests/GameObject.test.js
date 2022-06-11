import { GameObject } from './GameObject';
import { GameUtilities } from '../utils/game';

const { Direction } = GameUtilities;

test('game object can rotate', () => {
	const gameObject = new GameObject();

	gameObject.rotate(Direction.SOUTH);
	const { dir } = gameObject;

	expect(dir).toBe(Direction.SOUTH);
});

test('game object can do an about face', () => {
	const gameObject = new GameObject();

	gameObject.rotate(Direction.SOUTH);
	const { dir } = gameObject;

	expect(dir).toBe(Direction.NORTH);
});

test('game object can move', () => {
	const gameObject = new GameObject();

	gameObject.xSpeed = 1;
	gameObject.ySpeed = 1;

	gameObject.move();

	const { x, y } = gameObject;

	expect(x).toBe(1);
	expect(y).toBe(1);
});