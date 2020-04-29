Vue.component('music-box-controls', {
	props: {
		tick: {
			type: Number,
			required: true
		},
		deltaTick: {
			type: Number,
			required: true
		},
		tempo: {
			type: Number
		},
		ticksPerBeat: {
			type: Number
		},
		tempoMultiplier: {
			type: Number,
			required: true
		},
		playing: {
			type: Boolean,
			required: true
		},
		parts: {
			type: Array,
			default: () => []
		},
		activePart: {
			type: Part
		},
		noNotes: {
			type: Boolean,
			required: true
		},
		disabled: {
			type: Boolean
		}
	},
	template: `<div class='music-box-controls'>
		<music-box-tempo-controls
			@set-tempo=setTempo
			@set-ticks-per-beat=setTicksPerBeat
			:tempo=tempo
			:ticks-per-beat=ticksPerBeat
			:disabled=disabled></music-box-tempo-controls>

		<music-box-player-controls
			@play=play
			@pause=pause
			@stop=stop
			@step=step
			@fast-step=fastStep
			@go-to-beginning=goToBeginning
			@go-to-end=goToEnd
			:tick=tick
			:delta-tick=deltaTick
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:no-notes=noNotes></music-box-player-controls>

		<div>
			<select v-model=activePartIndex :disabled=noParts>
				<option v-if=noParts value=null>No Active Parts</option>
				<option v-for='(part, i) in parts' :value=i v-text=partNameDisplay(part)></option>
			</select>
		</div>

		<div class='music-box-project-controls'>
			<button @click=exportMusic :disabled=disabled>Export</button>
			<button @click=importMusic>Import</button>
			<button @click=openProjectModal>Projects</button>
		</div>
	</div>`,
	computed: {
		activePartIndex: {
			get() { return this.parts.findIndex(part => part == this.activePart); },
			set(i) { this.$emit('update-active-part', this.parts[i]); }
		},
		noParts() { return this.parts.length < 1; }
	},
	watch: {
		parts() {
			if (this.noParts || !this.parts.some(part => part == this.activePart)) this.activePartIndex = null;
		}
	},
	methods: {
		partNameDisplay(part) {
			return part.name + ' (' + part.instrument.name + ')';
		},
		setTempo(tempo) {
			this.$emit('set-tempo', tempo);
		},
		setTicksPerBeat(ticksPerBeat) {
			this.$emit('set-ticks-per-beat', ticksPerBeat);
		},
		play() {
			this.$emit('play');
		},
		pause() {
			this.$emit('pause');
		},
		stop() {
			this.$emit('stop');
		},
		step(deltaTick) {
			this.$emit('step', deltaTick);
		},
		fastStep(deltaTick, tempoMultiplier) {
			this.$emit('fast-step', deltaTick, tempoMultiplier);
		},
		goToBeginning() {
			this.$emit('go-to-beginning');
		},
		goToEnd() {
			this.$emit('go-to-end');
		},
		exportMusic() {
			this.$emit('export-music');
		},
		importMusic() {
			this.$emit('import-music');
		},
		openProjectModal() {
			this.$emit('open-project-modal');
		}
	}
});