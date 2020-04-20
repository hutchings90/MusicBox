Vue.component('music-box-controls', {
	props: [ 'beat', 'deltaBeat', 'tempo', 'tempoMultiplier', 'playing', 'noNotes' ],
	template: `<div class='music-box-controls'>
		<music-box-tempo-controls
			@set-tempo=setTempo
			:tempo=tempo></music-box-tempo-controls>
		<music-box-player-controls
			@play=play
			@pause=pause
			@stop=stop
			@step=step
			@fast-step=fastStep
			@go-to-beginning=goToBeginning
			@go-to-end=goToEnd
			:beat=beat
			:delta-beat=deltaBeat
			:tempo-multiplier=tempoMultiplier
			:playing=playing
			:no-notes=noNotes></music-box-player-controls>
		<div class='music-box-controls-spacer'>
			<button @click=exportMusic>Export</button>
			<button @click=importMusic>Import</button>
		</div>
	</div>`,
	methods: {
		setTempo(tempo) {
			this.$emit('set-tempo', tempo);
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
		step(deltaBeat) {
			this.$emit('step', deltaBeat);
		},
		fastStep(deltaBeat, tempoMultiplier) {
			this.$emit('fast-step', deltaBeat, tempoMultiplier);
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