const HUD = {
	DRAW_ROOM_OFFSET: 5,
	ROOM_WIDTH: 0,
	ROOM_HEIGHT: 0,
    	MAP_HEIGHT: 0,
    	MAP_WIDTH: 0,
	mapContext: {},
	$mapCanvas: document.getElementById('mapCanvas'),
	$hearts: document.getElementById('hearts').getElementsByTagName('div'),
	$keys: document.getElementById('keys'),
	$money: document.getElementById('money'),
	$bombs: document.getElementById('bombs'),
	$potion: document.getElementsByClassName('potion')[0],
	$bossKey: document.getElementsByClassName('boss-key')[0],

	init(WIDTH, HEIGHT, $bossMarkerImage) {
		this.MAP_WIDTH = parseInt(WIDTH / 6);
		this.MAP_HEIGHT = parseInt(HEIGHT / 6);
		this.ROOM_WIDTH = parseInt(this.MAP_WIDTH / 6); 
		this.ROOM_HEIGHT = parseInt(this.MAP_HEIGHT / 4); 
		this.$mapCanvas.width = this.MAP_WIDTH;
		this.$mapCanvas.height = this.MAP_HEIGHT;
		this.mapContext = this.$mapCanvas.getContext('2d');
		this.$bossMarkerImage = $bossMarkerImage;
	},
	drawRoom(screen, hasMap, hasCompass) {
		const { row, col, hasBoss, isDiscovered } = screen;
		let drawRow = row;
		let drawCol = col;

		// Have to subtract on from row since the dungeon
		// starts at row 2.
		drawRow -= 1;
		// subtract one so that we start drawing at 0, 0
		drawRow -= 1;
		drawCol -= 1;

		if (hasMap || isDiscovered) {
			this.mapContext.fillStyle = 'gray';
			this.mapContext.fillRect(
				drawCol * this.ROOM_WIDTH,
				drawRow * this.ROOM_HEIGHT,
				this.ROOM_WIDTH - this.DRAW_ROOM_OFFSET,
				this.ROOM_HEIGHT - this.DRAW_ROOM_OFFSET 
			);
		}
		if (hasCompass && hasBoss) {
			this.mapContext.fillStyle = 'white';
			this.mapContext.fillRect(
				drawCol * this.ROOM_WIDTH + 4,
				drawRow * this.ROOM_HEIGHT + 2,
				this.ROOM_WIDTH - this.DRAW_ROOM_OFFSET,
				this.ROOM_HEIGHT - this.DRAW_ROOM_OFFSET 
			);
		}
	},
	resetHeart($heart) {
		$heart.classList.remove('heart');
		$heart.classList.remove('heart-half');
		$heart.classList.add('heart-outline');
	},
	fillHeart($heart) {
		$heart.classList.remove('heart-outline');
		$heart.classList.remove('heart-half');
		$heart.classList.add('heart');
	},	
	drawHealth(health) {
		this.resetHeart(this.$hearts[0]);
		this.resetHeart(this.$hearts[1]);
		this.resetHeart(this.$hearts[2]);

		for (let i=0; i<health; i++) {
			this.fillHeart(this.$hearts[i]);
		}
	},
    	draw(player, dungeon) {
		const {
			bombs, money, health, keys,
			hasBossKey, hasMap, hasCompass, hasPotion
		} = player;
		const { screens } = dungeon;
		this.$keys.innerHTML = keys;
		this.$money.innerHTML = money;
		this.$bombs.innerHTML = bombs;

		this.drawHealth(health);

		if (hasBossKey) {
			this.$bossKey.classList.remove('d-none');
		}
		if (hasPotion) {
			this.$potion.classList.remove('d-none');
		}
		this.mapContext.fillStyle = 'gray';
		this.mapContext.clearRect(0,0,this.MAP_WIDTH, this.MAP_HEIGHT);
		screens.forEach(screen => this.drawRoom(screen, hasMap, hasCompass)); 
	}
};

export { HUD };
