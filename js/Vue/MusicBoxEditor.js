Vue.component('music-box-editor', {
	props: [ 'beat', 'tones', 'instruments', 'playing', 'autoProgress', 'audioContext' ],
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
				:new-note-marker-beat=newNoteMarkerBeat
				:beat=beat
				:tone=tone
				:playing=playing
				:instruments=instruments
				:notes-by-frequency=notesByFrequency
				:audio-context=audioContext
				:x-to-beat=xToBeat
				:beat-to-x=beatToX></music-box-editor-row>
			</music-box-editor-row>
		</tbody>
	</table>`,
	data() {
		return {
			scrollX: 0,
			rightClickDownX: 0,
			rightClickDownScrollX: 0,
			hovering: false,
			newNoteMarkerBeat: 0
		};
	},
	computed: {
		noteWidth() { return 10; },
		beatX() { return this.beatToX(this.beat); },
		notes() { return this.instruments.reduce((reduction, instrument) => reduction.concat(instrument.notes), []); },
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
		beatX() {
			this.progress();
		},
		hovering() {
			if (!this.hovering) this.endRightClickMoving();
		}
	},
	methods: {
		beatToX(beat) {
			return beat * this.noteWidth;
		},
		xToBeat(x) {
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
		movedNewNoteMarker(newNoteMarkerBeat) {
			this.newNoteMarkerBeat = newNoteMarkerBeat;
		},
		progress() {
			if (!this.autoProgress) return;

			let diff = this.beatX + this.scrollX;

			if (diff < 0) this.scrollX = 0;
			else if (diff + this.noteWidth > this.$refs.editor.rows[0].children[1].offsetWidth) this.scrollX = -this.beatX;
		}
	}
});