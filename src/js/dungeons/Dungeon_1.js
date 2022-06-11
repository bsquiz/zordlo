"use strict";

import { GameUtilities } from '../utils/game';
import { ScreenUtilities } from'../utils/screen';
import { Dungeon } from './Dungeon';
import { Screen } from './Screen';
import { HiddenEvent } from '../HiddenEvent';

class Dungeon_1 extends Dungeon {
/*             [e]
                |
   [k]-[ ]-[ ]-[b]			
        |
   [ ]-[m]-[ ]-[k]
    |   | 
   [t] [ ]-[ ]-[k]-[c]
*/
		/*
		tiles
		d - door
		c - locked door
		u - sealed door
		b - bare floor
		o - block
		w - water
		x - unwalkable
		X = walkable
		r - ladder down
		R - ladder up
		z - floor torch
		E - wall torch
		L - column
		12345678 - boss mat tiles

		enemies
		l - slime	
		k - skeleton
		a - bat
		n - snake
		g - dragon
		h - ghost
		B - blade trap (e/w)
		C - blade trap (n/s)
		Z - zora
		A - trap statue

		game objects
		O - block
		y - key
		m - compass
		M - bombs
		P - map
		c - locked door
		u - sealed door 
		q - bombable wall
		i - bombed wall	
		D - boss door
		Y - boss key
		t - potion
		Q - rupee 
		j - old woman
		e - treasure
		H - heart
	*/

