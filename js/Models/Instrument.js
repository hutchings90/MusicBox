class Instrument {
	constructor(name, oscillatorType, multiNote) {
		makeReadOnlyProperty(this, 'multiNote', multiNote || false);
		makeReadOnlyProperty(this, 'oscillatorType', oscillatorType || 'sine');
		makeReadOnlyProperty(this, 'name', name);
	}

	toJSON() {
		return {
			name: this.name
		};
	}
}