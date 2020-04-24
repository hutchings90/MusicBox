class Note {
	constructor(tick, tone) {
		makeReadOnlyProperty(this, 'tick', tick);
		makeReadOnlyProperty(this, 'tone', tone);
	}

	copy() {
		return new Note(this.tick, this.tone.copy());
	}

	toJSON() {
		return {
			tick: this.tick,
			frequency: this.tone.frequency
		};
	}
}