class Instrument {
	constructor(name, oscillatorType, multiNote) {
		makeReadOnlyProperty(this, 'multiNote', multiNote || false);
		makeReadOnlyProperty(this, 'oscillatorType', oscillatorType || 'sine');
		makeReadOnlyProperty(this, 'name', name);

		// Can't be read only because Vue loses reactivity.
		this.notes = [];
	}

	static fromObject(obj, tonesByFrequency, audioContext) {
		let instrument = new Instrument(obj.name, obj.oscillatorType, obj.multiNote);

		obj.notes.forEach(note => instrument.addNote(Note.fromObject(note, tonesByFrequency, audioContext)));

		return instrument;
	}

	get notesByBeat() {
		return this.notes.reduce((reduction, note) => {
			let beat = note.beat;

			if (!reduction[beat]) reduction[beat] = [];

			reduction[beat].push(note);

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

	getNotesForBeat(beat) {
		return this.notesByBeat[beat] || [];
	}

	hasNotesForBeat(beat) {
		return 0 < this.getNotesForBeat(beat).length;
	}

	getNotesForTone(tone) {
		return this.notesByToneFrequency[tone.frequency] || [];
	}

	addNote(note) {
		if (this.multiNote || this.hasNotesForBeat(note.beat)) this.notes.push(note);
	}

	removeNote(note) {
		this.notes.splice(this.notes.indexOf(note), 1);
	}

	playBeat(beat, beatNoteCount) {
		this.getNotesForBeat(beat).forEach(note => note.play(this.oscillatorType, beatNoteCount));
	}

	toJSON() {
		return {
			name: this.name,
			oscillatorType: this.oscillatorType,
			multiNote: this.multiNote,
			notes: this.notes
		};
	}
}