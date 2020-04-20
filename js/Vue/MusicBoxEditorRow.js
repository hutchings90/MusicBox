Vue.component('music-box-editor-row', {
	props: [ 'scrollX', 'hoveringOverEditor', 'newNoteMarkerBeat', 'beat', 'tone', 'playing', 'instruments', 'notesByFrequency', 'audioContext', 'xToBeat', 'beatToX' ],
	template: `<tr :class=classObject>
		<th @mouseenter=onMouseEnterTones class='music-box-editor-tone' v-text=toneNamesDisplay></th>
		<td @click=rowClicked @mouseenter=onMouseEnterNotes @mousemove='onmousemove($event)' @mouseleave='onmouseleave' class='music-box-editor-score'>
			<div v-show=hoveringOverEditor :style=newNoteColumnMarkerStyle class='new-note-column-marker'></div>
			<div :style=scoreMarkerStyle class='beat-marker'></div>
			<div v-show=hovering :style=newNoteMarkerStyle class='new-note-marker'></div>
			<template v-for='instrument in instruments'>
				<music-box-editor-note
					v-for='(note, i) in instrument.getNotesForTone(tone)'
					@clicked='noteClicked'
					@mousemoved='onmousemoveNote'
					:key=i
					:note=note
					:instrument=instrument
					:beat=beat
					:playing=playing
					:style-computer='noteStyle'></music-box-editor-note>
			</template>
		</td>
	</tr>`,
	data() {
		return {
			hovering: false,
			mouseX: 0
		};
	},
	computed: {
		toneNamesDisplay() { return this.tone.namesDisplay},
		isC() { return RegExp(/C[0-9]/).test(this.toneNamesDisplay); },
		isMiddleC() { return this.toneNamesDisplay == 'C4'; },
		isStandardA() { return this.toneNamesDisplay == 'A4'; },
		classObject() {
			return {
				'music-box-editor-row': true,
				'being-played': this.isBeingPlayed,
				c: this.isC && !this.isMiddleC,
				c4: this.isMiddleC,
				a4: this.isStandardA
			};
		},
		newNoteColumnMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerBeat); },
		scoreMarkerStyle() { return this.scrollableEditorItemStyle(this.beat); },
		newNoteMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerBeat); },
		scrollBeat() { return this.xToBeat(this.scrollX); },
		notes() { return this.notesByFrequency[this.tone.frequency] || []; },
		isBeingPlayed() { return this.playing && this.notes.find(note => note.beat == this.beat); }
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
		addNote(beat) {
			if (this.instruments.length == 1) this.instruments[0].addNote(new Note(beat, this.tone, this.audioContext));
		},
		removeNote(instrument, note) {
			instrument.removeNote(note);
		},
		noteClicked(data) {
			data.ev.preventDefault();
			data.ev.stopPropagation();

			this.removeNote(data.instrument, data.note);
		},
		onmousemove(ev) {
			let x;

			switch (ev.target.className) {
			case 'beat-marker':
			case 'music-box-editor-note': 
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