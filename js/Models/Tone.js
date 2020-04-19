class Tone {
	constructor(names, frequency) {
		let _names = [...names];

		makeReadOnlyProperty(this, '_names', () => [..._names]);
		makeReadOnlyProperty(this, 'frequency', frequency);
	}

	get names() { return this._names(); }
	get namesDisplay() { return this.names.join('/'); }
}