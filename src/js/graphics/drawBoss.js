import { GameUtilities } from '../utils/game';
import { graphics } from '../utils/graphics';

const drawBoss = function(boss, context) {
	const {
		isOpeningMouth,
		isClosingMouth,
		x, y, width, height,
		attackingTimer,
		isAttacking,
		openingMouthTimer,
		closingMouthTimer,
		isInvincible,
		invincibleTimer,
		MAX_MOUTH_FRAMES
	} = boss;

	const headFrameWidth = parseInt(GameUtilities.TILE_WIDTH * 2.5);
	let headFrame = 0;
	let headImg = (!isInvincible)
		? graphics.Image.BOSS_HEAD
		: graphics.getHurtImage(
			graphics.Image.BOSS_HEAD,
			invincibleTimer
		);

	if (isOpeningMouth) {
		headFrame = openingMouthTimer.getTime();
	} else if (isClosingMouth) {
		// reverse animation for mouth closing
		headFrame = MAX_MOUTH_FRAMES - (closingMouthTimer.getTime() + 1);
	} else if (isAttacking) {
		headFrame = MAX_MOUTH_FRAMES - 1;
	}

	context.drawImage(
		graphics.images[graphics.Image.BOSS_BODY],
		0, 0,
		GameUtilities.TILE_WIDTH * 4,
		GameUtilities.TILE_HEIGHT * 4,
		x, y,
		width, height
	);
	context.drawImage(
		graphics.images[graphics.Image[headImg]],
		headFrame * headFrameWidth, 0,
		headFrameWidth,
		GameUtilities.TILE_HEIGHT * 2,
		x + parseInt(GameUtilities.TILE_WIDTH / 1.25),
		parseInt(y + GameUtilities.TILE_HEIGHT * 2.5),
		headFrameWidth,
		GameUtilities.TILE_HEIGHT * 2
	);
}

export { drawBoss }
