Vue.component('music-sequencer-editor-row', {
	props: [ 'hoveringOverEditor', 'newNoteMarkerBeat', 'beat', 'tone', 'notes', 'playing' ],
	template: `<tr>
		<th class='music-sequencer-editor-tone' v-text=tone.namesDisplay></th>
		<td @mousemove='onmousemove($event)' @mouseleave='onmouseleave' class='music-sequencer-editor-score'>
			<div v-show=hoveringOverEditor :style=newNoteColumnMarkerStyle class='new-note-column-marker'></div>
			<div :style=scoreMarkerStyle class='score-marker'></div>
			<div v-show=hovering :style=newNoteMarkerStyle @click=newNoteMarkerClicked class='new-note-marker'></div>
			<div class='note'
				v-for='note in notesForTone(tone)'
				@click='removeNote(note)'
				@mousemove='onmousemoveNote(note)'
				:style='noteStyle(note)'></div>
		</td>
	</tr>`,
	data() {
		return {
			hovering: false,
			mouseX: 0
		};
	},
	computed: {
		noteWidth() { return 10; },
		newNoteColumnMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerBeatPosition); },
		scoreMarkerStyle() { return this.editorItemStyle(this.beatPosition(this.beat)); },
		newNoteMarkerBeatPosition() { return this.beatPosition(this.newNoteMarkerBeat); },
		newNoteMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerBeatPosition); },
		notesByFrequency() {
			return this.notes.reduce((reduction, note) => {
				if (!reduction[note.tone.frequency]) reduction[note.tone.frequency] = [];

				reduction[note.tone.frequency].push(note);

				return reduction;
			}, {});
		}
	},
	watch: {
		mouseX() {
			this.$emit('moved-new-note-marker', Math.floor(this.mouseX / this.noteWidth));
		}
	},
	methods: {
		editorItemStyle(beatPosition) {
			return {
				width: this.noteWidth + 'px',
				top: 0,
				left: beatPosition + 'px',
				x: beatPosition
			};
		},
		beatPosition(beat) {
			return beat * this.noteWidth;
		},
		notesForTone(tone) {
			return this.notesByFrequency[tone.frequency] || [];
		},
		addNote(beat) {
			this.$emit('add-note', new Note(beat, this.tone));
		},
		removeNote(note) {
			this.$emit('remove-note', note);
		},
		onmousemove(ev) {
			let x = this.mouseX;

			if (ev.target.className == 'music-sequencer-editor-score') x = ev.offsetX + 1;
			else if (ev.target.className == 'score-marker') x = this.beatPosition(this.beat) + ev.offsetX;
			else if (ev.target.className == 'new-note-column-marker') x = this.beatPosition(this.newNoteMarkerBeat) + ev.offsetX;

			this.setMouseX(x);
		},
		onmousemoveNote(note) {
			this.setMouseX(this.beatPosition(note.beat));
		},
		setMouseX(x) {
			this.hovering = true;
			this.mouseX = x;
		},
		onmouseleave() {
			this.hovering = false;
		},
		noteStyle(note) {
			return this.editorItemStyle(this.beatPosition(note.beat));
		},
		newNoteMarkerClicked() {
			this.addNote(this.newNoteMarkerBeat);
		}
	}
});