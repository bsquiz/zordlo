import { Enemy } from './Enemy';
import { GameUtilities } from '../utils/game';
import { Timer } from '../Timer';

class TrapStatue extends Enemy {
	constructor() {
		super(GameUtilities.EnemyType.TRAP_STATUE);
		this.isTrackingPlayer = true;
		this.attackTimer = new Timer(360, true);
		this.attackTimer.start();
		this.isAttacking = false;
		this.dir = 180;
		this.moves = false;
	}
	moveBehavior() {
		this.facePlayer();


	}
	update () {
		super.update();
		this.isAttacking = false;
		if (!this.attackTimer.update()) {
			this.isAttacking = true;
		}
	}
}

export { TrapStatue };
