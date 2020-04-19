Vue.component('music-box', {
	props: [ 'audioContext' ],
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
			:no-notes=noActiveNotes></music-box-controls>
		<music-box-editor
			@right-mouse-move=rightMouseMove
			:beat=beat
			:instruments=activeInstruments
			:playing=playing
			:auto-progress=autoProgress
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
			instruments: [],
			promptingForInstrument: false
		};
	},
	computed: {
		intervalFrequency() { return 1000 / ((this.tempo * this.tempoMultiplier) / 60); },
		interval() { return this.playing ? setInterval(() => this.doBeat(this.deltaBeat), this.intervalFrequency) : null; },
		notes() { return this.instruments.reduce((reduction, instrument) => reduction.concat(instrument.notes), []); },
		maxBeat() { return Math.max(0, ...this.notes.map(note => note.beat)); },
		activeInstruments() { return this.instruments; },
		activeInstrument() { return this.instruments[0]; },
		noActiveNotes() { return !this.activeInstruments.find(instrument => instrument.notes.length > 0); }
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
		},
		notes() {
			this.autoProgress = false;
		},
		audioContext() {
			this.promptForInstrument();
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
			this.activeInstruments.forEach(instrument => instrument.playBeat(this.beat));
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
		rightMouseMove() {
			this.autoProgress = false;
		},
		exportNotes() {
			let link = document.createElement('a');

			link.download = 'temp.json';
			link.href = URL.createObjectURL(new Blob([ JSON.stringify(this.instruments) ], {
				type: 'text/plain;charset=utf-8'
			}));

			link.click();
		},
		promptForInstrument() {
			this.promptingForInstrument = true;
			this.instruments.push(new SineInstrument(this.audioContext));
		}
	}
});