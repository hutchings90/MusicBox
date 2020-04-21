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