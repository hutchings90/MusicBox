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
			type: Number,
			required: true
		},
		ticksPerBeat: {
			type: Number,
			required: true
		},
		tempoMultiplier: {
			type: Number,
			required: true
		},
		playing: {
			type: Boolean,
			required: true
		},
		noNotes: {
			type: Boolean,
			required: true
		}
	},
	template: `<div class='music-box-controls'>
		<music-box-tempo-controls
			@set-tempo=setTempo
			@set-ticks-per-beat=setTicksPerBeat
			:tempo=tempo
			:ticks-per-beat=ticksPerBeat></music-box-tempo-controls>

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

		<div class='music-box-management-controls'>
			<button @click=exportMusic>Export</button>
			<button @click=importMusic>Import</button>
		</div>
	</div>`,
	methods: {
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
		}
	}
});