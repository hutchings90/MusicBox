class Instrument {
	constructor(audioContext, options) {
		makeReadOnlyProperty(this, 'audioContext', audioContext);
		makeReadOnlyProperty(this, 'name', options.name);
		makeReadOnlyProperty(this, 'oscillatorType', options.oscillatorType || 'sine');
		makeReadOnlyProperty(this, 'multiNote', options.multiNote || false);
		makeReadOnlyProperty(this, 'canSlide', options.canSlide || false);
		makeReadOnlyProperty(this, 'canBend', options.canBend || false);
		makeReadOnlyProperty(this, 'sounders', []);
	}

	get soundersByFrequency() {
		return this.sounders.reduce((reduction, sounder) => {
			reduction[sounder.tone.frequency] = sounder;

			return reduction;
		}, {});
	}

	pauseSound() {
		this.sounders.forEach(sounder => sounder.pause());
	}

	addSounder(tone) {
		if (!this.soundersByFrequency[tone.frequency]) this.sounders.push(new Sounder(tone, this.audioContext));

		return this.soundersByFrequency[tone.frequency];
	}

	playNote(note, noteCount) {
		this.soundersByFrequency[note.tone.frequency].play(this.oscillatorType, noteCount);
	}

	cleanAudioNodes() {
		this.sounders.forEach(sounder => sounder.cleanAudioNodes());
	}

	toJSON() {
		return {
			name: this.name
		};
	}
}