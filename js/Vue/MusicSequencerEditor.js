Vue.component('music-sequencer-editor', {
	props: [ 'beat', 'notes', 'playing', 'stream', 'audioContext' ],
	template: `<table class='music-sequencer-editor'>
		<tbody @mouseover=mouseOver @mouseLeave=mouseLeave>
			<music-sequencer-editor-row
				v-for='(tone, i) in tones'
				@add-note=addNote
				@remove-note=removeNote
				@moved-new-note-marker=movedNewNoteMarker
				:key=i
				:hovering-over-editor=hovering
				:new-note-marker-beat=newNoteMarkerBeat
				:beat=beat
				:tone=tone
				:notes=notes
				:playing=playing></music-sequencer-editor-row>
			</music-sequencer-editor-row>
		</tbody>
	</table>`,
	data() {
		return {
			hovering: false,
			newNoteMarkerBeat: 0
		};
	},
	computed: {
		tones() {
			return this.stream ? [
				// new Tone(this.audioContext, [ 'C' ], 16.35), new Tone(this.audioContext, [ 'C#', 'Db' ], 17.32), new Tone(this.audioContext, [ 'D' ], 18.35), new Tone(this.audioContext, [ 'D#', 'Eb' ], 19.45), new Tone(this.audioContext, [ 'E' ], 20.60), new Tone(this.audioContext, [ 'F' ], 21.83), new Tone(this.audioContext, [ 'F#', 'Gb' ], 23.12), new Tone(this.audioContext, [ 'G' ], 24.50), new Tone(this.audioContext, [ 'G#', 'Ab' ], 25.96), new Tone(this.audioContext, [ 'A' ], 27.50), new Tone(this.audioContext, [ 'A#', 'Bb' ], 29.14), new Tone(this.audioContext, [ 'B' ], 30.87),
				// new Tone(this.audioContext, [ 'C' ], 32.70), new Tone(this.audioContext, [ 'C#', 'Db' ], 34.65), new Tone(this.audioContext, [ 'D' ], 36.71), new Tone(this.audioContext, [ 'D#', 'Eb' ], 38.89), new Tone(this.audioContext, [ 'E' ], 41.20), new Tone(this.audioContext, [ 'F' ], 43.65), new Tone(this.audioContext, [ 'F#', 'Gb' ], 46.25), new Tone(this.audioContext, [ 'G' ], 49.00), new Tone(this.audioContext, [ 'G#', 'Ab' ], 51.91), new Tone(this.audioContext, [ 'A' ], 55.00), new Tone(this.audioContext, [ 'A#', 'Bb' ], 58.27), new Tone(this.audioContext, [ 'B' ], 61.74),
				// new Tone(this.audioContext, [ 'C' ], 65.41), new Tone(this.audioContext, [ 'C#', 'Db' ], 69.30), new Tone(this.audioContext, [ 'D' ], 73.42), new Tone(this.audioContext, [ 'D#', 'Eb' ], 77.78), new Tone(this.audioContext, [ 'E' ], 82.41), new Tone(this.audioContext, [ 'F' ], 87.31), new Tone(this.audioContext, [ 'F#', 'Gb' ], 92.50), new Tone(this.audioContext, [ 'G' ], 98.00), new Tone(this.audioContext, [ 'G#', 'Ab' ], 103.8), new Tone(this.audioContext, [ 'A' ], 110.0), new Tone(this.audioContext, [ 'A#', 'Bb' ], 116.5), new Tone(this.audioContext, [ 'B' ], 123.5),
				new Tone(this.audioContext, [ 'C' ], 130.8), new Tone(this.audioContext, [ 'C#', 'Db' ], 138.6), new Tone(this.audioContext, [ 'D' ], 146.8), new Tone(this.audioContext, [ 'D#', 'Eb' ], 155.6), new Tone(this.audioContext, [ 'E' ], 164.8), new Tone(this.audioContext, [ 'F' ], 174.6), new Tone(this.audioContext, [ 'F#', 'Gb' ], 185.0), new Tone(this.audioContext, [ 'G' ], 196.0), new Tone(this.audioContext, [ 'G#', 'Ab' ], 207.7), new Tone(this.audioContext, [ 'A' ], 220.0), new Tone(this.audioContext, [ 'A#', 'Bb' ], 233.1), new Tone(this.audioContext, [ 'B' ], 246.9),
				new Tone(this.audioContext, [ 'C' ], 261.6), new Tone(this.audioContext, [ 'C#', 'Db' ], 277.2), new Tone(this.audioContext, [ 'D' ], 293.7), new Tone(this.audioContext, [ 'D#', 'Eb' ], 311.1), new Tone(this.audioContext, [ 'E' ], 329.6), new Tone(this.audioContext, [ 'F' ], 349.2), new Tone(this.audioContext, [ 'F#', 'Gb' ], 370.0), new Tone(this.audioContext, [ 'G' ], 392.0), new Tone(this.audioContext, [ 'G#', 'Ab' ], 415.3), new Tone(this.audioContext, [ 'A' ], 440.0), new Tone(this.audioContext, [ 'A#', 'Bb' ], 466.2), new Tone(this.audioContext, [ 'B' ], 493.9),
				new Tone(this.audioContext, [ 'C' ], 523.3), new Tone(this.audioContext, [ 'C#', 'Db' ], 554.4), new Tone(this.audioContext, [ 'D' ], 587.3), new Tone(this.audioContext, [ 'D#', 'Eb' ], 622.3), new Tone(this.audioContext, [ 'E' ], 659.3), new Tone(this.audioContext, [ 'F' ], 698.5), new Tone(this.audioContext, [ 'F#', 'Gb' ], 740.0), new Tone(this.audioContext, [ 'G' ], 784.0), new Tone(this.audioContext, [ 'G#', 'Ab' ], 830.6), new Tone(this.audioContext, [ 'A' ], 880.0), new Tone(this.audioContext, [ 'A#', 'Bb' ], 932.3), new Tone(this.audioContext, [ 'B' ], 987.8),
				new Tone(this.audioContext, [ 'C' ], 1047), new Tone(this.audioContext, [ 'C#', 'Db' ], 1109), new Tone(this.audioContext, [ 'D' ], 1175), new Tone(this.audioContext, [ 'D#', 'Eb' ], 1245), new Tone(this.audioContext, [ 'E' ], 1319), new Tone(this.audioContext, [ 'F' ], 1397), new Tone(this.audioContext, [ 'F#', 'Gb' ], 1480), new Tone(this.audioContext, [ 'G' ], 1568), new Tone(this.audioContext, [ 'G#', 'Ab' ], 1661), new Tone(this.audioContext, [ 'A' ], 1760), new Tone(this.audioContext, [ 'A#', 'Bb' ], 1865), new Tone(this.audioContext, [ 'B' ], 1976),
				// new Tone(this.audioContext, [ 'C' ], 2093), new Tone(this.audioContext, [ 'C#', 'Db' ], 2217), new Tone(this.audioContext, [ 'D' ], 2349), new Tone(this.audioContext, [ 'D#', 'Eb' ], 2489), new Tone(this.audioContext, [ 'E' ], 2637), new Tone(this.audioContext, [ 'F' ], 2794), new Tone(this.audioContext, [ 'F#', 'Gb' ], 2960), new Tone(this.audioContext, [ 'G' ], 3136), new Tone(this.audioContext, [ 'G#', 'Ab' ], 3322), new Tone(this.audioContext, [ 'A' ], 3520), new Tone(this.audioContext, [ 'A#', 'Bb' ], 3729), new Tone(this.audioContext, [ 'B' ], 3951),
				// new Tone(this.audioContext, [ 'C' ], 4186), new Tone(this.audioContext, [ 'C#', 'Db' ], 4435), new Tone(this.audioContext, [ 'D' ], 4699), new Tone(this.audioContext, [ 'D#', 'Eb' ], 4978), new Tone(this.audioContext, [ 'E' ], 5274), new Tone(this.audioContext, [ 'F' ], 5588), new Tone(this.audioContext, [ 'F#', 'Gb' ], 5920), new Tone(this.audioContext, [ 'G' ], 6272), new Tone(this.audioContext, [ 'G#', 'Ab' ], 6645), new Tone(this.audioContext, [ 'A' ], 7040), new Tone(this.audioContext, [ 'A#', 'Bb' ], 7459), new Tone(this.audioContext, [ 'B' ], 7902),
			].reverse() : [];
		}
	},
	methods: {
		mouseOver() {
			this.hovering = true;
		},
		mouseLeave() {
			this.hovering = false;
		},
		movedNewNoteMarker(newNoteMarkerBeat) {
			this.newNoteMarkerBeat = newNoteMarkerBeat;
		},
		addNote(note) {
			this.$emit('add-note', note);
		},
		removeNote(note) {
			this.$emit('remove-note', note);
		}
	}
});