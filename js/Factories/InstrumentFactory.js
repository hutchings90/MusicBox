class InstrumentFactory {
	static makeInstrument(name, audioContext) {
		return this[name](audioContext, {
			name: name
		});
	}

	// Prepared Instruments
	static music_box(audioContext, options) {
		return this.sine_instrument(audioContext, Object.assign({
			multiNote: true
		}, options));
	}

	// Core Instruments
	static sine_instrument(audioContext, options) {
		return new Instrument(audioContext, Object.assign({
			oscillatorType: 'sine'
		}, options));
	}

	static square_instrument(audioContext, options) {
		return new Instrument(audioContext, Object.assign({
			oscillatorType: 'square'
		}, options));
	}

	static sawtooth_instrument(audioContext, options) {
		return new Instrument(audioContext, Object.assign({
			oscillatorType: 'sawtooth'
		}, options));
	}

	static triangle_instrument(audioContext, options) {
		return new Instrument(audioContext, Object.assign({
			oscillatorType: 'triangle'
		}, options));
	}
}