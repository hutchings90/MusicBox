class Note {
	constructor(tick, tone) {
		makeReadOnlyProperty(this, 'tick', tick);
		makeReadOnlyProperty(this, 'tone', tone);
	}

	static fromObject(obj, tonesByFrequency) {
		return new Note(obj.tick, tonesByFrequency[obj.frequency]);
	}

	toJSON() {
		return {
			tick: this.tick,
			frequency: this.tone.frequency
		};
	}
}