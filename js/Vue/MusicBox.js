Vue.component('music-box', {
	props: [ 'stream', 'audioContext' ],
	template: `<div class='music-box'>
		<music-box-controls
			@set-tempo=setTempo
			@play=pressedPlay
			@pause=pause
			@stop=stop
			@step=step
			@fast-step=fastStep
			@go-to-beginning=goToBeginning
			@go-to-end=goToEnd
			:beat=beat
			:delta-beat=deltaBeat
			:tempo=tempo
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:no-notes=noNotes></music-box-controls>
		<music-box-editor
			@add-note=addNote
			@remove-note=removeNote
			@right-mouse-move=rightMouseMove
			:beat=beat
			:notes=notes
			:playing=playing
			:auto-progress=autoProgress
			:stream=stream
			:audio-context=audioContext></music-box-editor>
	</div>`,
	data() {
		return {
			beat: 0,
			deltaBeat: 1,
			tempo: 90,
			tempoMultiplier: 1,
			updateIntervalTempo: false,
			playing: false,
			autoProgress: false,
			notes: []
		};
	},
	computed: {
		intervalFrequency() { return 1000 / ((this.tempo * this.tempoMultiplier) / 60); },
		interval() { return this.playing ? setInterval(() => this.doBeat(this.deltaBeat), this.intervalFrequency) : null; },
		notesByBeat() {
			return this.notes.reduce((reduction, note) => {
				if (!reduction[note.beat]) reduction[note.beat] = [];

				reduction[note.beat].push(note);

				return reduction;
			}, {});
		},
		beatNotes() { return this.notesByBeat[this.beat] || []; },
		maxBeat() { return Math.max(0, ...this.notes.map(note => note.beat)); },
		noNotes() { return this.notes.length < 1; }
	},
	watch: {
		tempo() {
			this.updateIntervalTempo = true;
		},
		tempoMultiplier() {
			this.updateIntervalTempo = true;
		},
		interval(newInterval, oldInterval) {
			if (oldInterval) clearInterval(oldInterval);
		},
		beat() {
			if (this.playing) this.playBeat();
		},
		playing() {
			if (this.playing) this.playBeat();
		},
		maxBeat() {
			if (this.maxBeat < 1) this.stop();
		}
	},
	methods: {
		setTempo(tempo) {
			this.tempo = tempo;
		},
		pressedPlay() {
			this.deltaBeat = 1;
			this.tempoMultiplier = 1;
			this.play();
		},
		play() {
			this.playing = true;
			this.autoProgress = true;
		},
		playBeat() {
			this.beatNotes.forEach(note => note.play());
		},
		pause() {
			this.playing = false;
		},
		stop() {
			this.pause();
			this.beat = 0;
			this.deltaBeat = 1;
			this.tempoMultiplier = 1;
		},
		doBeat(deltaBeat) {
			let newBeat = this.beat + deltaBeat;

			if (newBeat > this.maxBeat) newBeat = 0;
			else if (newBeat < 0) {
				newBeat = 0;
				this.deltaBeat = 1;
				this.tempoMultiplier = 1;
				this.pause();
			}

			this.beat = newBeat;
		},
		step(deltaBeat) {
			this.pause();
			this.goToBeat(this.beat + deltaBeat);
			this.playBeat();
		},
		fastStep(deltaBeat, tempoMultiplier) {
			if (this.beat == 0 && deltaBeat < 0) return;

			if (this.deltaBeat != deltaBeat) {
				this.deltaBeat = deltaBeat;
				this.tempoMultiplier = 8;
			}

			this.tempoMultiplier = Math.max(1, (this.tempoMultiplier * 2) % 16);

			if (!this.playing) this.play();
		},
		goToBeginning() {
			this.goToBeat(0);
		},
		goToEnd() {
			this.goToBeat(this.maxBeat);
		},
		goToBeat(beat) {
			this.autoProgress = true;
			this.beat = beat;
		},
		addNote(note) {
			this.notes.push(note);
		},
		removeNote(noteToRemove) {
			this.notes = this.notes.filter(note => note != noteToRemove);
		},
		rightMouseMove() {
			this.autoProgress = false;
		},
		exportNotes() {
			let link = document.createElement('a');

			link.download = 'temp.json';
			link.href = URL.createObjectURL(new Blob([ JSON.stringify(this.notes) ], {
				type: 'text/plain;charset=utf-8'
			}));

			link.click();
		}
	}
});