	constructor() {
		// o = block
		super();

		const roomsMap = new Map();

		// underground room
		roomsMap.set('5_1', `
		**xxx***********
		**xRx***********
		**x*x***********
		**x*x*****a**a**
		**x*xxxExxxxxxxx
		**x*xxxM******Xx
		**x*xxxxxxxxx*xx
		**x*xxxxExxxx*xx
		**X***********Xx
		**xxxxxxxxxxxxxx
		****************
		`);
		roomsMap.set('5_3', `
		****************
		*******dd*******
		***********o****
		********l**o****
		****oooooooo****
		*****l********d*
		****oooo*ooo****
		****o***l*******
		****************
		****************
		****************
		`);
		// starting room
		roomsMap.set('5_4', `
		****************
		****************
		******wwww******
		*****swwwws*****
		****************
		*c***s****s***d*
		*******bb*******
		******bbbb******
		******bbbb******
		****************
		****************
		`)
		// key room
		roomsMap.set('5_5', `
		****************
		****************
		****************
		***o*k******o***
		************k***
		*d*****ky*****d*
		****************
		***o******k*o***
		****************
		****************
		****************
		`);
		// compass room
		roomsMap.set('5_6', `
		****************
		****************
		***o********o***
		************a***
		****************
		*d****o*oo******
		*******O****a***
		***o********o***
		****************
		****************
		****************
		`);
		// room with stairs
		roomsMap.set('4_1', `
		****************
		****************
		**A**********s**
		****wwwwwwww****
		****w***********
		****w*r*******d*
		****w***********
		****wwwwwwww****
		**s**********s**
		****************
		****************
		`);
		// room with bombable wall
		roomsMap.set('4_2', `
		****************
		********q*******
		**oobbbbbbbboo**
		**oobn*n**nboo**
		**bb********bb**
		*d************d*
		****************
		**wwwwwwwwwwww**
		**wwwwwwwwwwww**
		****************
		****************
		`);
		roomsMap.set('4_3', `
		****************
		****************
		**wwwwwwwwwwww**
		**wwwwwwwwwwww**
		*******Z********
		*d**********b*d*
		***********bb***
		*********bbbb***
		****************
		*******dd*******
		****************
		`);
		roomsMap.set('4_4', `
		****************
		*******dd*******
		**wwwww***l*****
		******wwwwwww***
		***ww*www*l*w***
		*d*ww***w*w*w***
		***ww*w*w*w*w***
		****l*w***w*w***
		**wwwwwwwww*****
		****************
		****************
		`);
		// hidden merchant room
		roomsMap.set('3_2', `
		****************
		****************
		**bbbbbbbbbbbb**
		**bbb******bbb**
		**bb*z*jt*z*bb**
		**bb********bb**
		**bbb******bbb**
		**bbb******bbb**
		**bbbb****bbbb**
		*******dd*******
		****************
		`);
		// key room
		roomsMap.set('3_3', `
		****************
		****************
		**wwwwwwwwwwww**
		**wwZ*******ww**
		**w**********w**
		**w****y******d*
		**w**********w**
		**ww***Z****ww**
		**wwwwwwwwwwww**
		****************
		****************
		`);
		// map room
		roomsMap.set('3_4', `
		****************
		*******dd*******
		****************
		*****w****w**k**
		***kww****ww****
		*d**wB*****w**d*
		***w**wwww*Pw***
		***wwww**wwww***
		****************
		*******dd*******
		****************
		`);
		// room with ghosts
		roomsMap.set('3_5', `
		****************
		****************
		**zoo******h****
		****o**h**ooo***
		****ooooo***o***
		*d******ooo*o***
		************o***
		****ooooooooo***
		**zooh*******h**
		*******dd*******
		****************
		`);
		// boss room
		roomsMap.set('3_6', `
		****************
		******gdd*******
		**ooob****booo**
		**oob******boo**
		**ob********bo**
		**b**********b**
		**b**********b**
		**b**********b**
		**b**********b**
		*******uu*******
		****************
		`);
		roomsMap.set('4_5', `
		****************
		*******dd*******
		**bb********bb**
		**b*k*bbbb**kb**
		*****b****b*****
		*****b*AA*b***d*
		*****b****b*****
		**bk**bbbb**kb**
		**bb****k***bb**
		****************
		****************
		`);
		// boss entrance room
		roomsMap.set('4_6', `
		****************
		*******DD*******
		**bb*L1234L*bb**
		**b**z5678z**b**
		*************H**
		*d**************
		*************H**
		**b**********b**
		**bb********bb**
		****************
		****************
		****************
		`);
		// boss key room
		roomsMap.set('2_1', `
		****************
		****************
		**boB*****C*bo**
		**bo*o*o*o**bb**
		***o*o*o*o******
		**Y**o*o*o****d*
		***o*o*o*o******
		**bo*o*o*o**bb**
		**boC******Bbo**
		****************
		****************
		****************
		`);
		roomsMap.set('2_2', `
		****************
		****************
		**wwwwwwwwwwww**
		**wwwwwwwwwwww**
		****o***Z**o****
		*d****o**o****d*
		****o***Z**o****
		**wwwwwwwwwwww**
		**wwwwwwwwwwww**
		****************
		****************
		`);
		roomsMap.set('2_3', `
		****************
		****************
		**wwwwwwwwwwww**
		**wwwwwwwwwwww**
		********Z*******
		*d************d*
		********Z*******
		**wwwwwwwwwwww**
		**wwwwwwwwwwww**
		****************
		****************
		`);
		roomsMap.set('2_4', `
		****************
		****************
		*********bbbbb**
		***k***l**bbbb**
		*********k*bbb**
		*d***l******bb**
		**********l**b**
		****************
		****************
		*******dd*******
		****************
		`);
		// end room
		roomsMap.set('2_6', `
		****************
		****************
		**bbbbssssbbbb**
		**bbbs****sbbb**
		**bbs**e***sbb**
		**b**z****z**b**
		**bb********bb**
		**bbb******bbb**
		**bbbb****bbbb**
		*******dd*******
		****************
		`);

/*
		// test room
		roomsMap.set('2_6', `
		****************
		*******DD*******
		**go*b1234LzAr**
		******5678**s***
		*****O****j*****
		*c**********ewc*
		*********PMmcw**
		**wlZaknhyHYtw**
		**wwwwwwwwwwww**
		*******cc*******
		****************
		`);
*/
		for (const room of roomsMap.entries()) {
			const rowCol = room[0].split('_');
			const row = parseInt(rowCol[0]);
			const col = parseInt(rowCol[1]);
			const map = room[1];
			const tiles = ScreenUtilities.makeTiles(map, row, col);
			const objects =
				ScreenUtilities.makeObjects(
					map, ScreenUtilities.makeObject
				);
			const doors = ScreenUtilities.makeDoorObjects(map);
			const enemies = ScreenUtilities.makeObjects(
				map, ScreenUtilities.makeEnemy
			);
			const pickups = ScreenUtilities.makeObjects(
				map, ScreenUtilities.makePickup
			);

			this.screens.set(row + '_' + col,
				new Screen(
					row, col,	
					tiles,
					[...objects, ...doors],
					enemies,
					pickups
				)
			);
		}

		this.screens.get('3_6').hasBoss = true;
		this.screens.get('5_6').hiddenEvent = new HiddenEvent(
			GameUtilities.TriggerConditionType.BLOCK_MOVED,
			GameUtilities.TriggerActionType.SPAWN_PICKUP,
			[4,6],
			GameUtilities.PickupType.COMPASS
		);
		this.screens.get('4_5').hiddenEvent = new HiddenEvent(
			GameUtilities.TriggerConditionType.ENEMIES_DEFEATED,
			GameUtilities.TriggerActionType.OPEN_DOORS,
			[0,0]
		);
		this.screens.get('4_5').isSealed = true;

		this.screens.get('2_4').hiddenEvent = new HiddenEvent(
			GameUtilities.TriggerConditionType.ENEMIES_DEFEATED,
			GameUtilities.TriggerActionType.OPEN_DOORS,
			[0,0]
		);
		this.screens.get('2_4').isSealed = true;

	}
}

export { Dungeon_1 };
