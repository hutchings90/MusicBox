Vue.component('music-box', {
	props: {
		projects: {
			type: Array,
			default: []
		},
		activeProject: {
			type: Project
		},
		tones: {
			type: Array,
			required: true
		},
		hasModals: {
			type: Boolean,
			default: false
		},
		toneSetOptions: {
			type: Array,
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
			@open-project-modal=openProjectModal
			@activate-part=activatePart
			@select-tone-set=selectToneSet
			:tick=tick
			:delta-tick=deltaTick
			:tempo=tempo
			:ticks-per-beat=ticksPerBeat
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:no-notes=noActiveNotes
			:disabled=!activeProject
			:tone-set-options=toneSetOptions></music-box-controls>

		<music-box-editor
			@x-axis-scroll=xAxisScroll
			@right-mouse-move=rightMouseMove
			@add-project=addProject
			@import-project=importProject
			@activate-project=activateProject
			@activate-part=activatePart
			@add-part=addPart
			@close-project=closeProject
			@export-project=exportProject
			:tick=tick
			:tones=tones
			:playing=playing
			:projects=projects
			:active-project=activeProject
			:parts=activeParts
			:active-part=activePart
			:active-note=activeNote
			:max-tick=maxTick
			:auto-progress=autoProgress
			:has-modals=hasModals></music-box-editor>

		<commander
			:part=activePart
			:tick=tick></commander>
	</div>`,
	created() {
		window.addEventListener('keypress', ev => this.keypressHandler(ev));
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
			activePart: null,
			activeNote: null,
			sidebarHidden: false
		};
	},
	computed: {
		tempo() { return this.activeProject ? this.activeProject.tempo : null; },
		ticksPerBeat() { return this.activeProject ? this.activeProject.ticksPerBeat : null; },
		intervalFrequency() { return 60000 / (this.tempoMultiplier * this.activeProject.tempo * this.activeProject.ticksPerBeat); },
		interval() { return this.playing ? setInterval(() => this.doTick(this.deltaTick), this.intervalFrequency) : null; },
		activeParts() { return this.activeProject ? this.activeProject.settings.partsShownInEditor : []; },
		activeNotes() { return this.activeProject ? this.activeParts.reduce((reduction, part) => reduction.concat(part.notes), []) : []; },
		tickNoteCount() { return this.activeNotes.filter(note => note.tick == this.tick).length; },
		maxTick() { return Math.max(0, ...this.activeNotes.map(note => note.tick)); },
		hasActiveNotes() { return this.activeNotes.length > 0; },
		noActiveNotes() { return !this.hasActiveNotes; }
	},
	watch: {
		activeProject(newProject, oldProject) {
			this.stop();
			this.activatePart(null);
		},
		'activeProject.tempo'() {
			this.updateIntervalFrequency = true;
		},
		'activeProject.ticksPerBeat'() {
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
		}
	},
	methods: {
		setTempo(tempo) {
			this.activeProject.tempo = Number(tempo);
		},
		setTicksPerBeat(ticksPerBeat) {
			this.activeProject.ticksPerBeat = Number(ticksPerBeat);
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
			if (this.activeProject) this.activeProject.pause();
		},
		xAxisScroll() {
			this.autoProgress = false;
		},
		rightMouseMove() {
			this.autoProgress = false;
		},
		openProjectModal() {
			this.$emit('open-project-modal');
		},
		activateProject(project) {
			this.$emit('activate-project', project);
		},
		activatePart(part) {
			this.activePart = part || null;
		},
		activateNote(note) {
			this.activeNote = note;
		},
		keypressHandler(ev) {
			if (this.hasModals || !ev.target.closest('.music-box-editor-scroller')) return;

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
		},
		toggleSidebar() {
			this.sidebarHidden = !this.sidebarHidden;
		},
		addProject() {
			this.$emit('add-project');
		},
		importProject() {
			this.$emit('import-project');
		},
		addPart(project) {
			this.$emit('add-part', project);
			this.activatePart(project.parts[project.parts.length - 1]);
		},
		closeProject(project) {
			this.$emit('close-project', project);
		},
		exportProject(project) {
			this.$emit('export-project', project);
		},
		selectToneSet(toneSet) {
			this.$emit('select-tone-set', toneSet);
		}
	}
});