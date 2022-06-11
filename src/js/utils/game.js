"use strict";

import { Bat } from '../objects/Bat';
import { BladeTrap } from '../objects/BladeTrap';
import { Dragon } from '../objects/Dragon';
import { Ghost } from '../objects/Ghost';
import { Skeleton } from '../objects/Skeleton';
import { Slime } from '../objects/Slime';
import { Snake } from '../objects/Snake';
import { TrapStatue } from '../objects/TrapStatue';
import { Zora } from '../objects/Zora';
import { Pickup } from '../objects/Pickup';
import { Treasure } from '../objects/Treasure';

const GameUtilities = {
	COLS: 16,
	ROWS: 11,
	ScreenDimension: {
		WIDTH: 1024,
		HEIGHT: 704
	},
	ScreenCenter: { 
		X: 475, 
		Y: 325 
	},
	Direction: {
		NORTH: 0,
		EAST: 90,
		SOUTH: 180,
		WEST: 270
	},
	TileType: {
		DUNGEON_FLOOR: 0,
		DUNGEON_FLOOR_BARE: 1,
		WATER: 2,
		STATUE: 3,
		BLOCK: 4,
		BOSS_MAT_TL: 5,
		BOSS_MAT_TCL: 6,
		BOSS_MAT_TCR: 7,
		BOSS_MAT_TR: 8,
		BOSS_MAT_BL: 9,
		BOSS_MAT_BCL: 10,
		BOSS_MAT_BCR: 11,
		BOSS_MAT_BR: 12,
		LADDER_DOWN: 13,
		FLOOR_TORCH: 14,
		WALL_TORCH: 15,
		DUNGEON_WALL: 16,
		UNWALKABLE: 17,
		COLUMN: 18,
		WALKABLE: 19,
		LADDER_UP: 20,
		WARP: 21
	},
	EffectType: {
		EnemyExplosion: 0
	},

	TriggerConditionType: {
		ENEMIES_DEFEATED: 0,
		BLOCK_MOVED: 1
	},
	TriggerActionType: {
		SPAWN_PICKUP: 0,
		SPAWN_STAIRS: 1,
		SPAWN_CHEST: 2,
		SPAWN_ENEMIES: 3,
		OPEN_DOORS: 4
	},
	EnemyType: {
		BAT: 0,
		SKELETON: 1,
		SLIME: 2,
		SNAKE: 3,
		GHOST: 4,
		ZORA: 5,
		BLADE_TRAP: 6,
		TRAP_STATUE: 7,
		DRAGON: 8
	},
	PickupType: {
		HEART: 0,
		RUPEE: 1,
		KEY: 2,
		MAP: 3,
		COMPASS: 4,
		BOMBS: 5,
		BOSS_KEY: 6,
		POTION: 7,
		TREASURE: 8
	},
	GameObjectType: {
		STATUE: 0,
		BLOCK: 1,
		OLD_WOMAN: 2,
		BOMB: 3,
		DUNGEON_DOOR: 4,
		BOSS_DOOR: 5
	},
	TILE_WIDTH: 64,
	TILE_HEIGHT: 64,
	makeFireball(x, y, dir, fireballs) {
		for (let i=0; i<fireballs.length; i++) {
			if (!fireballs[i].isActive) {
				fireballs[i].spawn(x, y, dir);
				break;
			}
		}
	},
	makeBomb(x, y, bombs) {
		for (let i=0; i<bombs.length; i++) {
			if (!bombs[i].isActive) {
				bombs[i].spawn(x, y);
				break;
			}
		}
	},
	makeEnemy(enemyType, x, y) {
		let enemy;

		switch(enemyType) {
			case this.EnemyType.SLIME:
				enemy = new Slime();
			break;
			case this.EnemyType.BAT:
				enemy = new Bat();
				enemy.originalX = x;
				enemy.originalY = y;
			break;
			case this.EnemyType.SKELETON:
				enemy = new Skeleton();
			break;
			case this.EnemyType.ZORA:
				enemy = new Zora();
			break;
			case this.EnemyType.GHOST:
				enemy = new Ghost();
			break;
			case this.EnemyType.SNAKE:
				enemy = new Snake();
			break;
			case this.EnemyType.TRAP_STATUE:
				enemy = new TrapStatue();
			break;
			case this.EnemyType.DRAGON:
				enemy = new Dragon();
			break;
			case this.EnemyType.BLADE_TRAP:
				enemy = new BladeTrap();
			break;
			default: 
				enemy = new Slime();
			break;
		}

		enemy.x = x;
		enemy.y = y;

		if (enemyType === GameUtilities.EnemyType.ZORA) {
			const { row, col } =
				this.pixelToTile(x, y, this.TILE_WIDTH, this.TILE_HEIGHT);

			if (row > 5) {
			// move zora forewards into water
				enemy.y += this.TILE_HEIGHT;
			} else {
				// move zora backwards into water
				enemy.y -= this.TILE_HEIGHT;
			}
		}

		return enemy;
	},
	makePickup(x, y, pickupType = null) {
		let typeToCreate;
		let pickup;
		if (pickupType === null) {
			typeToCreate = Math.floor(Math.random() * 2);
		} else {
			typeToCreate = pickupType;
		}

		if (pickupType === GameUtilities.PickupType.TREASURE) {
			pickup = new Treasure(typeToCreate);
		} else {
			pickup = new Pickup(typeToCreate);
		}
		pickup.x = x;
		pickup.y = y;
		pickup.isActive = true;

		return pickup;
	},
	screenBoundsReached(gameObject) {
		const { x, y } = gameObject;

		return (
			x > this.ScreenDimension.WIDTH
			|| x < 0
			|| y > this.ScreenDimension.HEIGHT
			|| y < 0
		);
	},
	withinPointRange(x, y, targetX, targetY, threshold) {
		return (
			(x > targetX - threshold)
			&& (x < targetX + threshold)
			&& (y > targetY - threshold)
			&& (y < targetY + threshold)
		);
	},
	radiansToDegrees(radians) {
		return radians * (180 / Math.PI);
	},
	degreesToRadians(degrees) {
		return degrees * (Math.PI / 180);
	},
	normalizeDirection(degrees) {
		let cookedDir = degrees;
		if (degrees < 0) {
			// if degrees value is provided with atan2 it will be from -180 - 180
			cookedDir = (360 - (-degrees));
		}
		// 0 points east by default, change it to point north
		// change angle to be north = 0, south = 180
		cookedDir += 90;
		if (cookedDir > 360) {
			cookedDir = cookedDir - 360;
		}
		return cookedDir;
	},
	reflectAngle(degrees) {
		let reflectedAngle = degrees;

		if (degrees === 360 || degrees === 0) {
			reflectedAngle = GameUtilities.Direction.SOUTH;
		} else if (degrees === GameUtilities.Direction.EAST) {
			reflectedAngle = GameUtilities.Direction.WEST;
		} else if (degrees === GameUtilities.Direction.SOUTH) {
			reflectedAngle = GameUtilities.Direction.NORTH;
		} else if (degrees === GameUtilities.Direction.WEST) {
			reflectedAngle = GameUtilities.Direction.EAST;
		}

		return reflectedAngle;
	},
	calculateRandomCardinalDirection() {
		const dir = Math.floor(Math.random() * 4) * 90;

		return dir;
	},
	calculateMovementVector(radians, speed) {
		return {
			xSpeed: Math.cos(radians) * speed,
			ySpeed: Math.sin(radians) * speed
		};
	},
	turnTowardsPoint(objectX, objectY, targetX, targetY) {
		const rads = Math.atan2(targetY - objectY , targetX - objectX);
		const degrees = GameUtilities.radiansToDegrees(rads);

		return GameUtilities.normalizeDirection(degrees);
	},
	numberInRange(val, max, min = 0) {
		return (val > min && val < max);
	},
	reflectDir(dir) {
		if (dir === 0 || dir === 360) {
			return 180;
		} else if (dir === 90) {
			return 270;
		} else if (dir === 270) {
			return 90;
		} else {
			return 0;
		}
	},

	setBound(val, max) {
		if (val >= max) return 0;
		if (val <= 0) return max;
		return val;
	},
	outOfBounds(gameObject, width, height) {
		const { x, y } = gameObject;

		return (
			!numberInRange(x, width)
			|| !numberInRange(y, height)
		);	
	},
	getOpenedDoorType(doorTile, TileType) {
		return TileType.DUNGEON_ENTRYWAY_RIGHT;
	},
	isLockedDoor(tile, TileType) {
		const { type } = tile;

		return type === TileType.DUNGEON_DOOR_LOCKED;
	},
	shouldRedraw(game) {
		const { player } = game;
		//const movedEnemies = enemies.filter(enemy => enemy.hasMoved );
return true;
		//if (movedEnemies.length > 0) return true;

		if (player.xSpeed !== 0
			|| player.ySpeed !== 0) {
			return true;
		}
		return false;
	},
	getCheckTiles(gameObject, tiles) {
		const { x1, y1, x2, y2, w1, h1, w2, h2 } = gameObject.getHitBoxPoints();
		const checkTile = this.getTile(
			tiles,
			x1, y1,
			this.TILE_WIDTH,
			this.TILE_HEIGHT
		);
		const checkTile2 = this.getTile(
			tiles,
			x2, y2,
			this.TILE_WIDTH,
			this.TILE_HEIGHT
		);

		return [checkTile, checkTile2];
	},

	objectCanCrossTile(tile, gameObject, TileTypes) {
		const { type, isWalkable } = tile;
		const { canSwim, canMoveOnLand } = gameObject;

		if (type === TileTypes.WATER
			&& canSwim) {
			return true;
		} else if (type !== TileTypes.WATER
			&& !canMoveOnLand) {
			// water based enemies can't go on land
			return false;
		}
		
		return isWalkable;
	},
	objectCanMoveForward(gameObject, tiles) {
		const checkTiles = this.getCheckTiles(gameObject, tiles);

		for (let i=0; i<checkTiles.length; i++) {
			const tile = checkTiles[i];

			if (!this.objectCanCrossTile(tile, gameObject, this.TileType)) {
				return false;
			}
		}

		return true;	
	},
	hitTest(obj, obj2) {
		const { x, y } = obj;
		const { x: x2, y: y2, width: w2, height: h2 } = obj2;

		// checks if point 1 is withing object 2
		return (
			(x > x2 && x < x2 + w2)
			&& (y > y2 && y < y2 + h2)
		);	
	},
	hitTestAnyPoint(points, obj) {
		for (let i=0; i<points.length; i++) {
			if (this.hitTest(points[i], obj)) {
				return true;
			}
		}

		return false; 
	},
	getTile(tiles, x, y, tileWidth, tileHeight) {
		const row = Math.floor(y / tileWidth);
		const col = Math.floor(x / tileHeight);

		return tiles[row][col];
	},
	pixelToTile(x, y, TILE_WIDTH, TILE_HEIGHT) {
		const row = y / TILE_HEIGHT;
		const col = x / TILE_WIDTH;

		return { row, col };
	},
	tileToPixel(row, col, TILE_WIDTH = this.TILE_WIDTH, TILE_HEIGHT = this.TILE_HEIGHT) {
		const x = col * TILE_WIDTH;
		const y = row * TILE_HEIGHT;

		return { x, y };
	},
	checkScreenChange(testX, testY, screenRow, screenCol) {
		if (
			testY >= this.HEIGHT
			|| testX >= this.WIDTH
			|| (testY < 0 && screenRow > 0)
			|| (testX < 0 && screenCol > 0)
		) {
			return true;
		}

		return false;
	},

	wrapPlayerPosition(x, y, WIDTH, HEIGHT) {
		return {
			x: this.setBound(x, WIDTH),
			y: this.setBound(y, HEIGHT)
		};
	},
	clampDirToCardinal(dir) {
		// clamp to cardinal directions
		let clampedDir = Math.abs(dir);
		let cardinalDir = 0;

		if (this.numberInRange(clampedDir, 91, 0)) {
			cardinalDir = 90;
		} else if (this.numberInRange(clampedDir, 181,  89)) {
			cardinalDir = 180;
		} else if (this.numberInRange(clampedDir, 271, 179)) {
			cardinalDir = 270;
		}

		return cardinalDir;
	},
	changeScreen(testX, testY, screenRow, screenCol) {
		let newScreenRow = screenRow;
		let newScreenCol = screenCol;
		let newScreen;

		if (testY >= this.HEIGHT) {
			newScreenRow++;
		}
		if (testY < 0 && screenRow > 0) {
			newScreenRow--;
		}
		if (testX < 0 && screenCol > 0) {
			newScreenCol--;
		}

		if (testX >= this.WIDTH) {
			newScreenCol++;
		}

		return {
			newScreenCol,
			newScreenRow
		};	
	},
	calculateDoorDimensions(doorDirection) {
		let x = 0;
		let y = 0;
		let width = 0;
		let height = 0;
		const northSouthX = this.TILE_WIDTH * 6 + (this.TILE_WIDTH / 2);
		const eastWestY = this.TILE_HEIGHT * 4;

		switch(doorDirection) {
			case this.Direction.NORTH:
				x = northSouthX;
				y = Math.floor(this.TILE_HEIGHT / 2);
				width = this.TILE_WIDTH * 3;
				height = this.TILE_HEIGHT * 2;
			break;
			case this.Direction.SOUTH:
				x = northSouthX;
				y = this.TILE_HEIGHT * 9;
				width = this.TILE_WIDTH * 3;
				height = this.TILE_HEIGHT * 2;
			break;
			case this.Direction.EAST:
				x = this.TILE_WIDTH * (this.COLS - 2);
				y = eastWestY;
				width = this.TILE_WIDTH * 2;
				height = this.TILE_HEIGHT * 3;
			break;
			case this.Direction.WEST:
				x = Math.floor(this.TILE_WIDTH / 2);
				y = eastWestY;
				width = this.TILE_WIDTH * 2;
				height = this.TILE_HEIGHT * 3;
			break;
			default: break;
		}

		return { x, y, width, height };
	},
	isDoor(gameObject) {
		const { type, isLocked } = gameObject;

		return (
			type === GameUtilities.GameObjectType.DUNGEON_DOOR
			|| type === GameUtilities.GameObjectType.BOSS_DOOR
			);
	}
}

export { GameUtilities };
