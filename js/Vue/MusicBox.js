Vue.component('music-box', {
	props: {
		project: {
			type: Project
		},
		tones: {
			type: Array,
			required: true
		},
		audioContext: {
			type: AudioContext,
			required: true
		},
		hasModals: {
			type: Boolean,
			default: false
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
			@open-project-modal=openProjectModal
			@update-active-part=updateActivePart
			:tick=tick
			:delta-tick=deltaTick
			:tempo=tempo
			:ticks-per-beat=ticksPerBeat
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:parts=activeParts
			:active-part=activePart
			:no-notes=noActiveNotes
			:disabled=!project></music-box-controls>
		<music-box-editor
			v-if=project
			@x-axis-scroll=xAxisScroll
			@right-mouse-move=rightMouseMove
			:tick=tick
			:tones=tones
			:playing=playing
			:parts=activeParts
			:active-part=activePart
			:max-tick=maxTick
			:auto-progress=autoProgress
			:has-modals=hasModals></music-box-editor>
		<commander
			:part=activePart
			:tick=tick></commander>
	</div>`,
	created() {
		window.addEventListener('keypress', ev => this.onkeypressHandler(ev));
		this.activePart = this.activeParts[0];
	},
	data() {
		return {
			tick: 0,
			deltaTick: 1,
			tempoMultiplier: 1,
			updateIntervalFrequency: false,
			playing: false,
			autoProgress: false,
			hasBegun: false,
			promptingForInstrument: false,
			activePart: null
		};
	},
	computed: {
		tempo() { return this.project ? this.project.tempo : null; },
		ticksPerBeat() { return this.project ? this.project.ticksPerBeat : null; },
		intervalFrequency() { return 60000 / (this.tempoMultiplier * this.project.tempo * this.project.ticksPerBeat); },
		interval() { return this.playing ? setInterval(() => this.doTick(this.deltaTick), this.intervalFrequency) : null; },
		activeParts() { return this.project.settings.partsShownInEditor; },
		activeNotes() { return this.project ? this.activeParts.reduce((reduction, part) => reduction.concat(part.notes), []) : []; },
		tickNoteCount() { return this.activeNotes.filter(note => note.tick == this.tick).length; },
		maxTick() { return Math.max(0, ...this.activeNotes.map(note => note.tick)); },
		hasActiveNotes() { return this.activeNotes.length > 0; },
		noActiveNotes() { return !this.hasActiveNotes; }
	},
	watch: {
		project(newProject, oldProject) {
			this.stop();

			if (oldProject) oldProject.killAudio();
		},
		'project.tempo'() {
			this.updateIntervalFrequency = true;
		},
		'project.ticksPerBeat'() {
			this.updateIntervalFrequency = true;
		},
		tempoMultiplier() {
			this.updateIntervalFrequency = true;
		},
		interval(newInterval, oldInterval) {
			if (oldInterval) clearInterval(oldInterval);
		},
		tick() {
			if (this.tick < 0) this.tick = this.maxTick;
			else if (this.tick > this.maxTick) this.tick = 0;
			else if (this.playing) this.playTick();
		},
		playing() {
			if (this.playing) this.playTick();
			else this.pauseAudioNodes();
		},
		maxTick() {
			if (this.maxTick < 1) this.stop();
		},
		notes() {
			this.autoProgress = false;
		},
		activeParts() {
			if (!this.activeParts.some(part => part == this.activePart)) this.activePart = null;
		}
	},
	methods: {
		setTempo(tempo) {
			this.project.tempo = Number(tempo);
		},
		setTicksPerBeat(ticksPerBeat) {
			this.project.ticksPerBeat = Number(ticksPerBeat);
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
			this.activeParts.forEach(part => part.playTick(this.tick, this.tickNoteCount));
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
			if (this.noActiveNotes) return;

			this.pause();
			this.goToTick(this.tick + deltaTick);
			this.playTick();
		},
		fastStep(deltaTick, tempoMultiplier) {
			if ((this.tick == 0 && deltaTick < 0) || this.noActiveNotes) return;

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
		pauseAudioNodes() {
			if (this.project) this.project.parts.forEach(part => part.instrument.pause());
		},
		xAxisScroll() {
			this.autoProgress = false;
		},
		rightMouseMove() {
			this.autoProgress = false;
		},
		exportMusic() {
			this.$emit('export-music');
		},
		importMusic() {
			this.$emit('import-music');
		},
		openProjectModal() {
			this.$emit('open-project-modal');
		},
		updateActivePart(part) {
			this.activePart = part;
		},
		onkeypressHandler(ev) {
			if (this.hasModals) return;

			switch (ev.keyCode) {
			case 106: this.step(-1); break; // 'J' key steps one step forward
			case 108: this.step(1); break; // 'L' key steps one step backward
			case 107: // 'K' key plays/pauses
				if (this.playing) this.pause();
				else if(this.hasActiveNotes) this.pressedPlay();
				break;
			default: return; // Return to avoid calls to preventDefault and stopPropagation.
			}

			ev.preventDefault();
			ev.stopPropagation();
		}
	}
});