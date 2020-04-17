Vue.component('music-sequencer-controls', {
	props: [ 'beat', 'deltaBeat', 'tempo', 'tempoMultiplier', 'playing' ],
	template: `<div class='music-sequencer-controls'>
		<music-sequencer-tempo-controls
			@set-tempo=setTempo
			:tempo=tempo></music-sequencer-tempo-controls>
		<music-sequencer-player-controls
			@play=play
			@pause=pause
			@stop=stop
			@step=step
			@fast-step=fastStep
			@go-to-beginning=goToBeginning
			@go-to-end=goToEnd
			:playing=playing
			:beat=beat
			:delta-beat=deltaBeat
			:tempo-multiplier=tempoMultiplier></music-sequencer-player-controls>
		<div class='music-sequencer-controls-spacer'></div>
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
		}
	}
});