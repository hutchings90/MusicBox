Vue.component('music-box-editor-note', {
	props: {
		note: {
			type: Note,
			required: true
		},
		part: {
			type: Part,
			required: true
		},
		tick: {
			type: Number,
			required: true
		},
		playing: {
			type: Boolean,
			required: true
		},
		styleComputer: {
			type: Function,
			required: true
		}
	},
	template: `<div @click=clicked @mousemove=mousemoved :class=classObject :style=styleObject></div>`,
	computed: {
		classObject() {
			return {
				'music-box-editor-note': true,
				'being-played': this.isBeingPlayed
			};
		},
		styleObject() { return this.styleComputer(this.note); },
		isBeingPlayed() { return this.playing && this.tick == this.note.tick; }
	},
	methods: {
		clicked(ev) {
			this.$emit('clicked', {
				ev: ev,
				part: this.part,
				note: this.note
			});
		},
		mousemoved() {
			this.$emit('mousemoved', this.note);
		}
	}
});