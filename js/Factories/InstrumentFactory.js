class InstrumentFactory {
	static makeInstrument(name) {
		return this[name](name);
	}

	// Prepared Instruments
	static music_box(name) {
		return this.sine_instrument(name, true);
	}

	// Core Instruments
	static sine_instrument(name, multiNote) {
		return new Instrument(name, 'sine', multiNote);
	}

	static square_instrument(name, multiNote) {
		return new Instrument(name, 'square', multiNote);
	}

	static sawtooth_instrument(name, multiNote) {
		return new Instrument(name, 'sawtooth', multiNote);
	}

	static triangle_instrument(name, multiNote) {
		return new Instrument(name, 'triangle', multiNote);
	}
}