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
		noNotes: {
			type: Boolean,
			required: true
		},
		disabled: {
			type: Boolean
		},
		toneSetOptions: {
			type: Array,
			required: true
		}
	},
	template: `<div class='music-box-controls'>
		<music-box-tempo-controls
			@set-tempo=setTempo
			@set-ticks-per-beat=setTicksPerBeat
			:tempo=tempo
			:ticks-per-beat=ticksPerBeat
			:disabled=disabled></music-box-tempo-controls>

		<div class='music-box-type-container'>
			<label>Music Box Type</label>
			<select v-model=selectedToneSet>
				<option v-for='toneSet in toneSetOptions' :value=toneSet v-text=toneSet.name></option>
			</select>
		</div>

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
	</div>`,
	data() {
		return {
			selectedToneSet: this.toneSetOptions[0] || {
				name: 'None',
				tones: []
			}
		};
	},
	watch: {
		selectedToneSet: {
			immediate: true,
			handler() {
				this.$emit('select-tone-set', this.selectedToneSet);
			}
		}
	},
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
		}
	}
});