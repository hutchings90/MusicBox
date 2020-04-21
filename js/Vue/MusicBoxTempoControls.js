Vue.component('music-box-tempo-controls', {
	props: {
		tempo: {
			type: Number,
			required: true
		},
		ticksPerBeat: {
			type: Number,
			required: true
		}
	},
	template: `<div class='music-box-tempo-controls'>
		<div>
			<label>Tempo:</label>
			<input @change=setTempo v-model=tempoEditor type=number min=30/>
		</div>

		<div>
			<label>Ticks Per Beat:</label>
			<input @change=setTicksPerBeat v-model=ticksPerBeatEditor type=number min=1>
		</div>
	</div>`,
	data() {
		return {
			tempoEditor: this.tempo,
			ticksPerBeatEditor: this.ticksPerBeat
		};
	},
	watch: {
		tempo() {
			this.tempoEditor = this.tempo;
		},
		ticksPerBeat() {
			this.ticksPerBeatEditor = this.ticksPerBeat;
		}
	},
	methods: {
		setTempo() {
			this.$emit('set-tempo', this.tempoEditor);
		},
		setTicksPerBeat() {
			this.$emit('set-ticks-per-beat', this.ticksPerBeatEditor);
		}
	}
});