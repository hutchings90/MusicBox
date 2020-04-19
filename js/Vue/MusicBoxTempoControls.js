Vue.component('music-box-tempo-controls', {
	props: [ 'tempo' ],
	template: `<div class='music-box-tempo-controls'>
		<label>Tempo</label>
		<input @change=setTempo v-model=tempoEditor type=number min=30 maxLength=10/>
	</div>`,
	data() {
		return {
			tempoEditor: this.tempo
		};
	},
	watch: {
		tempo() {
			this.tempoEditor = this.tempo;
		}
	},
	methods: {
		setTempo() {
			this.$emit('set-tempo', this.tempoEditor);
		}
	}
});