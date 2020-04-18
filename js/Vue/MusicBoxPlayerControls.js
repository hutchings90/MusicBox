Vue.component('music-box-player-controls', {
	props: [ 'beat', 'deltaBeat', 'tempoMultiplier', 'playing', 'noNotes' ],
	template: `<div class='music-box-player-controls'>
		<button @click=goToBeginning>|<</button>
		<button @click=backward><</button>
		<button @click=fastBackward><<</button>
		<button @click=pause v-if=playing class='play-pause-button'>Pause</button>
		<button @click=play v-else :disabled=noNotes class='play-pause-button'>Play</button>
		<button @click=stop :disabled=disableStopButton class='play-pause-button'>Stop</button>
		<button @click=fastForward>>></button>
		<button @click=forward>></button>
		<button @click=goToEnd>>|</button>
	</div>`,
	computed: {
		disableStopButton() { return this.beat == 0 && !this.playing && this.tempoMultiplier == 1 && this.deltaBeat == 1; }
	},
	methods: {
		play() {
			this.$emit('play');
		},
		pause() {
			this.$emit('pause');
		},
		stop() {
			this.$emit('stop');
		},
		backward() {
			this.step(-1);
		},
		fastBackward() {
			this.fastStep(-1);
		},
		fastForward() {
			this.fastStep(1);
		},
		forward() {
			this.step(1);
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