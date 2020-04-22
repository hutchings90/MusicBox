class Part {
	constructor(instrumentName, audioContext) {
		makeReadOnlyProperty(this, 'instrument', InstrumentFactory.makeInstrument(instrumentName, audioContext));

		// Can't be read only because Vue loses reactivity.
		this.notes = [];
	}

	static fromObject(obj, tonesByFrequency, audioContext) {
		let part = new Part(obj.instrument.name, audioContext);

		obj.notes.forEach(note => part.addNote(Note.fromObject(note, tonesByFrequency)));

		return part;
	}

	get notesByTick() {
		return this.notes.reduce((reduction, note) => {
			let tick = note.tick;

			if (!reduction[tick]) reduction[tick] = [];

			reduction[tick].push(note);

			return reduction;
		}, {});
	}

	get notesByToneFrequency() {
		return this.notes.reduce((reduction, note) => {
			let frequency = note.tone.frequency;

			if (!reduction[frequency]) reduction[frequency] = [];

			reduction[frequency].push(note);

			return reduction;
		}, {});
	}

	getNotesForTick(tick) {
		return this.notesByTick[tick] || [];
	}

	hasNotesForTick(tick) {
		return 0 < this.getNotesForTick(tick).length;
	}

	getNotesForTone(tone) {
		return this.notesByToneFrequency[tone.frequency] || [];
	}

	addNote(note) {
		if (this.instrument.multiNote || !this.hasNotesForTick(note.tick)) {
			this.notes.push(note);
			this.instrument.addSounder(note.tone);
		}
	}

	removeNote(note) {
		this.notes.splice(this.notes.indexOf(note), 1);
	}

	playTick(tick, noteCount) {
		this.getNotesForTick(tick).forEach(note => this.instrument.playNote(note, noteCount));
	}

	toJSON() {
		return {
			notes: this.notes,
			instrument: this.instrument
		};
	}
}