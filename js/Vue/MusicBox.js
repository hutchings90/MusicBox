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
			@export-music=exportMusic
			@import-music=importMusic
			:beat=beat
			:delta-beat=deltaBeat
			:tempo=tempo
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:no-notes=noActiveNotes></music-box-controls>
		<music-box-editor
			@right-mouse-move=rightMouseMove
			:beat=beat
			:tones=tones
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
		instrumentFactory() { return new InstrumentFactory(); },
		intervalFrequency() { return 1000 / ((this.tempo * this.tempoMultiplier) / 60); },
		interval() { return this.playing ? setInterval(() => this.doBeat(this.deltaBeat), this.intervalFrequency) : null; },
		tones() { return this.audioContext ? [...Tone.TONES].reverse() : []; },
		tonesByFrequency() {
			return this.tones.reduce((reduction, tone) => {
				let frequency = tone.frequency;

				if (!reduction[frequency]) reduction[frequency] = [];

				reduction[frequency] = tone;

				return reduction;
			}, {});
		},
		notes() { return this.instruments.reduce((reduction, instrument) => reduction.concat(instrument.notes), []); },
		beatNoteCount() { return this.notes.filter(note => note.beat == this.beat).length; },
		maxBeat() { return Math.max(0, ...this.notes.map(note => note.beat)); },
		activeInstruments() { return this.instruments; },
		activeInstrument() { return this.instruments[0]; },
		noActiveNotes() { return !this.activeInstruments.find(instrument => instrument.notes.length > 0); },
		exportBlob() {
			return new Blob([ JSON.stringify({
				tempo: this.tempo,
				instruments: this.instruments
			})], {
				type: 'text/plain;charset=utf-8'
			});
		},
		exportUrl() { return URL.createObjectURL(this.exportBlob); },
		exportLink() {
			let link = document.createElement('a');

			link.download = 'temp.json';

			return link;
		},
		importInput() {
			let input = document.createElement('input');

			input.type = 'file';
			input.accept = 'application/JSON';
			input.onchange = () => this.getImportedJSON();

			return input;
		},
		fileReader() { return new FileReader(); }
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
			this.activeInstruments.forEach(instrument => instrument.playBeat(this.beat, this.beatNoteCount));
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
		exportMusic() {
			this.exportLink.href = this.exportUrl;
			this.exportLink.click();
		},
		importMusic() {
			this.importInput.click();
		},
		promptForInstrument() {
			this.promptingForInstrument = true;
			this.instruments.push(this.instrumentFactory.makeInstrument('music_box'));
		},
		getImportedJSON() {
			if (this.importInput.files.length < 1) return;

			this.stop();

			this.fileReader.onload = () => this.parseImportedJSON();

			this.fileReader.readAsText(this.importInput.files[0]);
		},
		parseImportedJSON() {
			let data = JSON.parse(this.fileReader.result);

			this.instruments = data.instruments.map(instrument => Instrument.fromObject(instrument, this.tonesByFrequency, this.audioContext));
			this.tempo = data.tempo;

			this.importInput.value = '';
		}
	}
});