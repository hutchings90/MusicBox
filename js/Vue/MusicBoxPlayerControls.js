Vue.component('music-box-player-controls', {
	props: {
		tick: {
			type: Number,
			required: true
		},
		deltaTick: {
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
	template: `<div class='music-box-player-controls'>
		<button @click=goToBeginning :disabled=noNotes>|<</button>
		<button @click=backward :disabled=noNotes><</button>
		<button @click=fastBackward :disabled=noNotes><<</button>
		<button v-if=playing class='pause-button' @click=pause>Pause</button>
		<button v-else @click=play :disabled=noNotes class='play-button'>Play</button>
		<button @click=stop :disabled=disableStopButton class='stop-button'>Stop</button>
		<button @click=fastForward :disabled=noNotes>>></button>
		<button @click=forward :disabled=noNotes>></button>
		<button @click=goToEnd :disabled=noNotes>>|</button>
	</div>`,
	computed: {
		disableStopButton() { return this.tick == 0 && !this.playing && this.tempoMultiplier == 1 && this.deltaTick == 1; }
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
		}
	}
});