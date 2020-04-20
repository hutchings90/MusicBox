Vue.component('music-box-editor-note', {
	props: [ 'note', 'instrument', 'beat', 'playing', 'styleComputer' ],
	template: `<div @click=clicked @mousemove=mousemoved :class=classObject :style=styleObject></div>`,
	computed: {
		classObject() {
			return {
				'music-box-editor-note': true,
				'being-played': this.isBeingPlayed
			};
		},
		styleObject() { return this.styleComputer(this.note); },
		isBeingPlayed() { return this.playing && this.beat == this.note.beat; }
	},
	methods: {
		clicked(ev) {
			this.$emit('clicked', {
				ev: ev,
				instrument: this.instrument,
				note: this.note
			});
		},
		mousemoved() {
			this.$emit('mousemoved', this.note);
		}
	}
});