class Instrument {
	static CUSTOM_OPTIONS = [];

	static get DEFAULT_OPTIONS() {
		return {
			name: '',
			oscillatorType: 'sine',
			multiNote: false
		};
	}

	static get STANDARD_OPTIONS() {
		let defaultOptions = Instrument.DEFAULT_OPTIONS;

		return [Object.assign(Object.assign({}, defaultOptions), {
			name: 'Music Box',
			multiNote: true
		}), Object.assign(Object.assign({}, defaultOptions), {
			name: 'Violin'
		})];
	}

	static get KEYED_STANDARD_OPTIONS() {
		return keyItemsByProp('name', Instrument.STANDARD_OPTIONS);
	}

	static get KEYED_CUSTOM_OPTIONS() {
		return keyItemsByProp('name', Instrument.CUSTOM_OPTIONS);
	}

	static get KEYED_ALL_OPTIONS() {
		return Object.assign(Instrument.KEYED_STANDARD_OPTIONS, Instrument.KEYED_CUSTOM_OPTIONS);
	}

	static addCustomInstrument(name) {
		Instrument.CUSTOM_OPTIONS.push(Object.assign(Object.assign({}, Instrument.DEFAULT_OPTIONS, {
			name: name
		})));
	}

	constructor(audioContext, options) {
		options = options || {
			name: ''
		};

		this.name = options.name;

		if (this.name && !Instrument.KEYED_ALL_OPTIONS[this.name]) Instrument.addCustomInstrument(this.name);

		makeReadOnlyProperty(this, 'audioContext', audioContext);
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