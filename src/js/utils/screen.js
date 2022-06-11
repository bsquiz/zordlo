import { GameUtilities } from './game';
import { Warp } from '../Warp';
import { Door } from '../objects/Door';
import { BossDoor } from '../objects/BossDoor';
import { Block } from '../objects/Block';
import { GameObject } from '../objects/GameObject';

const ScreenUtilities = {
		DOOR: 'd',
		DOOR_BOSS: 'D',
		DOOR_SEALED: 'u',
		DOOR_LOCKED: 'c',
		DOOR_BOMBABLE: 'q',
		DOOR_BOMBED: 'i',
		BLADE_TRAP_EAST: 'B',
		BLADE_TRAP_NORTH: 'C',
	doorTypes: [
		'd', 'D', 'u', 'c', 'q', 'i'
	],
	TileMapType: {
		LADDER_UP: 'R',
		LADDER_DOWN: 'r'
	},
	tileMapTypes: [
		['d', GameUtilities.TileType.DUNGEON_FLOOR_BARE],
		['c', GameUtilities.TileType.DUNGEON_FLOOR_BARE],
		['u', GameUtilities.TileType.DUNGEON_FLOOR_BARE],
		['X', GameUtilities.TileType.WALKABLE],
		['D', GameUtilities.TileType.DUNGEON_FLOOR_BARE],
		['w', GameUtilities.TileType.WATER],
		['b', GameUtilities.TileType.DUNGEON_FLOOR_BARE],
		['s', GameUtilities.TileType.STATUE],
		['o', GameUtilities.TileType.BLOCK],
		['x', GameUtilities.TileType.UNWALKABLE],
		['r', GameUtilities.TileType.LADDER_DOWN],
		['R', GameUtilities.TileType.DUNGEON_FLOOR_BARE],
		['z', GameUtilities.TileType.FLOOR_TORCH],
		['E', GameUtilities.TileType.WALL_TORCH],
		['L', GameUtilities.TileType.COLUMN],
		['q', 0], // bombable wall warp
		['1', GameUtilities.TileType.BOSS_MAT_TL],
		['2', GameUtilities.TileType.BOSS_MAT_TCL],
		['3', GameUtilities.TileType.BOSS_MAT_TCR],
		['4', GameUtilities.TileType.BOSS_MAT_TR],
		['5', GameUtilities.TileType.BOSS_MAT_BL],
		['6', GameUtilities.TileType.BOSS_MAT_BCL],
		['7', GameUtilities.TileType.BOSS_MAT_BCR],
		['8', GameUtilities.TileType.BOSS_MAT_BR]
	],
	enemyMapTypes: [
		['k', GameUtilities.EnemyType.SKELETON],
		['a', GameUtilities.EnemyType.BAT],
		['n', GameUtilities.EnemyType.SNAKE],
		['g', GameUtilities.EnemyType.DRAGON],
		['l', GameUtilities.EnemyType.SLIME],
		['B', GameUtilities.EnemyType.BLADE_TRAP],
		['C', GameUtilities.EnemyType.BLADE_TRAP],
		['Z', GameUtilities.EnemyType.ZORA],
		['A', GameUtilities.EnemyType.TRAP_STATUE],
		['h', GameUtilities.EnemyType.GHOST]
	],
	pickupMapTypes: [
		['y', GameUtilities.PickupType.KEY],
		['Y', GameUtilities.PickupType.BOSS_KEY],
		['P', GameUtilities.PickupType.MAP],
		['m', GameUtilities.PickupType.COMPASS],
		['M', GameUtilities.PickupType.BOMBS],
		['t', GameUtilities.PickupType.POTION],
		['H', GameUtilities.PickupType.HEART],
		['Q', GameUtilities.PickupType.RUPEE],
		['e', GameUtilities.PickupType.TREASURE]
	],
	objectMapTypes: [
		['j', GameUtilities.GameObjectType.OLD_WOMAN],
		['O', GameUtilities.GameObjectType.BLOCK]
	],
	doorTypes: ['d', 'u', 'q', 'c', 'D'],
	ladderTypes: ['r', 'R'],

	tileTypeToGameType(tileType, tilesMap) {
		for (let i=0; i<tilesMap.length; i++) {
			if (tilesMap[i][0] === tileType) {
				return tilesMap[i][1];
			}
		}
		return 0;
	},	
	cleanMap(map) {
		const cleanMap = map.replace(/[\r\n\t]/g, "");

		return cleanMap;
	},
	parseMap(map, mapTransform, rows, cols) {
		const cleanMap = this.cleanMap(map);
		const result = [];

		for (let row = 0; row<rows; row++) {
			result[row] = [];

			for (let col=0; col<cols; col++) {
				const tileIndex = row * cols + col;
				const tile = cleanMap[tileIndex];
				result[row][col] = tile;
				for (let i = 0; i<mapTransform.length; i++) {
					const type = mapTransform[i][0];
					const val = mapTransform[i][1];

					if (tile === type) {
						if (typeof val === 'function') {
							result[row][col] = val;
						} else {
							result[row][col] = val;
						}

						break;
					}
				}
			}
		}

		return result;
	},
	makeEnemy(enemyType, row, col) {
		let enemy = null;

		for (let i=0; i<this.enemyMapTypes.length; i++) {
			if (enemyType === this.enemyMapTypes[i][0]) {
				enemy = GameUtilities.makeEnemy(
					this.enemyMapTypes[i][1],
					col * GameUtilities.TILE_WIDTH,
					row * GameUtilities.TILE_HEIGHT
				);

				if (enemyType === this.BLADE_TRAP_EAST) {
					enemy.rotate(GameUtilities.Direction.EAST);
				} else if (enemyType === this.BLADE_TRAP_NORTH) {
					enemy.rotate(GameUtilities.Direction.SOUTH);
				}
			}
		}

		return enemy;
	},
	makePickup(pickupType, row, col) {
		for (let i=0; i<this.pickupMapTypes.length; i++) {
			if (pickupType === this.pickupMapTypes[i][0]) {
				let x = col * GameUtilities.TILE_WIDTH;
				let y = row * GameUtilities.TILE_HEIGHT;

				if (pickupType === 'e') {
					// manually position end treasure to center
					x += GameUtilities.TILE_WIDTH / 2;
					y -= GameUtilities.TILE_HEIGHT / 2;
				}

				const pickup = GameUtilities.makePickup(
					x, y, this.pickupMapTypes[i][1]
				);

				return pickup;
			}
		}

		return null;
	},
	makeObject(objectType, row, col) {
		for (let i=0; i<this.objectMapTypes.length; i++) {
			if (objectType === this.objectMapTypes[i][0]) {
				let gameObject;

				if (this.objectMapTypes[i][0] === 'j') {
					gameObject = new GameObject(GameUtilities.GameObjectType.OLD_WOMAN);

					// add merchant dialog
					gameObject.hasDialog = true;
					gameObject.dialog = 'this will help you';
				}

				if (this.objectMapTypes[i][0] === 'O') {
					gameObject = new Block();
					gameObject.targetXPosition = col * GameUtilities.TILE_WIDTH;
				}

				gameObject.x = col * GameUtilities.TILE_WIDTH;
				gameObject.y = row * GameUtilities.TILE_HEIGHT;
				//gameObject.isActive = true;

				return gameObject;
			}
		}

		return null;
	},
	makeDoorObject(tile, row, col, doorsMade) {
		let doorType = GameUtilities.GameObjectType.DUNGEON_DOOR;
		let doorDirection;
		let door;
		let isLocked = false;
		let isSealed = false;
		let isBombable = false;
		let isBombed = false;
		let doorClass = Door;
		if (row === 1) {
			// north
			if (doorsMade[0]) {
				// dont make more than one door object
				return null;
			}
			doorsMade[0] = true;

			doorDirection = GameUtilities.Direction.NORTH;
		} else if (col === GameUtilities.COLS - 2) {
			// east
			if (doorsMade[1]) {
				// dont make more than one door object
				return null;
			}
			doorsMade[1] = true;
			doorDirection = GameUtilities.Direction.EAST;
		} else if (row === GameUtilities.ROWS - 2) {
			// south
			if (doorsMade[2]) {
				return null;
			}
			doorsMade[2] = true;
			doorDirection = GameUtilities.Direction.SOUTH;
		} else {
			// west
			if (doorsMade[3]) {
				return null;
			}
			doorsMade[3] = true;
			doorDirection = GameUtilities.Direction.WEST;
		}

		const { x, y, width, height } =
			GameUtilities.calculateDoorDimensions(doorDirection);

		if (tile === this.DOOR_BOSS) {
			doorType = GameUtilities.GameObjectType.BOSS_DOOR;
			doorClass = BossDoor;
		}
		if (tile === this.DOOR_LOCKED) {
			isLocked = true;
		}
		if (tile === this.DOOR_SEALED) {
			isSealed = true;
		}
		if (tile === this.DOOR_BOMBABLE) {
			isBombable = true;
		}
		if (tile === this.DOOR_BOMBED) {
			isBombed = true;
		}
		door = new doorClass(
			doorType,
			x, y, width, height, doorDirection,
			isLocked, isSealed, isBombable, isBombed
		);

		return door;
	},
	makeDoorObjects(objectMap) {
		const cleanMap = this.cleanMap(objectMap);
		const doors = [];

		// north, east, south, west
		const doorsMade = [false, false, false, false];
		for (let row = 0; row < GameUtilities.ROWS; row++) {
			for (let col = 0; col < GameUtilities.COLS; col++) {
				const tileIndex = row * GameUtilities.COLS + col;
				const tile = cleanMap[tileIndex];

				if (this.doorTypes.includes(tile)) {
					const door = this.makeDoorObject(tile, row, col, doorsMade);
					if (door) {
						doors.push(door);
					}
				}
			}
		}

		return doors;
	},
	makeObjects(objectMap, factoryFunction) {
		const cleanMap = this.cleanMap(objectMap);
		const objects = [];

		for (let row = 0; row < GameUtilities.ROWS; row++) {
			for (let col = 0; col < GameUtilities.COLS; col++) {
				const tileIndex = row * GameUtilities.COLS + col;
				const object = 
					factoryFunction.apply(
						this, [cleanMap[tileIndex], row, col]
					);

				if (object) {
					objects.push(object);
				}
			}
		}

		return objects;
	},
	makeLadderTile(type, roomRow, roomCol) {
		let playerWarpPosition;
		let newType;
		let direction;
		let offset;

		if (type === GameUtilities.TileType.LADDER_DOWN) {
			// warp to room one row below
			playerWarpPosition = GameUtilities.tileToPixel(
				2, 3
			);
			newType = GameUtilities.TileType.LADDER_DOWN;
			direction = GameUtilities.Direction.SOUTH;
			offset = 1;
		} else {
			// warp to room one row above 
			playerWarpPosition = GameUtilities.tileToPixel(
				4, 6
			);
			newType = GameUtilities.TileType.LADDER_UP;
			direction = GameUtilities.Direction.NORTH;
			offset = -1;
		}

		return {
			type: newType,
			warpTo: new Warp(
				roomRow + offset, roomCol,
				playerWarpPosition.x, playerWarpPosition.y,
				direction
			)
		};
	},
	makeTiles(tileMap, roomRow, roomCol) {
		const roomTiles = this.makeEmptyRoom();
		const cleanMap = this.cleanMap(tileMap);

		for (let row=0; row<GameUtilities.ROWS; row++) {
			for (let col=0; col<GameUtilities.COLS; col++) {
				const tileIndex = row * GameUtilities.COLS + col;
				const tile = cleanMap[tileIndex];
				let foundTile = false;
				let tileType = 0;

				this.tileMapTypes.forEach(tileMapType => {
					if (tile === tileMapType[0]) {
						foundTile = true;
						tileType = tileMapType[1];
					}
				});

				if (foundTile) {
					if (this.doorTypes.includes(tile)) {
						roomTiles[row][col] =
							this.makeDoorTile(row, col, roomRow, roomCol);
					} else if (this.ladderTypes.includes(tile)) {

						roomTiles[row][col] = this.makeLadderTile(
							this.tileTypeToGameType(tile, this.tileMapTypes),
							roomRow, roomCol
						);		
					} else {
						roomTiles[row][col] = tileType;
					}
				}
			}
		}

		return roomTiles.flat();
	},
	makeDoor(fromRow, fromCol, warpDirection, playerWarpPosition = {}) {
		let toRow = fromRow;
		let toCol = fromCol;

		switch (warpDirection) {
			case GameUtilities.Direction.NORTH:
				toRow = fromRow - 1;
			break;
			case GameUtilities.Direction.EAST:
				toCol = fromCol + 1;
			break;
			case GameUtilities.Direction.SOUTH:
				toRow = fromRow + 1;
			break;
			case GameUtilities.Direction.WEST:
				toCol = fromCol - 1;
			break;
			default: break;
		}
		const warpTile =
			{
				type: GameUtilities.TileType.DUNGEON_FLOOR,
				warpTo: new Warp(
					toRow, toCol,
					playerWarpPosition.x, playerWarpPosition.y,
					warpDirection
				)
			};

		return warpTile;
	},
	makeDoorTile(row, col, roomRow, roomCol) {
		let doorDirection = 0;
		let playerTo = {};

		if (col === GameUtilities.COLS - 2) {
			doorDirection = GameUtilities.Direction.EAST;
			playerTo =
			GameUtilities.tileToPixel(
				5, col - GameUtilities.COLS + 3
			);
		} else if (col === 1) {
			doorDirection = GameUtilities.Direction.WEST;
			playerTo =
				GameUtilities.tileToPixel(
				5, GameUtilities.COLS - 3
			);
		} else if (row === 1) {
			// north door
			doorDirection = GameUtilities.Direction.NORTH;
			playerTo =
				GameUtilities.tileToPixel(GameUtilities.ROWS - 3, col);
		} else {
			doorDirection = GameUtilities.Direction.SOUTH;
			playerTo = GameUtilities.tileToPixel(2, col);
		}

		return this.makeDoor(roomRow, roomCol, doorDirection, playerTo);
	},
	makeEmptyRoom(doors = [], roomRow, roomCol) {
		const {
			DUNGEON_WALL: dwl,
			DUNGEON_FLOOR: dfl
		} = GameUtilities.TileType;
		let tiles = [
			[dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl],
			[dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dfl,dwl,dwl],
			[dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl],
			[dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl,dwl]
		];

		return tiles;
	}
};

export { ScreenUtilities };
