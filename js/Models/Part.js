class Part {
	constructor(options) {
		Object.assign(this, Object.assign({
			name: '',
			notes: [],
			instrument: null
		}), options);

		this.notes.forEach(note => this.instrument.addSounder(note.tone));
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

	copy() {
		return new Part({
			name: this.name,
			notes: this.notes.map(note => note.copy()),
			instrument: this.instrument.copy()
		});
	}

	clear() {
		this.notes = [];
		this.setInstrument('Music Box');
	}

	setInstrument(name) {
		if (this.instrument && name == this.instrument.name) return;

		this.instrument.killAudio();
		this.instrument = new Instrument(this.instrument.audioContext, Instrument.KEYED_ALL_OPTIONS[name]);
		this.notes.forEach(note => this.instrument.addSounder(note.tone));
	}

	toJSON() {
		return {
			name: this.name,
			notes: this.notes,
			instrument: this.instrument
		};
	}
}