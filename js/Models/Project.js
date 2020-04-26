class Project {
	constructor(options) {
		Object.assign(this, Object.assign(Project.DEFAULTS, options));

		this.settings.partsShownInEditor = [...this.parts];
	}

	static get DEFAULTS() {
		return {
			name: '',
			tempo: 90,
			ticksPerBeat: 1,
			parts: [],
			settings: {
				partsShownInEditor: []
			}
		};
	}

	killAudio() {
		this.parts.forEach(part => part.instrument.killAudio());
	}

	close() {
		this.killAudio();
	}

	copy() {
		return new Project({
			name: this.name + ' (Copy)',
			tempo: this.tempo,
			ticksPerBeat: this.ticksPerBeat,
			parts: this.parts.map(part => part.copy())
		});
	}

	clear() {
		let parts = this.parts.length > 0 ? this.parts.slice(0, 1) : Project.DEFAULTS.parts;

		this.killAudio();

		parts.forEach(part => part.clear());

		Object.assign(this, Object.assign(Project.DEFAULTS, {
			name: this.name,
			parts: parts
		}));

		this.settings.partsShownInEditor = [...parts];
	}

	addPart(audioContext) {
		let part = new Part({
			instrument: new Instrument(audioContext, Instrument.OPTIONS['Music Box'])
		});

		this.parts.push(part);
		this.settings.partsShownInEditor.push(part);
	}

	toJSON() {
		return {
			name: this.name,
			tempo: this.tempo,
			ticksPerBeat: this.ticksPerBeat,
			parts: this.parts
		};
	}
}