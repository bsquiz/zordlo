"use strict";

import { GameUtilities } from '../utils/game';
import { HUD } from './hud';
import { graphics } from '../utils/graphics';
import { drawBoss } from './drawBoss';

const display = {
	MAP_HEIGHT: 0,
	MAP_WIDTH: 0,

	Direction: {},
	PickupClipSource: {},
	EffectClipSource: {},
	TileClipSource: {},
	SwordClipSource: {},
	ShieldClipSource: {},
	DoorClipSource: {},
	GameObjectSource: {},

	GameObjectType: {},

	$canvas: document.getElementById('gameCanvas'),
	$tilesCanvas: document.getElementById('tilesCanvas'),
	$background: document.getElementById('background'),
	$gameOver: document.getElementById('gameOver'),
	$game: document.getElementById('game'),

	context: {},
	tilesContext: {},

	gameUtilities: {},
	shouldUpdateHUD: true,
	shouldUpdateTiles: true,
	totalImagesLoaded: 0,
	loaded: false,
	scrollOffsetX: 0,
	scrollOffsetY: 0,
	isDebug: false,
	drawingNewScreen: true,

	init(game, imageUrls = {}) {
		const {
			transitioningScreenTimer,
			isDebug
		} = game; 

		const imageTypes = Object.keys(imageUrls);
		const tileTypes = Object.keys(GameUtilities.TileType);
		const pickupTypes = Object.keys(GameUtilities.PickupType);
		const enemyTypes = Object.keys(GameUtilities.EnemyType);
		const gameObjectTypes = Object.keys(GameUtilities.GameObjectType);
		const effectTypes = Object.keys(GameUtilities.EffectType);
		const MAX_TRANSITION_SCREEN_TIMER = transitioningScreenTimer.getMaxTime() - 1;

		this.isDebug = isDebug;

		HUD.init(
			GameUtilities.ScreenDimension.WIDTH, GameUtilities.ScreenDimension.HEIGHT,
		);
		this.context = this.$canvas.getContext('2d');
		this.tilesContext = this.$tilesCanvas.getContext('2d');
		graphics.loadImages(imageUrls);
		
		this.transitionDeltaX =
			Math.floor(GameUtilities.ScreenDimension.WIDTH / MAX_TRANSITION_SCREEN_TIMER);
		this.transitionDeltaY =
			Math.floor(GameUtilities.ScreenDimension.HEIGHT / MAX_TRANSITION_SCREEN_TIMER);

		this.TileClipSource = graphics.makeClipSource(tileTypes);
		this.PickupClipSource = graphics.makeClipSource(pickupTypes);
		this.SwordClipSource = graphics.makeClipSource(['SWORD']);
		this.ShieldClipSource = graphics.makeClipSource(['SHIELD'], 2);
		this.EnemyClipSource = graphics.makeClipSource(enemyTypes, 4, 4);
		this.PlayerClipSource = graphics.makeClipSource(['PLAYER'], 4, 4);
		this.EffectClipSource = graphics.makeClipSource(effectTypes, 4, 4);
		this.GameObjectClipSource = graphics.makeClipSource(gameObjectTypes, 4, 4);
		this.makeDoorClipSource();	
		graphics.context = this.context;
		graphics.setLightSourceDestination(this.tilesContext);
	},
	makeDoorClipSource() {
		const types = ['open', 'locked', 'sealed', 'bombable', 'bombed'];
		let x = 0;
		let y = 0;
		let width = GameUtilities.TILE_WIDTH * 3;
		let height = GameUtilities.TILE_HEIGHT * 1.5;

		for (let key in GameUtilities.Direction) {
			let direction = GameUtilities.Direction[key];
			x = 0;
			y = 0;

			if (direction === GameUtilities.Direction.NORTH
				|| direction === GameUtilities.Direction.SOUTH) {
				if (direction === GameUtilities.Direction.SOUTH) {
					x = GameUtilities.TILE_WIDTH * 3;
				}

				width = GameUtilities.TILE_WIDTH * 3;
				height = Math.floor(GameUtilities.TILE_HEIGHT * 1.5);
			} else {
				x = GameUtilities.TILE_WIDTH * 6;
				if (direction === GameUtilities.Direction.WEST) {
					y = GameUtilities.TILE_HEIGHT * 3;
				}	
				height = GameUtilities.TILE_HEIGHT * 3;
				width = Math.floor(GameUtilities.TILE_WIDTH * 1.5);
			}

			this.DoorClipSource[direction] = {};

			types.forEach(type => {
				this.DoorClipSource[direction][type] =
				{			
					x: x,
					y: y,
					width: width,
					height: height 
				};
				if (direction === GameUtilities.Direction.NORTH
					|| direction === GameUtilities.Direction.SOUTH) {
					y += Math.floor(GameUtilities.TILE_HEIGHT * 1.5);
				} else {
					x += Math.floor(GameUtilities.TILE_WIDTH * 1.5);
				}
			});
		};
	},
	drawDoorOpening(x, y, dir, animationTime) {
		let animationFrame = Math.floor(animationTime / 5);
		let img = graphics.Image.DOOR;

		img += `_CLOSE_${dir}`;

		let drawWidth = 0;
		let drawHeight = 0;
		let sourceX = 0;
		let sourceY = 0;
		let animationOffset;

		// animation image progression based on north direction
		if (dir === GameUtilities.Direction.WEST
			|| dir === GameUtilities.Direction.NORTH) {
			// animation progression is flipped in this case
			animationFrame = 3 - animationFrame;
		}

		animationOffset =
				animationFrame * Math.floor(GameUtilities.TILE_WIDTH * 1.5);

		if (dir === GameUtilities.Direction.EAST ||
			dir === GameUtilities.Direction.WEST) {
				drawWidth = GameUtilities.TILE_WIDTH * 1.5;
				drawHeight = GameUtilities.TILE_HEIGHT * 2.5;
				sourceX = animationOffset;
				y -= 10;
		} else {
			drawWidth = GameUtilities.TILE_WIDTH * 2.5;
			drawHeight = GameUtilities.TILE_HEIGHT * 1.5;
			sourceY = animationOffset;
		}
	
		this.context.drawImage(
			graphics.images[img],
			sourceX, sourceY,
			drawWidth, drawHeight,
			x, y,
			drawWidth, drawHeight
		);
	},
	calculateScrollOffset(
		scrollDirection,
		isTransitioningToUnderground,
		isTransitioningFromUnderground
	) {
		let scrollOffsetX = 0;
		let scrollOffsetY = 0;

		if (!isTransitioningToUnderground && !isTransitioningFromUnderground) {
			if (scrollDirection === GameUtilities.Direction.NORTH) {
				scrollOffsetY = this.transitionDeltaY;
			} else if (scrollDirection === GameUtilities.Direction.EAST) {
				scrollOffsetX = this.transitionDeltaX * -1;
			} else if (scrollDirection === GameUtilities.Direction.SOUTH) {
				scrollOffsetY = this.transitionDeltaY * -1;
			} else {
				scrollOffsetX = this.transitionDeltaX;
			}
		}

		return { scrollOffsetX, scrollOffsetY };
	},
	calculateNextScreenOffset(scrollDirection) {
		let nextScreenOffsetX = 0;
		let nextScreenOffsetY = 0;

		if (scrollDirection === GameUtilities.Direction.NORTH) {
			nextScreenOffsetY = GameUtilities.ScreenDimension.HEIGHT * -1;
		} else if (scrollDirection === GameUtilities.Direction.EAST) {
			nextScreenOffsetX = GameUtilities.ScreenDimension.WIDTH;
		} else if (scrollDirection === GameUtilities.Direction.SOUTH) {
			nextScreenOffsetY = GameUtilities.ScreenDimension.HEIGHT;
		} else {
			nextScreenOffsetX = GameUtilities.ScreenDimension.WIDTH * -1;
		}

		return { nextScreenOffsetX, nextScreenOffsetY };
	},
	drawScreenTransition(transitioningScreenTimer,
		direction, nextScreen, previousScreen,
		isTransitioningToUnderground = false,
		isTransitioningFromUnderground = false) {
		const timerTime = transitioningScreenTimer.getTime();
		const maxTime = transitioningScreenTimer.getMaxTime();

		if (timerTime === maxTime - 1) {
			// close enough, lock bkg to corner and stop scrolling
			this.$background.style.backgroundPositionX = '0';
			this.$background.style.backgroundPositionY = '0';
			this.scrollOffsetX = 0;
			this.scrollOffsetY = 0;
			// fix location of tiles to their position without screen scrolling applied
			this.shouldUpdateTiles = true;

			return true;
		}

		const bkgX = parseInt(this.$background.style.backgroundPositionX) || 0;
		const bkgY = parseInt(this.$background.style.backgroundPositionY) || 0;
		const { tiles: nextTiles, gameObjects: nextGameObjects } = nextScreen;
		const { tiles, gameObjects } = previousScreen;
		let { nextScreenOffsetX, nextScreenOffsetY } =
			this.calculateNextScreenOffset(direction);
		
		let { scrollOffsetX, scrollOffsetY } =
			this.calculateScrollOffset(
				direction,
				isTransitioningToUnderground,
				isTransitioningFromUnderground
			);	

		this.scrollOffsetX += scrollOffsetX;
		this.scrollOffsetY += scrollOffsetY;
		this.$background.style.backgroundPositionY = this.scrollOffsetY + 'px';
		this.$background.style.backgroundPositionX = this.scrollOffsetX + 'px';

		this.drawTiles(tiles.flat(), this.scrollOffsetX, this.scrollOffsetY);
		this.drawTiles(
			nextTiles.flat(),
			this.scrollOffsetX + nextScreenOffsetX,
			this.scrollOffsetY + nextScreenOffsetY
		);

		this.drawGameObjects(
			gameObjects,
			this.scrollOffsetX,
			this.scrollOffsetY
		);

		this.drawGameObjects(
			nextGameObjects,
			this.scrollOffsetX + nextScreenOffsetX,
			this.scrollOffsetY + nextScreenOffsetY
		);
		return false;
	},

	drawGameObject(gameObject, ClipSource, imageType, offsetX = 0, offsetY = 0) {
		const {
			x, y, width, height,
			invincibleTimer,
			isInvincible,
			dir,
		} = gameObject;
		let drawImage = graphics.Image[imageType];

		const clipSource = graphics.getClipSource(
			gameObject, GameUtilities.clampDirToCardinal(dir), ClipSource
		);

		if (isInvincible) {
			drawImage = graphics.getHurtImage(imageType, invincibleTimer);
		}		

		graphics.drawTile(
			this.context, drawImage,
			x + offsetX, y + offsetY,
			clipSource[0], clipSource[1]
		);
	},
	drawSwordAndShield(sword, shield, dir) {
		const { isActive } = sword;
		const { x, y, width, height } = shield;
		let clipSource = this.ShieldClipSource[shield.type][0][dir];
		let sourceX = clipSource[0];

		if (isActive) {
			sourceX += GameUtilities.TILE_WIDTH * 4;
		}

		graphics.drawTile(
			this.context, graphics.Image.SHIELD,
			x, y,
			sourceX, clipSource[1]
		);
	
		if (isActive) {
			this.drawGameObject(sword, this.SwordClipSource, graphics.Image.SWORD, 0, 0, true);
		}
	},
	drawPlayerTreasureStance(player) {
		const { x, y, width, height } = player;

		// draws lonk holding up treasure
		graphics.drawTile(
			this.context,
			graphics.Image.LONK,
			x, y,
			0, GameUtilities.TILE_HEIGHT
		);
		graphics.drawTile(
			this.context,
			graphics.Image.TREASURE,
			x, y - GameUtilities.TILE_HEIGHT
		);	
	},
	drawPlayer(player) {
		const { sword, shield, width, height, isSwiming, isInvincible,
			dir, x, y, walkingAnimation, isMoving, hitBox,
			hasTreasure
		} = player;
		const { x: swordX, y: swordY, dir: swordDir } = sword;

		if (hasTreasure) {
			this.drawPlayerTreasureStance(player);
			return;
		}

		if (dir === GameUtilities.Direction.EAST
			|| dir === GameUtilities.Direction.NORTH
			|| dir === 360) {
			//draw equipment under lonk
			this.drawSwordAndShield(sword, shield, dir);
			this.drawGameObject(player, this.PlayerClipSource, graphics.Image.LONK);
		} else {
			this.drawGameObject(player, this.PlayerClipSource, graphics.Image.LONK);
			this.drawSwordAndShield(sword, shield, dir);
		}
	//	game.utilities.graphics.drawLightSource(x, y);

	},
	drawTileDebugInfo(tile) {
		const { row, col, isWalkable } = tile;
		const { x, y } = this.gameUtilities.tileToPixel(row, col);

		this.context.fillStyle = 'black';
		this.context.fillText(`row ${row}`, x, y + 15);
		this.context.fillText(`col ${col}`, x, y + 30);
		this.context.fillText(`w ${isWalkable}`, x, y + 45);
	},
	drawSmoke(x, y, sourceX) {
		graphics.drawTile(
			this.context,
			graphics.Image.EFFECTS,
			x, y,
			sourceX
		);
	},
	drawEnemies(enemies) {
		enemies.forEach(enemy => {
			const { isActive, isSpawning, isDisappearing,
				type, x, y, width, height } = enemy;

			if (isActive) {
				if (isSpawning && type !== GameUtilities.EnemyType.TRAP_STATUE) {
					// spawning in trap statue will give away surprise
					const { spawnTimer } = enemy;

					const spawningAnimationFrame =
						parseInt(spawnTimer.getTime() / 8);
					const sourceX = spawningAnimationFrame * GameUtilities.TILE_WIDTH;

					this.drawSmoke(x, y, sourceX);

					return;
				}

				if (isDisappearing) {
					const { disappearTimer } = enemy;

					const disappearingAnimationFrame =
						parseInt(disappearTimer.getTime() / 8);
					const sourceX = disappearingAnimationFrame * GameUtilities.TILE_WIDTH;

					if (type === GameUtilities.EnemyType.DRAGON) {
						// cool boss explosion
						for(let i=0; i<5; i++) {
							this.drawSmoke(
								Math.floor(Math.random() * width + x),
								Math.floor(Math.random() * height + y),
								sourceX
							);
						}
					} else {
						this.drawSmoke(x, y, sourceX);
					}
					return;
				}

				if (type === GameUtilities.EnemyType.DRAGON) {
					drawBoss(enemy, this.context);
				} else if (type === GameUtilities.EnemyType.TRAP_STATUE) {
					graphics.drawTile(
						this.context,
						graphics.Image.TILES,
						x, y,
						0, GameUtilities.TILE_HEIGHT * 3
					);
				} else {
					this.drawGameObject(enemy,
						this.EnemyClipSource,
						graphics.Image.ENEMIES
					);
				}
			}
		});
	},

	drawDoor(gameObject, offsetX = 0, offsetY = 0) {
		const { dir, x, y, isLocked, isSealed, isBombable, isBombed } = gameObject;
		let doorState = 'open';

		if (isLocked) doorState = 'locked';
		if (isSealed) doorState = 'sealed';
		if (isBombable) doorState = 'bombable';
		if (isBombed) doorState = 'bombed';

		let {
			x: sourceX,
			y: sourceY,
			width: sourceWidth,
			height: sourceHeight
		} = this.DoorClipSource[dir][doorState];

		this.context.drawImage(
			graphics.images[graphics.Image.DOOR],
			sourceX, sourceY,
			sourceWidth, sourceHeight,
			x + offsetX, y + offsetY,
			sourceWidth, sourceHeight
		);
	},

	drawDebugInfo(game) {
		const { fps, currentScreen, player } = game;
		const { row, col, gameObjects, enemies, pickups } = currentScreen;
		const { hitBox } = player;
		const debugObjects = [...gameObjects, ...enemies, ...pickups];

		this.context.font = '30px arial';
		this.context.fillText(`row ${row}`, 50, 50);
		this.context.fillText(`col ${col}`, 150, 50);
		this.context.fillText(fps, 250, 50);

		// draw object hitboxes
		this.context.strokeStyle = 'red';
		hitBox.getAllCornerPoints().forEach(point => {
			this.context.strokeRect(
				point.x, point.y,
				point.width, point.height
			);
		});
		debugObjects.forEach(gameObject => {
			const { hitBox } = gameObject; 

			this.context.strokeRect(
				hitBox.x, hitBox.y,
				hitBox.width, hitBox.height
			);
		});
		this.context.strokeStyle = 'black';
	},
	shouldDrawTile(tileType) {
		return (
			tileType !== GameUtilities.TileType.DUNGEON_FLOOR
			&& tileType !== GameUtilities.TileType.DUNGEON_WALL
			&& tileType !== GameUtilities.TileType.WALKABLE
		);
	},
	drawColumn(x, y, offsetX = 0, offsetY = 0) {
		this.tilesContext.drawImage(
			graphics.images[graphics.Image.TILES],
			GameUtilities.TILE_WIDTH, 0,
			GameUtilities.TILE_WIDTH,
			GameUtilities.TILE_HEIGHT * 3,
			x + offsetX, 0 + offsetY,
			GameUtilities.TILE_WIDTH,
			GameUtilities.TILE_HEIGHT * 3
		);
	},
	drawTile(tile, offsetX = 0, offsetY = 0) {
		const { isAnimated, animationTimer, warpTo, row, col, type } = tile;
		const x = col * GameUtilities.TILE_WIDTH;
		const y = row * GameUtilities.TILE_HEIGHT;
		const clipSource = this.TileClipSource[type][0][GameUtilities.Direction.NORTH];
		let sourceX = clipSource[0];

		if (isAnimated) {
			sourceX += (GameUtilities.TILE_WIDTH * animationTimer.getTime());
		}

		if (warpTo) {
			this.tilesContext.strokeRect(x, y, GameUtilities.TILE_WIDTH, GameUtilities.TILE_HEIGHT);
		}

		if (!this.shouldDrawTile(type)) {
			return;
		}

		if (type === GameUtilities.TileType.COLUMN) {
			this.drawColumn(x, y, offsetX, offsetY);
			return;	
		}

		graphics.drawTile(
			this.tilesContext,
			graphics.Image.TILES,
			x + offsetX, y + offsetY,
			sourceX, clipSource[1]
		);
	},
	drawBossDoor(door, drawOffsetX = 0, drawOffsetY = 0) {
		const { isUnlocking, isOpening, isOpen, x, y, width, height } = door;
		const animationFrame = door.getCurrentAnimationFrame();
		let sourceX = 0;
		let sourceY = 0;
		let drawFrame = animationFrame;

		if (animationFrame > 9) {
			drawFrame = Math.floor(animationFrame / 10);
		} else {
			drawFrame = 1;
		}

		if (isUnlocking || isOpening) {
			sourceY = height * (drawFrame - 1);
		}

		if (isOpening) {
			sourceX = width;
		}

		if (isOpen) {
			sourceY = height * 3;
			sourceX = width;
		}
		
		this.context.drawImage(
			graphics.images[graphics.Image.BOSS_DOOR],
			sourceX, sourceY, width, height,
			x + drawOffsetX, y + drawOffsetY, width, height
		);
	},

	drawExplosion(sourceGameObject) {
		const {
			explosionX, explosionY,
			explosionWidth, explosionHeight,
			explodingTimer
		} = sourceGameObject;
		const explosionFrame = parseInt(explodingTimer.getTime() / 10);
		const sourceX = explosionFrame * GameUtilities.TILE_WIDTH * 2;
		const sourceY = GameUtilities.TILE_HEIGHT;

		this.context.drawImage(
			graphics.images[graphics.Image.EFFECTS],
			sourceX, sourceY,
			explosionWidth, explosionHeight,
			explosionX, explosionY,
			explosionWidth, explosionHeight
		);
	},
	drawBombs(bombs) {
		const activeBombs = bombs.filter(bomb => bomb.isActive);

		activeBombs.forEach(bomb => {
			const {
				x, y, isExploding,
				fuseAnimationTimer
			} = bomb;
			const time = fuseAnimationTimer.getTime();

			if (!isExploding) {
				graphics.drawTile(
					this.context, graphics.Image.OBJECTS,
					x, y,
					time * GameUtilities.TILE_WIDTH,
					GameUtilities.TILE_HEIGHT * 3
				);
			} else {
				this.drawExplosion(bomb);
			}
		});
	},
	drawFireballs(fireballs) {
		fireballs.forEach(fireball => {
			const { x, y, isActive, animationTimer } = fireball;

			if (!isActive) return;

			graphics.drawTile(
				this.context, graphics.Image.ENEMIES,
				x, y,
				GameUtilities.TILE_WIDTH * (animationTimer.getTime() + 1),
				GameUtilities.TILE_HEIGHT * 8
			);
		});
	},
	drawPickups(pickups) {
		pickups.forEach(pickup => {
			const { type, isActive } = pickup;

			if (isActive) {
				if (type === GameUtilities.PickupType.TREASURE) {
					const {
						x, y,
						width, height,
						idleAnimation
					} = pickup;

					graphics.drawTile(
						this.context, graphics.Image.TREASURE,
						x, y,
						idleAnimation.getTime() * GameUtilities.TILE_WIDTH
					);
				} else {
					this.drawGameObject(pickup, this.PickupClipSource, graphics.Image.PICKUPS);
				}
			}
		});
	},
	drawGameObjects(gameObjects, offsetX = 0, offsetY = 0) {
		gameObjects.forEach(gameObject => {
			let { type, x, y, width, height } = gameObject;
			if (type === GameUtilities.GameObjectType.BOSS_DOOR) {
				const animationFrame = gameObject.getCurrentAnimationFrame();

				this.drawBossDoor(gameObject, offsetX, offsetY);
				return;
			}

			if (type === GameUtilities.GameObjectType.DUNGEON_DOOR) {
				this.drawDoor(gameObject, offsetX, offsetY);

				return;
			}
			if (type === GameUtilities.GameObjectType.BLOCK) {
				// draw block from tiles image
				graphics.drawTile(
					this.context, graphics.Image.TILES,
					x + offsetX, y + offsetY,
					0, GameUtilities.TILE_HEIGHT * 4
				);

				return;
			}

			this.drawGameObject(
				gameObject,
				this.GameObjectClipSource,
				graphics.Image.OBJECTS,
				offsetX, offsetY
			);
		});
	},
	screenHasDialog(screen) {
		const { gameObjects } = screen;

		for (let i=0; i<gameObjects.length; i++) {
			const { hasDialog, dialog } = gameObjects[i];

			if (hasDialog) {
				return dialog;
			}
		}

		return null;
	},
	startDrawingDialog(screen) {
		const dialog = this.screenHasDialog(screen);

		if (dialog) {
			graphics.startAnimatingText(dialog);
		}
	},
	drawDialog(screen) {
		if (this.screenHasDialog(screen)) {
				if (graphics.isAnimatingText) {
					if (graphics.animateLetterTimer.isRunning()) {
						graphics.progressAnimatedText();
					}
				} else {
					graphics.drawText(
						graphics.currentAnimatedText
					);
				}
		}
	},
	drawTiles(tiles, offsetX = 0, offsetY = 0) {
		graphics.clearContext(this.tilesContext);
		tiles.forEach(tile => {
			this.drawTile(tile, offsetX, offsetY);
		});
	},
	drawGameOver() {
		this.$gameOver.classList.remove('d-none');
		this.$game.classList.add('d-none');
	},
	draw(game) {
		if (!graphics.loaded) return;
		const { enemyExplosion, 
			currentScreen,
			previousScreen,
			bombs,
			bombExplosions,
			dungeons,
			player,
			transitioningScreenDirection,
			transitioningScreenTimer,
			isTransitioningToUnderground,
			isTransitioningFromUnderground,
			animatingDoorTimer,
			spawningEnemiesTimer,
			fps,
			fireballs,
			TileType, EnemyType, PickupType } = game;
		const { enemies, gameObjects, tiles, row, col } = currentScreen;
		const pickups = [...game.pickups, ...currentScreen.pickups];
		const { x: playerX, y: playerY } = player;

		graphics.clearContext(this.context);
		this.shouldUpdateTiles = false; // test

		if (transitioningScreenTimer.isRunning()) {
			graphics.clearContext(this.tilesContext);
			const doneDrawing = this.drawScreenTransition(
				transitioningScreenTimer,
				transitioningScreenDirection,
				currentScreen,
				previousScreen,
				isTransitioningToUnderground,
				isTransitioningFromUnderground
			);

			if (isTransitioningToUnderground) {
				// draw player walking down stairs
				const animationX = Math.floor(
					player.descendingStairsTimer.getTime() / 10
				) * GameUtilities.TILE_WIDTH;

				graphics.drawTile(
					this.context,
					graphics.Image.LONK_DESCEND_STAIRS,
					GameUtilities.TILE_WIDTH * 6, GameUtilities.TILE_HEIGHT * 5, // stairs x/y
					animationX, 0
				);
			}

			if (doneDrawing) {
				// start drawing screen dialog is there is any
				this.startDrawingDialog(currentScreen);

				if (isTransitioningToUnderground) {
					this.$background.classList.remove('dungeon-bkg');
					this.$background.classList.add('dungeon-underground-bkg');
				} else if (isTransitioningFromUnderground) {
					this.$background.classList.add('dungeon-bkg');
					this.$background.classList.remove('dungeon-underground-bkg');
				} else if (
					this.$background.classList.contains(
						'dungeon-underground-bkg'
					)
				) {
					this.$background.classList.add('dungeon-bkg');
					this.$background.classList.remove(
						'dungeon-underground-bkg'
					);
				}
			} 

			this.drawingNewScreen = true;

			return;
		}


		if (this.drawingNewScreen) {
			// always draw tiles at least once per screen
			this.shouldUpdateTiles = true;
			// update HUD to show new room discovered
			this.shouldUpdateHUD = true;
		}

		if (tiles.flat().find(tile => tile.hasChanged())) {
			this.shouldUpdateTiles = true;
		}

		if (this.shouldUpdateTiles) {
			this.drawTiles(tiles.flat());
		}

		this.drawFireballs(fireballs);
		this.drawBombs(bombs);
		this.drawPickups(pickups);
		this.drawGameObjects(gameObjects);
		this.drawEnemies(enemies);
		this.drawPlayer(player);
		this.drawDialog(currentScreen);

		if (animatingDoorTimer.isRunning()) {
			const doors = game.currentScreen.getAllOpeningDoors();	
			doors.forEach(door => {
				const { x, y, dir } = door;

				this.drawDoorOpening(
					x, y, dir, animatingDoorTimer.getTime()
				);
			});
		}

		if (player.hasGottenPickup || player.isUsingBomb || player.isStunned) {
			this.shouldUpdateHUD = true;
		}

		if (this.shouldUpdateHUD) {
			this.shouldUpdateHUD = false;
			HUD.draw(player, dungeons[0]);
		}
		if (this.isDebug) {
			this.drawDebugInfo(game);
		}
	}
};

export { display };
