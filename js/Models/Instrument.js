class Instrument {
	constructor(audioContext, type, multiNote) {
		makeReadOnlyProperty(this, 'audioContext', audioContext);
		makeReadOnlyProperty(this, 'multiNote', multiNote || false);
		makeReadOnlyProperty(this, 'oscillatorNode', this.audioContext.createOscillator());
		makeReadOnlyProperty(this, 'gainNode', this.audioContext.createGain());

		this.notes = [];

		this.oscillatorNode.frequency.value = 0;
		this.oscillatorNode.type = type || 'sine';
		this.gainNode.gain.value = 0;

		this.oscillatorNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.oscillatorNode.start();
	}

	get notesByBeat() {
		return this.notes.reduce((reduction, note) => {
			reduction[note.beat] = note;

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

	getNotesForTone(tone) {
		return this.notesByToneFrequency[tone.frequency];
	}

	playBeat(beat) {
		let note = this.notesByBeat[beat];

		if (note) this.playNote(note);
	}

	playNote(note) {
		this.stop(note);
	}

	stop(note) {
		this.gainNode.gain.cancelScheduledValues(0);
		this.gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + .04);

		setTimeout(() => {
			this.gainNode.gain.cancelScheduledValues(0);

			this.oscillatorNode.frequency.value = note.tone.frequency;

			this.gainNode.gain.setValueCurveAtTime([ Math.abs(this.gainNode.gain.value - .001) / 2, .001, .1, .5 ], this.audioContext.currentTime, 0.06);
			this.gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 1);
		}, 40);
	}

	addNote(note) {
		if (this.multiNote || !this.notesByBeat[note.beat]) this.notes.push(note);
	}

	removeNote(note) {
		this.notes = this.notes.filter(note => note != note);
	}

	toJSON() {
		return {
			instrument: this.constructor.name,
			notes: this.notes
		};
	}
}