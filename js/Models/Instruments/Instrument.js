class Instrument {
	constructor(type, multiNote) {
		makeReadOnlyProperty(this, 'multiNote', multiNote || false);
		makeReadOnlyProperty(this, 'type', type || 'sine');

		this.notes = [];
	}

	get notesByBeat() {
		return this.notes.reduce((reduction, note) => {
			if (!reduction[note.beat]) reduction[note.beat] = [];

			reduction[note.beat].push(note);

			return reduction;
		}, {});
	}

	get notesByToneFrequency() {
		return this.notes.reduce((reduction, note) => {
			if (!reduction[note.tone.frequency]) reduction[note.tone.frequency] = [];

			reduction[note.tone.frequency].push(note);

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

	removeNote(noteToRemove) {
		this.notes = this.notes.filter(note => note != noteToRemove);
	}

	toJSON() {
		return {
			instrument: this.constructor.name,
			notes: this.notes
		};
	}
}