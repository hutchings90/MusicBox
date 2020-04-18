Vue.component('music-box-editor-row', {
	props: [ 'scrollX', 'hoveringOverEditor', 'newNoteMarkerBeat', 'beat', 'tone', 'notes', 'playing', 'xToBeat', 'beatToX' ],
	template: `<tr>
		<th @mouseenter=onMouseEnterTones class='music-box-editor-tone' v-text=tone.namesDisplay></th>
		<td @click=rowClicked @mouseenter=onMouseEnterNotes @mousemove='onmousemove($event)' @mouseleave='onmouseleave' class='music-box-editor-score'>
			<div v-show=hoveringOverEditor :style=newNoteColumnMarkerStyle class='new-note-column-marker'></div>
			<div :style=scoreMarkerStyle class='beat-marker'></div>
			<div v-show=hovering :style=newNoteMarkerStyle class='new-note-marker'></div>
			<div class='note'
				v-for='note in notesForTone(tone)'
				@click='removeNote($event, note)'
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
		newNoteColumnMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerBeat); },
		scoreMarkerStyle() { return this.scrollableEditorItemStyle(this.beat); },
		newNoteMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerBeat); },
		scrollBeat() { return this.xToBeat(this.scrollX); },
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
			this.$emit('moved-new-note-marker', this.xToBeat(this.mouseX));
		}
	},
	methods: {
		onMouseEnterTones() {
			this.$emit('end-hover');
		},
		onMouseEnterNotes() {
			this.$emit('begin-hover');
		},
		editorItemStyle(beat) {
			return {
				left: this.beatToX(beat) + 'px'
			};
		},
		scrollableEditorItemStyle(beat) {
			return this.editorItemStyle(this.scrollBeat + beat);
		},
		notesForTone(tone) {
			return this.notesByFrequency[tone.frequency] || [];
		},
		addNote(beat) {
			this.$emit('add-note', new Note(beat, this.tone));
		},
		removeNote(ev, note) {
			ev.preventDefault(note);
			ev.stopPropagation(note);

			this.$emit('remove-note', note);
		},
		onmousemove(ev) {
			let x;

			switch (ev.target.className) {
			case 'beat-marker':
			case 'note': 
			case 'new-note-column-marker':
				let left = ev.target.style.left;

				x = Number(left.slice(0, left.length - 2));

				break;
			case 'music-box-editor-score': x = ev.offsetX + 1; break;
			default: x = this.mouseX; break;
			}

			this.setMouseX(x);
		},
		onmousemoveNote(note) {
			this.setMouseX(this.beatToX(note.beat));
		},
		setMouseX(x) {
			this.hovering = true;
			this.mouseX = x;
		},
		onmouseleave() {
			this.hovering = false;
		},
		noteStyle(note) {
			return this.scrollableEditorItemStyle(note.beat);
		},
		rowClicked() {
			this.addNote(this.newNoteMarkerBeat - this.scrollBeat);
		}
	}
});