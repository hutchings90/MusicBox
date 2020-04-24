class Project {
	constructor(options) {
		Object.assign(this, Object.assign(Project.DEFAULTS, options));
	}

	static get DEFAULTS() {
		return {
			name: 'Unnamed Project',
			tempo: 90,
			ticksPerBeat: 1,
			parts: []
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
		let parts = this.parts.length > 0 ? [ this.parts[0] ] : Project.DEFAULTS;

		this.killAudio();

		parts.forEach(part => part.clear());

		Object.assign(this, Object.assign(Project.DEFAULTS, {
			name: this.name,
			parts: parts
		}));
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