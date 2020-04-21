class Note {
	static dBFSToGain(dbfs) {
		return Math.pow(10, -(dbfs * 2) / Tone.MAX_TONE);
	}

	constructor(tick, tone, audioContext) {
		makeReadOnlyProperty(this, 'tick', tick);
		makeReadOnlyProperty(this, 'tone', tone);
		makeReadOnlyProperty(this, 'audioContext', audioContext);
		makeReadOnlyProperty(this, 'oscillatorNode', this.audioContext.createOscillator());
		makeReadOnlyProperty(this, 'gainNode', this.audioContext.createGain());

		this.oscillatorNode.frequency.value = this.tone.frequency;

		this.gainNode.gain.value = 0;

		this.oscillatorNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.oscillatorNode.start();
	}

	static fromObject(obj, tonesByFrequency, audioContext) {
		return new Note(obj.tick, tonesByFrequency[obj.frequency], audioContext);
	}

	get decibel() { return Note.dBFSToGain(this.tone.frequency); }

	toJSON() {
		return {
			tick: this.tick,
			frequency: this.tone.frequency
		};
	}

	play(type, noteCount) {
		this.gainNode.gain.cancelScheduledValues(0);
		this.oscillatorNode.type = type;
		this.gainNode.gain.setTargetAtTime(this.decibel / noteCount, this.audioContext.currentTime + 0.06, 0.06);
		this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.08, .15);
	}

	cleanAudioNodes() {
		this.gainNode.disconnect();
		this.oscillatorNode.disconnect();
		this.oscillatorNode.stop();
	}
}