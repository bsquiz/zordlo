"use strict";
import { GameUtilities } from '../utils/game';
import { Tile } from '../Tile';

class Screen {
	constructor(row, col, tiles, gameObjects = [], enemies = [], pickups = []) {
		this.doorsToOpen = [];
		this.bossMatTypes = [];
		this.tiles = [];
		this.row = row;
		this.col = col;
		this.hasHiddenEvent = false;
		this._hiddenEvent = null;
		this.enemies = enemies;
		this.pickups = pickups;
		this.gameObjects = gameObjects;
		this.isDiscovered = false;
		this.hasBoss = false;
		this.isSealed = false;

		this.doors = gameObjects.filter(gameObject => { 
			const { type } = gameObject;

			return (type === GameUtilities.GameObjectType.DUNGEON_DOOR);
		});
		for (let prop in GameUtilities.TileType) {
			if (prop.indexOf('BOSS_MAT') !== -1) {
				this.bossMatTypes.push(GameUtilities.TileType[prop]);
			}
		}
		this.setTiles(tiles);
	}
	set hiddenEvent(val) {
		this._hiddenEvent = val;
		if (val) {
			this.hasHiddenEvent = true;
		}
	}	
	get hiddenEvent() { return this._hiddenEvent; }
	getAllOpeningDoors() {
		const openingDoors = this.doors.filter(door => {
			return door.isOpening;
		});
		return openingDoors;
	}
	unseal() {
		this.isSealed = false;
		this.openDoors();
	}
	openDoors() {
		this.doors.forEach(door => {
			door.unseal();
			door.open();
		});
	}
	sealDoors(doors) {
		doors.forEach(door => {
			door.seal();
		});
	}
	sealAllDoors() {
		this.doors.forEach(door => {
			door.seal();
		});
	}
	openAllDoors(DoorType) {
		const { DUNGEON_DOOR } = GameObjectType;

		this.gameObjects.forEach(gameObject => {
			if (gameObject.type === DUNGEON_DOOR) {
				gameObject.unseal();
			}
		});
	}
	blockMovedToTarget() {
		return this.gameObjects.filter(gameObject => {
			return !!(gameObject.hasReachedTargetPosition);
		}).length > 0;
	}
	allEnemiesDefeated() {
		return this.enemies.filter(enemy => {
			return enemy.isActive;
		}).length === 0;
	}
	shouldActivateHiddenEvent(game) {
		const { TriggerConditionType } = game;
		let shouldStartHiddenEvent = false;

		if (this.hiddenEvent.trigger === GameUtilities.TriggerConditionType.ENEMIES_DEFEATED) {
			shouldStartHiddenEvent = this.allEnemiesDefeated();
		}

		if (this.hiddenEvent.trigger === GameUtilities.TriggerConditionType.BLOCK_MOVED) {
			shouldStartHiddenEvent = this.blockMovedToTarget();
		}

		if (shouldStartHiddenEvent) {
			this.hasHiddenEvent = false;
		}

		return shouldStartHiddenEvent;
	} 
	isTorchTile(type) {
		return (
			type === GameUtilities.TileType.FLOOR_TORCH
			|| type === GameUtilities.TileType.WALL_TORCH
		);
	}
	tileIsWalkable(type) {
		return (
			type === GameUtilities.TileType.BLANK
			|| type === GameUtilities.TileType.DIRT
			|| type === GameUtilities.TileType.DUNGEON_FLOOR
			|| type === GameUtilities.TileType.DUNGEON_FLOOR_BARE
			|| (this.bossMatTypes.indexOf(type) !== -1) 
		);
	}
	tileIsBombable(type) {
		return (type === GameUtilities.TileType.DUNGEON_WALL_CRACK_TOP);
	}
	setTiles(tiles) {
		let row = 0;
		let col = 0;
		let tilesRow = [];

		tiles.forEach(tile => {
			let isWalkable = false;
			let isBombable = false;
			let type = 0;
			let warpTo = null;
			let animationFrames = 1;

			if (typeof tile === 'number') {
				type = tile;
			} else {
				type = tile.type;
				warpTo = tile.warpTo;
				this.shouldWarp = false;
			}
			isWalkable = this.tileIsWalkable(type);
			isBombable = this.tileIsBombable(type);

			if (col === GameUtilities.COLS) {
				col = 0;
				row++;
				this.tiles.push(tilesRow);
				tilesRow = [];
			}
			if (isBombable) {
				this.shouldWarp = true;
			}

			if (this.isTorchTile(type)) {
				animationFrames = 2;
			}

			const tileObj =
				new Tile(
					type,
					row, col,
					isWalkable, isBombable,
					animationFrames
				);
			if (warpTo) {
				tileObj.warpTo = warpTo;
			}
			tilesRow.push(tileObj);
			col++;
		});
		this.tiles.push(tilesRow);
	}
}

export { Screen };
