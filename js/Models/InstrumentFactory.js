class InstrumentFactory {
	constructor() {}

	makeInstrument(name) {
		return this[name](name);
	}

	// Prepared Instruments
	music_box(name) {
		return this.sine_instrument(name, true);
	}

	// Core Instruments
	sine_instrument(name, multiNote) {
		return new Instrument(name, 'sine', multiNote);
	}

	square_instrument(name, multiNote) {
		return new Instrument(name, 'square', multiNote);
	}

	sawtooth_instrument(name, multiNote) {
		return new Instrument(name, 'sawtooth', multiNote);
	}

	triangle_instrument(name, multiNote) {
		return new Instrument(name, 'triangle', multiNote);
	}
}