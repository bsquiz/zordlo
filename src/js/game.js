"use strict"

import { GameUtilities } from './utils/game';
import { Dungeon_1 } from './dungeons/Dungeon_1';
import { Bomb } from './objects/Bomb';
import { Projectile } from './objects/Projectile';
import { Timer } from './Timer';
import { display } from './graphics/gameDisplay';
import { audio } from './audio';
import { Player } from './objects/Player';
import { Input } from './input/Input';

const game = {
	GameState: {
		PLAYING: 0,
		END_FANFARE: 1,
		END_FADE: 2,
		WIN: 3,
		LOSE: 4
	},
	isDebug: false,
	updateFrame: true,
	screenRow: 2,
	screenCol: 6,
	currentScreen: {},
	previousScreen: {},
	screens: new Map(),
	gameState: 0,
	gameScore: 0,
	gameLevel: 0,
	player: {},
	pickups: [],
	arrows: [],
	bombs: [],
	fireballs: [],
	gameObjects: [],
	dungeons: [],
	endFanFareTimer: new Timer(60),
	endFadeTimer: new Timer(60),
	transitioningScreenTimer: new Timer(32),
	animatingDoorTimer: new Timer(20),
	transitioningScreenDirection: 0,
	isTransitioningToUnderground: false,
	isTransitioningFromUnderground: false,
	fps: 0,
	totalFrames: 0,
	totalSeconds: 0,
	makeWarpDebug() {
		for (let i=2; i<6; i++) {
			for (let j=1; j<7; j++) {
				if (
					(i===2 && j===5)||
					(i===3 && j===1) ||
					(i===5 && j===2)
				) {
					continue;
				}

				let b = document.createElement('button');
				b.onclick = function() {
					game.warpPlayer(i, j, 500, 350);
				};
				b.innerHTML = i +' ' + j;
				document.getElementById('debug')
					.getElementsByTagName('div')[0]
					.appendChild(b);
			}
		}
	},
	init(imageUrls, audioUrls) {
		const urlParams = new URLSearchParams(window.location.search);

		this.isDebug = (urlParams.get('debug'));

		display.init(this, imageUrls);
		audio.init(audioUrls);

		audio.load();

		window.setTimeout(() => {
			//audio.playSound(audio.sounds.UNDERWORLD);
		}, 2000);
		// init fireballs
		for (let i=0; i<10; i++) {
			this.fireballs.push(new Projectile());
		}

		// init bombs
		for (let i=0; i<10; i++) {
			this.bombs.push(new Bomb(GameUtilities.GameObjectType.BOMB));
		}
		this.dungeons.push(
			new Dungeon_1(this)
		);
		this.screens = this.dungeons[0].screens; 
		this.currentScreen = this.screens.get(
			`${this.screenRow}_${this.screenCol}`
		);
		this.player = new Player(this);
		Input.init();
		display.draw(this);
		this.warpPlayer(5, 4, 500, 400); // starting room

		//this.warpPlayer(2, 6, 500, 400); // test room
	//	this.warpPlayer(3, 2, 150, 150); // hidden room
	//	this.warpPlayer(5, 1, GameUtilities.TILE_WIDTH * 3, 150); // underground room
		//this.warpPlayer(5, 4, 150, 150);
//		this.warpPlayer(5, 5, 450, 350);
		//this.warpPlayer(5, 6, 150, 150);
		//this.warpPlayer(5, 3, 150, 150);
	//	this.warpPlayer(5, 2, 150, 150);
		//this.warpPlayer(4, 1, 550, 350); // ladder down room
//		this.warpPlayer(4, 2, 550, 350);
	//	this.warpPlayer(4, 3, 150, 150);
		//this.warpPlayer(4, 4, 150, 150);
		//this.warpPlayer(4, 5, 150, 150);
		//this.warpPlayer(4, 6, 150, 150); // boss entrance room
	//	this.warpPlayer(3, 4, 150, 150); // map room
//		this.warpPlayer(3, 6, 450, 450); // boss room
		//this.warpPlayer(2, 1, 150, 150); // boss key room
//		this.warpPlayer(2, 2, 150, 150);
		//this.warpPlayer(2, 4, 150, 150);
//		this.warpPlayer(2, 6, 150, 150); // end room
	//	this.warpPlayer(3, 5, 150, 150);

		if (this.isDebug) {
			this.makeWarpDebug();
			document.getElementById('debug').classList.remove('d-none');
			this.player.hasFlippers = true;
			this.player.hasBossKey = true;
			this.player.bombs = 10;
			this.player.hasCompass = true;
			this.player.hasMap = true;
			this.player.keys = 10;
			
			window.setInterval(function() {
				game.totalSeconds++;
				if (game.totalSeconds > 1000000) {
					game.totalSeconds = 0;
				}
			}, 1000);
		}
	},
	winGame() {
		this.gameState = this.GameState.WIN;
	},
	startScreenTransition(dir) {
		this.transitioningScreenTimer.start();
		this.transitioningScreenDirection = dir;
	},
	deflectPlayerSword() {
		this.player.swordStrikeRecoil();
		audio.playSound(audio.sounds['TRAP_BOUNCE']);
	},
	warpPlayer(screenRow, screenCol, screenX, screenY) {
		this.isTransitioningToUnderground = false;
		this.isTransitioningFromUnderground = false;
		if (screenRow === 5 && screenCol === 1) {
			// from above to underground
			this.isTransitioningToUnderground = true;
			this.player.descendStairs();
			audio.playSound(audio.sounds.STAIRS);
		} else if (screenRow === 4 && screenCol === 1 &&
			this.currentScreen.row === 5 && this.currentScreen.col === 1) {
			// from underground to above
			this.isTransitioningFromUnderground = true;
			audio.playSound(audio.sounds.STAIRS);
		}

		this.screenRow = screenRow;
		this.screenCol = screenCol;
		this.previousScreen = this.currentScreen;
		this.currentScreen =
			this.screens.get(`${this.screenRow}_${this.screenCol}`);
		this.currentScreen.isDiscovered = true;
		this.player.setPosition(screenX, screenY);
		this.player.moveShield();
		if (this.currentScreen.isSealed) {
			this.currentScreen.sealAllDoors();
		}
	},
	checkWarp(gameObject) {
		const { tiles } = this.currentScreen;
		const checkTiles = GameUtilities.getCheckTiles(gameObject, tiles);

		for (let i=0; i<checkTiles.length; i++) {
			const { shouldWarp } = checkTiles[i];

			if (shouldWarp) {
				return {
					shouldWarp,
					tile: checkTiles[i]
				}
			}
		}

		return {
			shouldWarp: false,
			tile: null
		};
	},

	checkInputs() {
		//this.Input.debug();
		let dir = -1;

		if (Input.getInputReleased(Input.InputCode.A)) {	
			this.player.canUseSword = true;
		}

		if (Input.getInputActive(Input.InputCode.B)) {
			if (this.player.canUseBomb()) {
				this.player.useBomb();
			}
		}

		if (Input.getInputActive(Input.InputCode.A)) {
			if (this.player.canUseSword) {
				audio.playSound(audio.sounds.SWORD);
				this.player.attack();
			}
		}

		if (Input.getInputActive(Input.InputCode.LEFT)) {
			dir = GameUtilities.Direction.WEST;
		}
		if (Input.getInputActive(Input.InputCode.RIGHT)) {
			dir = GameUtilities.Direction.EAST;
		}
		if (Input.getInputActive(Input.InputCode.UP)) {
			dir = GameUtilities.Direction.NORTH;
		}
		if (Input.getInputActive(Input.InputCode.DOWN)) {
			dir = GameUtilities.Direction.SOUTH;
		}
		
		if (dir !== -1 &&
			!this.player.sword.isActive) {
			this.player.rotate(dir);
			this.player.isMoving = true;
		} else {
			this.player.stop();
		}
	},
	activateHiddenEvent(screen) {
		const { action, targetTile } = screen.hiddenEvent;
		const { x, y } = GameUtilities.tileToPixel(
			targetTile[0], targetTile[1],
			GameUtilities.TILE_WIDTH, GameUtilities.TILE_HEIGHT
		);
		audio.playSound(audio.sounds.SECRET);
		switch (action) {
			case GameUtilities.TriggerActionType.SPAWN_PICKUP:
				const { spawnPickupType } = screen.hiddenEvent;
				const pickup = GameUtilities.makePickup(x, y, spawnPickupType);

				this.pickups.push(pickup);
			break;
			case GameUtilities.TriggerActionType.OPEN_DOORS:
				this.currentScreen.unseal();
			break;
			default: break;
		}
	},
	changeOverworldScreens() {
		this.startScreenTransition();
			const { x: newX, y: newY } =
				GameUtilities.wrapPlayerPosition(
					x, y,
					GameUtilities.ScreenDimension.WIDTH,
					GameUtilities.ScreenDimension.HEIGHT
				);
			const { newScreenRow, newScreenCol } =
				GameUtilities.changeScreen(	
					x, y,
					this.screenRow, this.screenCol
				);
		this.screenRow = newScreenRow;
		this.screenCol = newScreenCol;
		this.currentScreen = this.screens.get(
			`${newScreenRow}_${newScreenCol}`
		);
		this.player.setPosition(newX, newY);
	},
	updateDoor(door) {
		const { keys, hasBossKey } = this.player;
		const { type, isLocked } = door;

		if (!door.isPassable()) {
			this.player.stop();
			Input.reset();
			this.player.moveBackwards(1);
		}

		if (isLocked) {
			if (type === GameUtilities.GameObjectType.DUNGEON_DOOR) {
				if (keys > 0) {
					// open door
					audio.playSound(audio.sounds['DOOR_OPEN']);
					this.player.useKey();
					this.animatingDoorTimer.start();
					door.unlock();
					door.open();
				}
			} else {
				if (hasBossKey) {
					audio.playSound(audio.sounds.UNLOCK);
					door.unlock();
				}
			}
		}
	},
	updateGameObjects() {
		const { gameObjects } = this.currentScreen;
		const { hitBox, keys, hasBossKey } = this.player;
		const hitTestPoint = hitBox.getForewardPoint();

		const activeGameObjects = gameObjects.filter(gameObject => gameObject.isActive);

		activeGameObjects.forEach(gameObject => {
			gameObject.update();

			if (GameUtilities.hitTest(hitTestPoint, gameObject)) {
				const { type, canBePushed } = gameObject;

				if (GameUtilities.isDoor(gameObject)) {
					this.updateDoor(gameObject);

					return;
				}

				if (canBePushed) {
					const { pushableDirection, hasReachedTargetPosition } = gameObject;

					if (this.player.dir === pushableDirection) {
						this.player.isPushing = true;
						gameObject.bePushed(this.player.dir);
					} else {
						this.player.stop();
					}
				} else {
					this.player.stop();
				}
			}
		});
	},
	updateEnemies() {
		const { enemies, gameObjects, tiles } = this.currentScreen;
		const { sword } = this.player;
		const activeGameObjects = gameObjects.filter(gameObject => gameObject.isActive);
		const activeEnemies = enemies.filter(enemy => enemy.isActive);

		activeEnemies.forEach(enemy => {
			const { x, y, dir,
				isFlying, isMoving,
				isTrackingPlayer, isAttacking,
				isInvincible,
				type } = enemy;

			enemy.update();

			if (isTrackingPlayer) {
				enemy.setTrackingPoint(this.player.x, this.player.y);
			}

			if (isAttacking) {
				if (type === GameUtilities.EnemyType.ZORA) {
					if (enemy.attackTimer.getTime() === 1) {
						GameUtilities.makeFireball(x, y, dir, this.fireballs);
					}
				} else if (type === GameUtilities.EnemyType.DRAGON) {
					const { width, height } = enemy;
					const spawnFireballX = Math.floor(width / 2 - 30) + x;
					const spawnFireballY = Math.floor(height - 30) + y;
					const fireballDirs = [260, 220, 180, 140, 100];

					audio.playSound(audio.sounds.ROAR);
					for (let i=0; i<fireballDirs.length; i++) {
						GameUtilities.makeFireball(
							spawnFireballX, spawnFireballY,
							fireballDirs[i], this.fireballs
						);
					}
				} else {
					GameUtilities.makeFireball(x, y, dir, this.fireballs);
				}
			}

			// hittest enemy with player sword
			if (sword.isActive && !isInvincible) {
				const hitTestPoints = sword.hitBox.getAllCornerPoints(); 

				if (
					GameUtilities.hitTestAnyPoint(hitTestPoints, enemy)
				) {
					if (enemy.canBeAttacked) {
						audio.playSound(audio.sounds.HIT);
						enemy.takeDamage(
							this.player.dir
						);
					} else {
						this.deflectPlayerSword();
					}

					if (enemy.health <= 0 && enemy.hasPickup) {
						const pickup = GameUtilities.makePickup(
							x, y
						);
						this.pickups.push(pickup);
						enemy.hasPickup = false;
					}
				}
			}

			if (!this.player.isInvincible) {
				if (GameUtilities.hitTestAnyPoint(this.player.hitBox.getAllCornerPoints(), enemy)) {
					this.damagePlayer(GameUtilities.clampDirToCardinal(enemy.dir));
				}
			}

			if (!isMoving)  {
				return;
			}
 
			// hittest enemy with screen boundries / tiles 
			if (isFlying) {
				// bats and other flying creatures can fly over stuff
				if (GameUtilities.screenBoundsReached(enemy)) {
					enemy.blockedBehavior();
				}
				return;
			}
			if (!GameUtilities.objectCanMoveForward(enemy, tiles)) {
				if (enemy.type === GameUtilities.EnemyType.BLADE_TRAP) {
					audio.playSound(audio.sounds['TRAP_BOUNCE']);
				}
				enemy.blockedBehavior();
				return;
			}
			// hittest enemy with game objects
			for (let i=0; i<activeGameObjects.length; i++) {
				const { type } = activeGameObjects[i];

				if (type === GameUtilities.GameObjectType.DUNGEON_DOOR) {
					continue;
				}
				
				if (
					GameUtilities.hitTest(
						enemy.getFuturePosition(), gameObjects[i]
					)
				) {
					enemy.blockedBehavior();
				if (enemy.type === GameUtilities.EnemyType.BLADE_TRAP) {
					audio.playSound(audio.sounds['TRAP_BOUNCE']);
				}
					break;
				}
			}
		});
	},
	updatePlayer() {
		const { tiles } = this.currentScreen;
		const { sword } = this.player;
		const { hitBox } = sword;
		const hitTestPoints = hitBox.getAllCornerPoints(); 
		let shouldChangeScreen = false;

		if (this.player.isUsingBomb()) {
			GameUtilities.makeBomb(this.player.x, this.player.y, this.bombs);
		}

		if (sword.isActive) {
			// hittest sword with tiles
			tiles.forEach(row => {
				row.forEach(tile => {
					if (tile.isWalkable) return;
					const point = GameUtilities.tileToPixel(
						tile.row, tile.col
					);

					const tileTestPoint = {
						x: point.x, y: point.y,
						width: GameUtilities.TILE_WIDTH,
						height: GameUtilities.TILE_HEIGHT
					};	

					if (
						GameUtilities.hitTestAnyPoint(
							hitTestPoints,
							tileTestPoint
						)
					) {
						// push player back to avoid getting stuck
						this.deflectPlayerSword();
					}
				});
			});
		}
		
		const { x, y } = this.player.getFuturePosition();
		const { shouldWarp, tile } = this.checkWarp(this.player);

		if (shouldWarp) {
			const { warpTo } = tile;
			const { screenX, screenY, screenRow, screenCol, dir } = warpTo;
			this.player.stop();
			this.warpPlayer(screenRow, screenCol, screenX, screenY);
			this.startScreenTransition(dir);
			
			return;
		}

		shouldChangeScreen =
			GameUtilities.checkScreenChange(
				x, y,
				this.screenRow,
				this.screenCol
			);

		if (shouldChangeScreen) {
			this.startScreenTransition();
			player.stop();
		}

		if (!this.player.isFlying) {
			if (!GameUtilities.objectCanMoveForward(this.player, tiles)) {
				this.player.stop();
			}
		}

		this.player.update();
	},
	updatePickups() {
		const { pickups } = this.currentScreen;
		const allPickups = [...pickups, ...this.pickups];

		allPickups.forEach((pickup, index) => {
			const { type, hitBox, isActive } = pickup;

			if (!pickup.isActive) return;
			pickup.update();

			if (
				GameUtilities.hitTest(
					hitBox.getCenterPoint(),
					this.player.hitBox
				)
			) {
				if (type === GameUtilities.PickupType.HEART) {
					audio.playSound(audio.sounds.HEART);
				} else if (type === GameUtilities.PickupType.RUPEE) {
					audio.playSound(audio.sounds.RUPEE);
				} else if (type === GameUtilities.PickupType.KEY) {
					audio.playSound(audio.sounds.RUPEE);
				} else if (pickup.type === GameUtilities.PickupType.TREASURE) {
					this.gameState = this.GameState.END_FANFARE;
					audio.playSound(audio.sounds.TRIFORCE);
					this.endFanFareTimer.start();
				} else {
					audio.playSound(audio.sounds.KEY);
				}
				this.player.getPickup(pickup);

				pickups.splice(index, 1);
				pickup.isActive = false;
			}
		});
	},
	updateBombs() {
		const { gameObjects } = this.currentScreen;

		this.bombs.forEach(bomb => {
			if (!bomb.isActive) return;

			bomb.update();
			if (bomb.explosionStarted) {
				audio.playSound(audio.sounds.BOMB);
			}
			if (!bomb.isExploding) return;

			if (!this.player.isInvincible) {
				if (GameUtilities.hitTest(this.player, bomb.explosionHitBox)) {
					this.damagePlayer(GameUtilities.calculateRandomCardinalDirection());
				}
			}

			const hiddenDoors = gameObjects.filter(gameObject => gameObject.isBombable);

			hiddenDoors.forEach(door => {
				if (GameUtilities.hitTest(bomb.explosionHitBox, door)) {
					door.blowUp();
					audio.playSound(audio.sounds.SECRET);
				}
			});
		});
	},
	updateFireballs() {
		this.fireballs.forEach(fireball => {
			if (!fireball.isActive) return;

			fireball.update(GameUtilities.ScreenDimension.WIDTH, GameUtilities.ScreenDimension.HEIGHT);

			if (!this.player.isInvincible) {
				if (GameUtilities.hitTest(fireball.getCenter(), this.player)) {
					this.damagePlayer(
						GameUtilities.clampDirToCardinal(
							fireball.dir
						)
					);
				}
			}

		});
	},
	damagePlayer(damageDirection) {
		audio.playSound(audio.sounds['LONK_HIT']);
		this.player.takeDamage(damageDirection);
		if (this.player.health === 0) {
			if (this.player.hasPotion) {
				this.player.usePotion();
				audio.playSound(audio.sounds.HEART);
			} else {
				this.gameState = this.GameState.LOSE;
				display.drawGameOver();
			}
		}
	},
	update() {
		const { pickups, enemies, tiles, gameObjects } = this.currentScreen;
		const { sword, hitBox } = this.player;
		const points = hitBox.getCornerPoints();

		if (this.gameState === this.GameState.WIN ||
			this.gameState === this.GameState.END_FANFARE ||
			this.gameState === this.GameState.END_FADE ||
			this.gameState === this.GameState.PLAYING) {
			if (GameUtilities.shouldRedraw(this)) {
				display.draw(this);
			}
		}

		switch (this.gameState) {
			case this.GameState.LOSE:
			break;
			case this.GameState.END_FANFARE:
				if (!this.endFanfareTimer.update()) {
					this.gameState = this.GameState.END_FADE;
				}
			break;

			case this.GameState.END_FADE:
				if (!this.endFadeTimer.update()) {
					this.winGame();
				}
			break;

			case this.GameState.PLAYING:
				let shouldChangeScreen = false;

				this.updateEnemies();
				this.updateBombs();
				this.updateFireballs();
				this.updateGameObjects();
				this.updatePlayer();
				this.updatePickups();

				if (this.transitioningScreenTimer.isRunning()) {
					if (!this.transitioningScreenTimer.update()) {
						// spawn enemies animation
						const enemiesToSpawn = enemies.filter(enemy => enemy.isActive);
						enemiesToSpawn.forEach(enemy => {
							enemy.reset();
							enemy.spawn();
						});
					}
				} else if (this.animatingDoorTimer.isRunning()) {
					if (!this.animatingDoorTimer.update()) {
						this.currentScreen.openDoors(
							this.currentScreen.getAllOpeningDoors()
						);
					}	
				} else {

					this.checkInputs();

					tiles.forEach(row => {
						row.forEach(col => {
							col.update();
						});
					});

					if (this.currentScreen.hasHiddenEvent) {
						if (this.currentScreen.shouldActivateHiddenEvent(this)) {
							this.activateHiddenEvent(this.currentScreen);
						}
					}
				}
			break;
		}

		if (this.isDebug) {
			this.totalFrames++;
			this.fps = parseInt(this.totalFrames / this.totalSeconds);
		}

		window.requestAnimationFrame(function() { game.update(); });
	}
};

export { game };

