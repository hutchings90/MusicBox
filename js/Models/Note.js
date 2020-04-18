class Note {
	constructor(beat, tone) {
		this._beat = () => beat;
		this._tone = () => tone;
	}

	get beat() { return this._beat(); }
	get tone() { return this._tone(); }

	play() {
		this.tone.play();
	}

	toJSON() {
		return {
			beat: this.beat,
			tone: this.tone
		};
	}
}