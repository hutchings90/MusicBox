class Instrument {
	static get OPTIONS() {
		return [{
			name: 'Music Box',
			oscillatorType: 'sine',
			multiNote: true
		}].reduce((reduction, options) => {
			reduction[options.name] = options;
			return reduction;
		}, {});
	}

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

	pause() {
		this.sounders.forEach(sounder => sounder.pause());
	}

	addSounder(tone) {
		if (!this.soundersByFrequency[tone.frequency]) this.sounders.push(new Sounder(tone, this.audioContext));

		return this.soundersByFrequency[tone.frequency];
	}

	playNote(note, noteCount) {
		this.soundersByFrequency[note.tone.frequency].play(this.oscillatorType, noteCount);
	}

	killAudio() {
		this.sounders.forEach(sounder => sounder.killAudio());
	}

	copy() {
		return new Instrument(this.audioContext, Object.assign(Object.assign({}, this), {
			sounders: this.sounders.map(sounder => sounder.copy())
		}));
	}

	toJSON() {
		return {
			name: this.name
		};
	}
}