class Part {
	constructor(instrumentName) {
		makeReadOnlyProperty(this, 'instrument', InstrumentFactory.makeInstrument(instrumentName));

		// Can't be read only because Vue loses reactivity.
		this.notes = [];
	}

	static fromObject(obj, tonesByFrequency, audioContext) {
		let part = new Part(obj.instrument.name);

		obj.notes.forEach(note => part.addNote(Note.fromObject(note, tonesByFrequency, audioContext)));

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
		if (this.instrument.multiNote || !this.hasNotesForTick(note.tick)) this.notes.push(note);
	}

	removeNote(note) {
		this.notes.splice(this.notes.indexOf(note), 1);
	}

	playTick(tick, tickNoteCount) {
		this.getNotesForTick(tick).forEach(note => note.play(this.instrument.oscillatorType, tickNoteCount));
	}

	toJSON() {
		return {
			notes: this.notes,
			instrument: this.instrument
		};
	}
}