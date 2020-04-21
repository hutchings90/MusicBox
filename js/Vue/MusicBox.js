Vue.component('music-box', {
	props: {
		audioContext: {
			type: AudioContext,
			required: true
		}
	},
	template: `<div class='music-box'>
		<music-box-controls
			@set-tempo=setTempo
			@set-ticks-per-beat=setTicksPerBeat
			@play=pressedPlay
			@pause=pause
			@stop=stop
			@step=step
			@fast-step=fastStep
			@go-to-beginning=goToBeginning
			@go-to-end=goToEnd
			@export-music=exportMusic
			@import-music=importMusic
			:tick=tick
			:delta-tick=deltaTick
			:tempo=tempo
			:ticks-per-beat=ticksPerBeat
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:no-notes=noActiveNotes></music-box-controls>
		<music-box-editor
			@right-mouse-move=rightMouseMove
			:tick=tick
			:tones=tones
			:parts=activeParts
			:playing=playing
			:auto-progress=autoProgress
			:audio-context=audioContext></music-box-editor>
	</div>`,
	created() {
		this.promptForInstrument();
	},
	data() {
		return {
			tick: 0,
			deltaTick: 1,
			tempo: 90,
			ticksPerBeat: 1,
			tempoMultiplier: 1,
			updateIntervalFrequency: false,
			playing: false,
			autoProgress: false,
			parts: [],
			hasBegun: false,
			promptingForInstrument: false
		};
	},
	computed: {
		intervalFrequency() { return 1 / (this.tempoMultiplier * this.tempo * this.ticksPerBeat / 60000); },
		interval() { return this.playing ? setInterval(() => this.doTick(this.deltaTick), this.intervalFrequency) : null; },
		tones() { return this.audioContext ? [...Tone.TONES].reverse() : []; },
		tonesByFrequency() {
			return this.tones.reduce((reduction, tone) => {
				let frequency = tone.frequency;

				if (!reduction[frequency]) reduction[frequency] = [];

				reduction[frequency] = tone;

				return reduction;
			}, {});
		},
		notes() { return this.parts.reduce((reduction, part) => reduction.concat(part.notes), []); },
		tickNoteCount() { return this.notes.filter(note => note.tick == this.tick).length; },
		maxTick() { return Math.max(0, ...this.notes.map(note => note.tick)); },
		activeParts() { return this.parts; },
		activePart() { return this.parts[0]; },
		noActiveNotes() { return !this.activeParts.find(part => part.notes.length > 0); },
		exportBlob() {
			return new Blob([ JSON.stringify({
				tempo: this.tempo,
				ticksPerBeat: this.ticksPerBeat,
				parts: this.parts
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
		importElement() {
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
			this.updateIntervalFrequency = true;
		},
		ticksPerBeat() {
			this.updateIntervalFrequency = true;
		},
		tempoMultiplier() {
			this.updateIntervalFrequency = true;
		},
		interval(newInterval, oldInterval) {
			if (oldInterval) clearInterval(oldInterval);
		},
		tick() {
			if (this.playing) this.playTick();
		},
		playing() {
			if (this.playing) this.playTick();
		},
		maxTick() {
			if (this.maxTick < 1) this.stop();
		},
		notes() {
			this.autoProgress = false;
		}
	},
	methods: {
		setTempo(tempo) {
			this.tempo = Number(tempo);
		},
		setTicksPerBeat(ticksPerBeat) {
			this.ticksPerBeat = Number(ticksPerBeat);
		},
		pressedPlay() {
			this.deltaTick = 1;
			this.tempoMultiplier = 1;
			this.play();
		},
		play() {
			this.playing = true;
			this.autoProgress = true;
		},
		playTick() {
			this.activeParts.forEach(instrument => instrument.playTick(this.tick, this.tickNoteCount));
		},
		pause() {
			this.playing = false;
		},
		stop() {
			this.pause();
			this.tick = 0;
			this.deltaTick = 1;
			this.tempoMultiplier = 1;
		},
		doTick(deltaTick) {
			let newTick = this.tick + deltaTick;

			if (newTick > this.maxTick) newTick = 0;
			else if (newTick < 0) {
				newTick = 0;
				this.deltaTick = 1;
				this.tempoMultiplier = 1;
				this.pause();
			}

			this.tick = newTick;
		},
		step(deltaTick) {
			this.pause();
			this.goToTick(this.tick + deltaTick);
			this.playTick();
		},
		fastStep(deltaTick, tempoMultiplier) {
			if (this.tick == 0 && deltaTick < 0) return;

			if (this.deltaTick != deltaTick) {
				this.deltaTick = deltaTick;
				this.tempoMultiplier = 8;
			}

			this.tempoMultiplier = Math.max(1, (this.tempoMultiplier * 2) % 16);

			if (!this.playing) this.play();
		},
		goToBeginning() {
			this.goToTick(0);
		},
		goToEnd() {
			this.goToTick(this.maxTick);
		},
		goToTick(tick) {
			this.autoProgress = true;
			this.tick = tick;
		},
		cleanAudioNodes() {
			this.parts.forEach(part => part.notes.forEach(note => note.cleanAudioNodes()));
		},
		rightMouseMove() {
			this.autoProgress = false;
		},
		exportMusic() {
			this.exportLink.href = this.exportUrl;
			this.exportLink.click();
		},
		importMusic() {
			this.importElement.click();
		},
		promptForInstrument() {
			this.promptingForInstrument = true;
			this.parts.push(new Part('music_box'));
		},
		getImportedJSON() {
			if (this.importElement.files.length < 1) return;

			this.stop();
			this.cleanAudioNodes();

			this.fileReader.onload = () => this.parseImportedJSON();

			this.fileReader.readAsText(this.importElement.files[0]);
		},
		parseImportedJSON() {
			let data = JSON.parse(this.fileReader.result);

			this.parts = data.parts.map(part => Part.fromObject(part, this.tonesByFrequency, this.audioContext));
			this.tempo = Number(data.tempo);
			this.ticksPerBeat = Number(data.ticksPerBeat);

			this.importElement.value = '';
		}
	}
});