class Part {
	constructor(instrumentName, audioContext, notes) {
		this.instrument = InstrumentFactory.makeInstrument(instrumentName || Part.DEFAULT_INSTRUMENT_NAME, audioContext);
		this.notes = notes || [];
	}

	static fromObject(obj, tonesByFrequency, audioContext) {
		let part = new Part(obj.instrument.name, audioContext);

		obj.notes.forEach(note => part.addNote(Note.fromObject(note, tonesByFrequency)));

		return part;
	}

	static get DEFAULT_INSTRUMENT_NAME() { return 'music_box'; }

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

	copy() {
		return new Part(this.instrument.name, this.instrument.audioContext, this.notes.map(note => note.copy()));
	}

	clear() {
		this.instrument.killAudio();

		this.instrument = InstrumentFactory.makeInstrument(Part.DEFAULT_INSTRUMENT_NAME, this.instrument.audioContext);
		this.notes = [];
	}

	toJSON() {
		return {
			notes: this.notes,
			instrument: this.instrument
		};
	}
}