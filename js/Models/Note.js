class Note {
	static dBFSToGain(dbfs) {
		return Math.pow(10, -(dbfs * 2) / Tone.MAX_TONE);
	}

	constructor(beat, tone, audioContext) {
		makeReadOnlyProperty(this, 'beat', beat);
		makeReadOnlyProperty(this, 'tone', tone);
		makeReadOnlyProperty(this, 'audioContext', audioContext);
		makeReadOnlyProperty(this, 'oscillatorNode', this.audioContext.createOscillator());
		makeReadOnlyProperty(this, 'gainNode', this.audioContext.createGain());

		this.oscillatorNode.frequency.value = this.tone.frequency;

		this.gainNode.gain.value = 0;

		this.oscillatorNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.oscillatorNode.start();

		if (this.tone.frequency < 20) setInterval(() => console.log(this.gainNode.gain.value));
	}

	static fromJSON(json, tonesByFrequency) {
		let obj = JSON.parse(json);

		return new Note(obj.beat, tonesByFrequency[obj.frequency]);
	}

	get decibel() { return Note.dBFSToGain(this.tone.frequency); }

	toJSON() {
		return {
			beat: this.beat,
			frequency: this.tone.frequency
		};
	}

	play(type, noteCount) {
		this.gainNode.gain.cancelScheduledValues(0);
		this.oscillatorNode.type = type;
		this.gainNode.gain.setTargetAtTime(this.decibel / (noteCount / 2), this.audioContext.currentTime + 0.06, 0.06);
		this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.08, .15);
	}
}