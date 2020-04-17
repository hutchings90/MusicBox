class Tone {
	constructor(audioContext, names, frequency, type) {
		let oscillator = audioContext.createOscillator();
		let gain = audioContext.createGain();

		oscillator.frequency.value = frequency;
		gain.gain.value = 0;

		oscillator.connect(gain);
		gain.connect(audioContext.destination);
		oscillator.start();

		this.type = this.type || 'sine';

		this._names = () => [...names];
		this._frequency = () => oscillator.frequency.value;
		this.play = () => {
			gain.gain.cancelScheduledValues(0);

			gain.gain.value = 0.00001;
			gain.gain.setValueCurveAtTime([ .001, .01, .6, 0.8, 0.9, 1.0 ], audioContext.currentTime, 0.06);
			oscillator.type = this.type;
			gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
		};

		this.stop = () => gain.gain.cancelScheduledValues(0);
	}

	get names() { return this._names(); }
	get namesDisplay() { return this.names.join('/'); }
	get frequency() { return this._frequency(); }
}