Vue.component('music-box-editor-row', {
	props: {
		scrollX: {
			type: Number,
			required: true
		},
		hoveringOverEditor: {
			type: Boolean,
			required: true
		},
		newNoteMarkerTick: {
			type: Number,
			required: true
		},
		tick: {
			type: Number,
			required: true
		},
		tone: {
			type: Tone,
			required: true
		},
		playing: {
			type: Boolean,
			required: true
		},
		playing: {
			type: Boolean,
			required: true
		},
		parts: {
			type: Array,
			required: true
		},
		notesByFrequency: {
			type: Object,
			required: true
		},
		audioContext: {
			type: AudioContext,
			required: true
		},
		xToTick: {
			type: Function,
			required: true
		},
		tickToX: {
			type: Function,
			required: true
		}
	},
	template: `<tr :class=classObject>
		<th @mouseenter=onMouseEnterTones class='music-box-editor-tone' v-text=toneNamesDisplay></th>
		<td @click=rowClicked @mouseenter=onMouseEnterNotes @mousemove='onmousemove($event)' @mouseleave='onmouseleave' class='music-box-editor-score'>
			<div v-show=hoveringOverEditor :style=newNoteColumnMarkerStyle class='new-note-column-marker'></div>
			<div :style=scoreMarkerStyle class='tick-marker'></div>
			<div v-show=hovering :style=newNoteMarkerStyle class='new-note-marker'></div>
			<template v-for='part in parts'>
				<music-box-editor-note
					v-for='(note, i) in part.getNotesForTone(tone)'
					@clicked='noteClicked'
					@mousemoved='onmousemoveNote'
					:key=i
					:note=note
					:part=part
					:tick=tick
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
		newNoteColumnMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerTick); },
		scoreMarkerStyle() { return this.scrollableEditorItemStyle(this.tick); },
		newNoteMarkerStyle() { return this.editorItemStyle(this.newNoteMarkerTick); },
		scrollTick() { return this.xToTick(this.scrollX); },
		notes() { return this.notesByFrequency[this.tone.frequency] || []; },
		isBeingPlayed() { return this.playing && this.notes.find(note => note.tick == this.tick); }
	},
	watch: {
		mouseX() {
			this.$emit('moved-new-note-marker', this.xToTick(this.mouseX));
		}
	},
	methods: {
		onMouseEnterTones() {
			this.$emit('end-hover');
		},
		onMouseEnterNotes() {
			this.$emit('begin-hover');
		},
		editorItemStyle(tick) {
			return {
				left: this.tickToX(tick) + 'px'
			};
		},
		scrollableEditorItemStyle(tick) {
			return this.editorItemStyle(this.scrollTick + tick);
		},
		addNote(tick) {
			if (this.parts.length == 1) this.parts[0].addNote(new Note(tick, this.tone, this.audioContext));
		},
		removeNote(part, note) {
			part.removeNote(note);
		},
		noteClicked(data) {
			data.ev.preventDefault();
			data.ev.stopPropagation();

			this.removeNote(data.part, data.note);
		},
		onmousemove(ev) {
			let x;

			switch (ev.target.className) {
			case 'tick-marker':
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
			this.setMouseX(this.tickToX(note.tick));
		},
		setMouseX(x) {
			this.hovering = true;
			this.mouseX = x;
		},
		onmouseleave() {
			this.hovering = false;
		},
		noteStyle(note) {
			return this.scrollableEditorItemStyle(note.tick);
		},
		rowClicked() {
			this.addNote(this.newNoteMarkerTick - this.scrollTick);
		}
	}
});