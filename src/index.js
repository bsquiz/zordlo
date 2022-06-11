//import Dungeon_Bkg from './img/dungeon_bkg.png';
import TILES_URL from './img/tiles/tiles.png';
import PICKUPS_URL from './img/pickups/pickups.png';
import TREASURE_URL from './img/pickups/treasure.png';

import BOSS_BODY_URL from './img/enemies/dragon_body.png';
import BOSS_HEAD_URL from './img/enemies/dragon_head.png';
import BOSS_HEAD_HURT_URL from './img/enemies/dragon_head_hurt.png';
import ENEMIES_URL from './img/enemies/enemies.png';
import ENEMIES_HURT_URL from './img/enemies/enemies_hurt.png';

import FONT_URL from './img/font/font.png';
import EFFECTS_URL from './img/effects/effects.png';

import LONK_URL from './img/lonk/lonk.png';
import LONK_HURT_URL from './img/lonk/lonk_hurt.png';
import LONK_DESCEND_STAIRS_URL from './img/lonk/lonk_descend_stairs.png';
import SHIELD_URL from './img/lonk/shield.png';
import SWORD_URL from './img/lonk/sword.png';

import BOSS_DOOR_URL from './img/game_objects/boss_door.png';
import DOOR_CLOSE_0_URL from './img/game_objects/door_close_0.png';
import DOOR_CLOSE_90_URL from './img/game_objects/door_close_90.png';
import DOOR_CLOSE_180_URL from './img/game_objects/door_close_180.png';
import DOOR_CLOSE_270_URL from './img/game_objects/door_close_270.png';
import DOOR_URL from './img/game_objects/door.png';

import BOSS_MARKER_URL from './img/map/boss_marker.png';
import OBJECTS_URL from './img/game_objects/objects.png';

import BOMB_SOUND_URL from './audio/bomb.mp3';
import DOOR_OPEN_SOUND_URL from './audio/doorOpen.mp3';
import HEART_SOUND_URL from './audio/heart.mp3';
import HIT_SOUND_URL from './audio/hit.mp3';
import KEY_SOUND_URL from './audio/key.mp3';
import LONK_HIT_SOUND_URL from './audio/lonkHit.mp3';
import ROAR_SOUND_URL from './audio/roar.mp3';
import RUPEE_SOUND_URL from './audio/rupee.mp3';
import SECRET_SOUND_URL from './audio/secret.mp3';
import STAIRS_SOUND_URL from './audio/stairs.mp3';
import SWORD_SOUND_URL from './audio/sword.mp3';
import TRAP_BOUNCE_SOUND_URL from './audio/trapBounce.mp3';
import TRIFORCE_SOUND_URL from './audio/triforce.mp3';
import UNDERWORLD_SOUND_URL from './audio/underworld.mp3';
import UNLOCK_SOUND_URL from './audio/unlock.mp3';

import './css/main.css';
import {game} from './js/game';

window.onload = function() {
	game.init({
		LONK_URL, LONK_HURT_URL, LONK_DESCEND_STAIRS_URL,
		SHIELD_URL, SWORD_URL,
		TILES_URL, PICKUPS_URL, TREASURE_URL,
		ENEMIES_URL, ENEMIES_HURT_URL,
		BOSS_BODY_URL, BOSS_HEAD_URL, BOSS_HEAD_HURT_URL,
		FONT_URL, EFFECTS_URL,
		BOSS_DOOR_URL, DOOR_URL, OBJECTS_URL,
		DOOR_CLOSE_0_URL, DOOR_CLOSE_90_URL,
		DOOR_CLOSE_180_URL, DOOR_CLOSE_270_URL,
		BOSS_MARKER_URL
	},{
		BOMB_SOUND_URL, DOOR_OPEN_SOUND_URL,
		HEART_SOUND_URL, HIT_SOUND_URL, KEY_SOUND_URL,
		LONK_HIT_SOUND_URL, ROAR_SOUND_URL, RUPEE_SOUND_URL, SWORD_SOUND_URL,
		SECRET_SOUND_URL, STAIRS_SOUND_URL, TRAP_BOUNCE_SOUND_URL,
		TRIFORCE_SOUND_URL, UNDERWORLD_SOUND_URL, UNLOCK_SOUND_URL
	});
			game.update();
			async function doTests() {
				await game.Tests.Player.canAttackEnemy(game);
				/*
				game.Tests.resetTestValues();
				await game.Tests.Player.canUseBomb(game);
				game.Tests.haveAllTestsPassed(4);
				game.Tests.resetTestValues();
				game.Tests.Player.canGetPickup(game);
				game.Tests.haveAllTestsPassed(6);
				game.Tests.resetTestValues();
				await game.Tests.Player.canMove(game);
				*/
				//await game.Tests.Player.canUseSword(game);
			}
			//doTests();
}