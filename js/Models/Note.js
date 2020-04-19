class Note {
	constructor(beat, tone) {
		makeReadOnlyProperty(this, 'beat', beat);
		makeReadOnlyProperty(this, 'tone', tone);
	}

	static fromJSON(json, tonesByFrequency) {
		let obj = JSON.parse(json);

		return new Note(obj.beat, tonesByFrequency[obj.frequency]);
	}

	toJSON() {
		return {
			beat: this.beat,
			frequency: this.tone.frequency
		};
	}
}