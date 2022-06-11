const audio = {
	soundsUrlHash: {},
	sounds: {},
	load() {
		const soundKeys = Object.keys(this.soundsUrlHash);

		soundKeys.forEach(key => {
			const $el = document.createElement('audio');
			const label = key.split('_SOUND')[0];
			this.sounds[label] = $el;
			$el.onload = function() {
				console.log(key + ' loaded');
			};
			$el.canplaythrough = function() {
				console.log('error');
			};
			$el.src = this.soundsUrlHash[key];
		});	
	},
	playSound(sound) {
		sound.play();
	},
	init(soundsUrlHash) {
		this.soundsUrlHash = soundsUrlHash;
	}
}

export { audio };
