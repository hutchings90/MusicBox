Vue.component('instrument-select', {
	props: {
		instrument: {
			type: Instrument,
			required: true
		},
		customInstrumentOptions: {
			type: Array,
			default: () => []
		}
	},
	template: `<select v-model=instrumentName>
		<optgroup label='Standard'>
			<option v-for='option in standardInstrumentOptions' v-text=option.name>></option>
		</optgroup>
		<optgroup label='Custom'>
			<option>New Custom Instrument</option>
			<option v-for='option in customInstrumentOptions' v-text=option.name>></option>
		</optgroup>
	</select>`,
	computed: {
		instrumentName: {
			get() { return this.instrument.name; },
			set(instrumentName) { this.$emit('update-instrument', instrumentName); }
		},
		standardInstrumentOptions() { return Instrument.STANDARD_OPTIONS; },
		hasCustomInstrumentOptions() { return this.customInstrumentOptions.length > 0; },
		lastCustomInstrumentOptionIndex() { return this.customInstrumentOptions.length - 1; }
	},
	watch: {
		customInstrumentOptions() {
			if (this.creatingCustomInstrument && this.hasCustomInstrumentOptions) this.instrumentName = this.customInstrumentOptions[this.lastCustomInstrumentOptionIndex].name;
		}
	}
});