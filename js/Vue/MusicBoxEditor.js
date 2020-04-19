Vue.component('music-box-editor', {
	props: [ 'beat', 'instruments', 'playing', 'autoProgress', 'audioContext' ],
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
				:instruments=instruments
				:playing=playing
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
		tones() {
			return this.audioContext ? [
				new Tone([ 'C0' ], 16.35), new Tone([ 'C#', 'Db' ], 17.32), new Tone([ 'D' ], 18.35), new Tone([ 'D#', 'Eb' ], 19.45), new Tone([ 'E' ], 20.60), new Tone([ 'F' ], 21.83), new Tone([ 'F#', 'Gb' ], 23.12), new Tone([ 'G' ], 24.50), new Tone([ 'G#', 'Ab' ], 25.96), new Tone([ 'A' ], 27.50), new Tone([ 'A#', 'Bb' ], 29.14), new Tone([ 'B' ], 30.87),
				new Tone([ 'C1' ], 32.70), new Tone([ 'C#', 'Db' ], 34.65), new Tone([ 'D' ], 36.71), new Tone([ 'D#', 'Eb' ], 38.89), new Tone([ 'E' ], 41.20), new Tone([ 'F' ], 43.65), new Tone([ 'F#', 'Gb' ], 46.25), new Tone([ 'G' ], 49.00), new Tone([ 'G#', 'Ab' ], 51.91), new Tone([ 'A' ], 55.00), new Tone([ 'A#', 'Bb' ], 58.27), new Tone([ 'B' ], 61.74),
				new Tone([ 'C2' ], 65.41), new Tone([ 'C#', 'Db' ], 69.30), new Tone([ 'D' ], 73.42), new Tone([ 'D#', 'Eb' ], 77.78), new Tone([ 'E' ], 82.41), new Tone([ 'F' ], 87.31), new Tone([ 'F#', 'Gb' ], 92.50), new Tone([ 'G' ], 98.00), new Tone([ 'G#', 'Ab' ], 103.8), new Tone([ 'A' ], 110.0), new Tone([ 'A#', 'Bb' ], 116.5), new Tone([ 'B' ], 123.5),
				new Tone([ 'C3' ], 130.8), new Tone([ 'C#', 'Db' ], 138.6), new Tone([ 'D' ], 146.8), new Tone([ 'D#', 'Eb' ], 155.6), new Tone([ 'E' ], 164.8), new Tone([ 'F' ], 174.6), new Tone([ 'F#', 'Gb' ], 185.0), new Tone([ 'G' ], 196.0), new Tone([ 'G#', 'Ab' ], 207.7), new Tone([ 'A' ], 220.0), new Tone([ 'A#', 'Bb' ], 233.1), new Tone([ 'B' ], 246.9),
				new Tone([ 'C4' ], 261.6), new Tone([ 'C#', 'Db' ], 277.2), new Tone([ 'D' ], 293.7), new Tone([ 'D#', 'Eb' ], 311.1), new Tone([ 'E' ], 329.6), new Tone([ 'F' ], 349.2), new Tone([ 'F#', 'Gb' ], 370.0), new Tone([ 'G' ], 392.0), new Tone([ 'G#', 'Ab' ], 415.3), new Tone([ 'A4' ], 440.0), new Tone([ 'A#', 'Bb' ], 466.2), new Tone([ 'B' ], 493.9),
				new Tone([ 'C5' ], 523.3), new Tone([ 'C#', 'Db' ], 554.4), new Tone([ 'D' ], 587.3), new Tone([ 'D#', 'Eb' ], 622.3), new Tone([ 'E' ], 659.3), new Tone([ 'F' ], 698.5), new Tone([ 'F#', 'Gb' ], 740.0), new Tone([ 'G' ], 784.0), new Tone([ 'G#', 'Ab' ], 830.6), new Tone([ 'A' ], 880.0), new Tone([ 'A#', 'Bb' ], 932.3), new Tone([ 'B' ], 987.8),
				new Tone([ 'C6' ], 1047), new Tone([ 'C#', 'Db' ], 1109), new Tone([ 'D' ], 1175), new Tone([ 'D#', 'Eb' ], 1245), new Tone([ 'E' ], 1319), new Tone([ 'F' ], 1397), new Tone([ 'F#', 'Gb' ], 1480), new Tone([ 'G' ], 1568), new Tone([ 'G#', 'Ab' ], 1661), new Tone([ 'A' ], 1760), new Tone([ 'A#', 'Bb' ], 1865), new Tone([ 'B' ], 1976),
				new Tone([ 'C7' ], 2093), new Tone([ 'C#', 'Db' ], 2217), new Tone([ 'D' ], 2349), new Tone([ 'D#', 'Eb' ], 2489), new Tone([ 'E' ], 2637), new Tone([ 'F' ], 2794), new Tone([ 'F#', 'Gb' ], 2960), new Tone([ 'G' ], 3136), new Tone([ 'G#', 'Ab' ], 3322), new Tone([ 'A' ], 3520), new Tone([ 'A#', 'Bb' ], 3729), new Tone([ 'B' ], 3951),
				new Tone([ 'C8' ], 4186), new Tone([ 'C#', 'Db' ], 4435), new Tone([ 'D' ], 4699), new Tone([ 'D#', 'Eb' ], 4978), new Tone([ 'E' ], 5274), new Tone([ 'F' ], 5588), new Tone([ 'F#', 'Gb' ], 5920), new Tone([ 'G' ], 6272), new Tone([ 'G#', 'Ab' ], 6645), new Tone([ 'A' ], 7040), new Tone([ 'A#', 'Bb' ], 7459), new Tone([ 'B' ], 7902),
			].reverse() : [];
		},
		beatX() { return this.beatToX(this.beat); }
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