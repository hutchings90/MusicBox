class Project {
	constructor(options) {
		options = options || {};
		let parts = options.parts || [];

		makeReadOnlyProperty(this, '_parts', () => parts);

		this.name = options.name || 'Unnamed Project';
		this.tempo = options.tempo || 90;
		this.ticksPerBeat = options.ticksPerBeat || 1;
	}

	get parts() { return this._parts(); }

	killAudio() {
		this.parts.forEach(part => part.instrument.killAudio());
	}

	toJSON() {
		return {
			name: this.name,
			tempo: this.tempo,
			ticksPerBeat: this.ticksPerBeat,
			parts: this.parts
		};
	}
}