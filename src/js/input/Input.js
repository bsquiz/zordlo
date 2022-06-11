import { Gamepad } from './Gamepad';
import { Keyboard } from './Keyboard';

const Input = {
	Mode: {
		KEYBOARD: 0,
		GAMEPAD: 1
	},
	mode: 0,
	InputCode: {
		UP: 0,
		RIGHT: 1,
		DOWN: 2,
		LEFT: 3,
		A: 4,
		B: 5,
		X: 6,
		Y: 7
	},
	keyboard: {},
	gamepad: {},
	$debugButtons: document.getElementById('debugButtons'),
		getInputState(input, state) {
		let inputActive = false;

		if (this.mode === this.Mode.KEYBOARD) {
			inputActive = this.keyboard[state].get(
				this.keyboard.InputCodeToKeyCode[input]
			);
		} else {
			this.gamepad.update();
			inputActive = this.gamepad[state].get(
				this.gamepad.InputCodeToButtonCode[input]
			);
		}

		return inputActive;

	},
	reset() {
		this.keyboard.reset();
		this.gamepad.reset();
	},
	getInputActive(input) {
		return this.getInputState(input, 'inputsActive');
	},
 	getInputReleased(input) {
		return this.getInputState(input, 'inputsReleased');
	},
	debug() {
		this.$a.innerHTML = this.getInputActive(this.InputCode.A);
		this.$b.innerHTML = this.getInputActive(this.InputCode.B);
		this.$up.innerHTML = this.getInputActive(this.InputCode.UP);
		this.$down.innerHTML = this.getInputActive(this.InputCode.DOWN);
		this.$left.innerHTML = this.getInputActive(this.InputCode.LEFT);
		this.$right.innerHTML = this.getInputActive(this.InputCode.RIGHT);
	},
	init() {
	this.$a = this.$debugButtons.getElementsByClassName('a-button')[0];
	this.$b= this.$debugButtons.getElementsByClassName('b-button')[0];
	this.$up= this.$debugButtons.getElementsByClassName('up-button')[0];
	this.$down= this.$debugButtons.getElementsByClassName('down-button')[0];
	this.$left= this.$debugButtons.getElementsByClassName('left-button')[0];
	this.$right= this.$debugButtons.getElementsByClassName('right-button')[0];

		this.keyboard = new Keyboard();
		this.gamepad = new Gamepad();

		this.keyboard.init(this.InputCode);
		this.gamepad.init(this.InputCode);
	}
};

export { Input };
