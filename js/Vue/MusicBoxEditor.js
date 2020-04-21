Vue.component('music-box-editor', {
	props: {
		tick: {
			type: Number,
			required: true
		},
		tones: {
			type: Array,
			required: true
		},
		parts: {
			type: Array,
			required: true
		},
		playing: {
			type: Boolean,
			required: true
		},
		autoProgress: {
			type: Boolean,
			required: true
		},
		audioContext: {
			type: AudioContext,
			required: true
		}
	},
	template: `<table class='music-box-editor'>
		<tbody ref=editor @mousedown.right=onRightClickDown @mouseup.right=onRightClickUp @contextmenu.prevent @mouseenter=mouseEnter @mousemove=onMouseMove @mouseleave=mouseLeave>
			<music-box-editor-row
				v-for='(tone, i) in tones'
				@move-scroll-x=moveScrollX
				@end-hover=endHover
				@begin-hover=beginHover
				@moved-new-note-marker=movedNewNoteMarker
				:key=i
				:scroll-x=scrollX
				:hovering-over-editor=hovering
				:new-note-marker-tick=newNoteMarkerTick
				:tick=tick
				:tone=tone
				:playing=playing
				:parts=parts
				:notes-by-frequency=notesByFrequency
				:audio-context=audioContext
				:x-to-tick=xToTick
				:tick-to-x=tickToX></music-box-editor-row>
			</music-box-editor-row>
		</tbody>
	</table>`,
	data() {
		return {
			scrollX: 0,
			rightClickDownX: 0,
			rightClickDownScrollX: 0,
			hovering: false,
			newNoteMarkerTick: 0
		};
	},
	computed: {
		noteWidth() { return 10; },
		tickX() { return this.tickToX(this.tick); },
		notes() { return this.parts.reduce((reduction, part) => reduction.concat(part.notes), []); },
		notesByFrequency() {
			return this.notes.reduce((reduction, note) => {
				let frequency = note.tone.frequency;

				if (!reduction[frequency]) reduction[frequency] = [];

				reduction[frequency].push(note);

				return reduction;
			}, {});
		}
	},
	watch: {
		scrollX() {
			if (this.scrollX > 0) this.scrollX = 0;
		},
		tickX() {
			this.progress();
		},
		hovering() {
			if (!this.hovering) this.endRightClickMoving();
		}
	},
	methods: {
		tickToX(tick) {
			return tick * this.noteWidth;
		},
		xToTick(x) {
			return Math.floor(x / this.noteWidth);
		},
		moveScrollX(dx) {
			this.scrollX += dx;
		},
		endHover() {
			this.hovering = false;
		},
		beginHover() {
			this.hovering = true;
		},
		onRightClickDown(ev) {
			this.rightClickDownX = ev.screenX;
			this.rightClickDownScrollX = this.scrollX;
		},
		onRightClickUp() {
			this.endRightClickMoving();
		},
		endRightClickMoving() {
			this.rightClickDownX = 0;
		},
		mouseEnter() {
			this.beginHover();
		},
		onMouseMove(ev) {
			if (!this.rightClickDownX) return;

			this.scrollX = this.rightClickDownScrollX - this.rightClickDownX + ev.screenX;

			this.$emit('right-mouse-move');
		},
		mouseLeave() {
			this.endHover();
		},
		movedNewNoteMarker(newNoteMarkerTick) {
			this.newNoteMarkerTick = newNoteMarkerTick;
		},
		progress() {
			if (!this.autoProgress) return;

			let diff = this.tickX + this.scrollX;

			if (diff < 0) this.scrollX = 0;
			else if (diff + this.noteWidth > this.$refs.editor.rows[0].children[1].offsetWidth) this.scrollX = -this.tickX;
		}
	}
});