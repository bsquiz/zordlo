game.Tests.Player = {
	beforeTest(game) {
		const { player } = game;

		player.x = GameUtilities.ScreenCenter.X;
		player.y = GameUtilities.ScreenCenter.Y;
		player.rotate(GameUtilities.Direction.WEST);
		player.moveSword();
	},
	async move(game, direction = GameUtilities.Direction.NORTH, duration = 500) {
		const { wait } = game.Tests;
		let keyCode;

		if (direction === GameUtilities.Direction.NORTH) {
			keyCode = game.input.KeyCode.UP;
		} else if (direction === GameUtilities.Direction.SOUTH) {
			keyCode = game.input.KeyCode.DOWN;
		} else if (direction === GameUtilities.Direction.EAST) {
			keyCode = game.input.KeyCode.RIGHT;
		} else {
			keyCode = game.input.KeyCode.LEFT;
		}
		game.input.pressKey(keyCode);
		await wait(duration);
		game.input.releaseKey(keyCode);
	},
	async attackEnemy(game, enemyType, enemyName) {
		const { player, currentScreen } = game;
		const { wait, expect, notEqual } = game.Tests;
		const enemy = GameUtilities.makeEnemy(enemyType);
		const { health } = enemy;

		currentScreen.enemies.push(enemy);
		await this.useSword(game, GameUtilities.Direction.WEST);
		
		expect(`${enemyName} took damage from sword`, notEqual(health, enemy.health));
		await wait(500);
		enemy.health = 0;
	},
	async useSword(game, direction) {
		const { player } = game;
		const { MAX_USING_SWORD_TIME } = player;
		const { wait, expect, equal } = game.Tests;

		expect(equal(player.canUseSword, true));
		expect(equal(player.sword.isActive, false));

		player.rotate(direction);
		game.input.pressKey(game.input.KeyCode.SPACE);
		await wait(MAX_USING_SWORD_TIME);
		//await wait(1000);

		game.input.releaseKey(game.input.KeyCode.SPACE);
		expect(equal(player.canUseSword, false));
		expect(equal(player.sword.isActive, true));
	},
	async canUseSword(game) {
		await this.useSword(game, GameUtilities.Direction.NORTH);
		await this.useSword(game, GameUtilities.Direction.EAST);
		await this.useSword(game, GameUtilities.Direction.SOUTH);
		await this.useSword(game, GameUtilities.Direction.WEST);
	},
	async canUseBomb(game) {
		const { wait, expect, equal } = game.Tests;
		const { player } = game;

		player.bombs = 1;
		expect('player has 1 bomb', equal(player.bombs, 1));
		expect('player is not using bomb', equal(player.isUsingBomb, false));
		player.useBomb();
		expect('player has zero bombs', equal(player.bombs, 0));
		expect('player is using bombs', equal(player.isUsingBomb, true));
		await wait(10);
	},
	async canAttackEnemy(game) {
		this.beforeTest(game);
		await this.attackEnemy(game, GameUtilities.EnemyType.SLIME, 'slime');
		await this.attackEnemy(game, GameUtilities.EnemyType.SKELETON, 'skeleton');
		await this.attackEnemy(game, GameUtilities.EnemyType.BAT, 'bat');
		await this.attackEnemy(game, GameUtilities.EnemyType.ZORA, 'zora');
		await this.attackEnemy(game, GameUtilities.EnemyType.SNAKE, 'snake');
	},
	async canAttackEnemyWithBomb(game) {
		this.beforeTest(game);
		player.bombs = 1;
		player.useBomb();
	},
	async canBeHurtByEnemy(game) {
		const slime = new Slime();
	},
	async canMove(game) {
		const { player } = game;
		const { wait, expect, notEqual, greaterThan, lessThan } = game.Tests;
		let x = player.x;
		let y = player.y;

		await this.move(game, GameUtilities.Direction.NORTH);
		expect('player moved north', greaterThan(y, player.y));

		await this.move(game, GameUtilities.Direction.EAST);
		expect('player moved east', lessThan(x, player.x));

		y = player.y;
		x = player.x;

		await this.move(game, GameUtilities.Direction.SOUTH);
		expect('player moved south', lessThan(y, player.y));

		await this.move(game, GameUtilities.Direction.WEST);
		expect('player moved west', greaterThan(x, player.x));
	},
	canTakeDamage() {

	},
	canGetPickup(game) {
		const { player, PickupType } = game;
		const { expect, equal } = game.Tests;

		player.keys = 0;
		player.getPickup({ type: PickupType.KEY }, PickupType);
		expect('player has key', equal(player.keys, 1));

		player.bombs = 0;
		player.getPickup({ type: PickupType.BOMBS }, PickupType);
		expect('player has bomb', equal(player.bombs, 1));

		player.health = 1;
		player.getPickup({ type: PickupType.HEART }, PickupType);
		expect('player has health' ,equal(player.health, 2));

		player.money = 0;
		player.getPickup({ type: PickupType.RUPEE }, PickupType);
		expect('player has money', equal(player.money, 1));

		player.hasCompass = false;
		player.getPickup({ type: PickupType.COMPASS }, PickupType);
		expect('player has compass', equal(player.hasCompass, true));

		player.hasMap = false;
		player.getPickup({ type: PickupType.MAP }, PickupType);
		expect('player has map', equal(player.hasMap, true));
	},
	canGetTreasure() {
		player.hasTreasure = false;
		player.getPickup({ type: PickupType.TREASURE }, PickupType);
		expect('player has treasure', equal(player.hasTreasure, true));
	},
	canMoveBlock() {}
};
