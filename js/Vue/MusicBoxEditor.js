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
		playing: {
			type: Boolean,
			required: true
		},
		projects: {
			type: Array,
			default: []
		},
		activeProject:{
			type: Project
		},
		parts: {
			type: Array,
			required: true
		},
		activePart: {
			type: Part
		},
		activeNote: {
			type: Note
		},
		maxTick: {
			type: Number,
			required: true
		},
		autoProgress: {
			type: Boolean,
			required: true
		},
		hasModals: {
			type: Boolean,
			default: false
		}
	},
	template: `<div class='music-box-editor-container'>
		<music-box-sidebar
			@activate-project=activateProject
			@part-clicked=activatePart
			@add-project=addProject
			@import-project=importProject
			@add-part=addPart
			@activate-part=activatePart
			@close-project=closeProject
			@export-project=exportProject
			:projects=projects
			:active-project=activeProject
			:active-part=activePart
			:active-note=activeNote></music-box-sidebar>

		<div v-if=activeProject class='music-box-editor-scroller'>
			<div class='music-box-editor-padding'>
				<table class='music-box-editor'>
					<tbody ref=editor @mousedown.right=onRightClickDown @mouseup.right=onRightClickUp @contextmenu.prevent @mouseenter=mouseEnter @mousemove=onMouseMove @mouseleave=mouseLeave>
						<music-box-editor-row
							v-for='(tone, i) in tones'
							@end-hover=endHover
							@begin-hover=beginHover
							@moved-new-note-marker=movedNewNoteMarker
							:key=i
							:scroll-x=scrollCoords.x
							:hovering-over-editor=hovering
							:new-note-marker-tick=newNoteMarkerTick
							:tick=tick
							:tone=tone
							:playing=playing
							:parts=parts
							:active-part=activePart
							:notes-by-frequency=notesByFrequency
							:x-to-tick=xToTick
							:tick-to-x=tickToX></music-box-editor-row>
						</music-box-editor-row>
					</tbody>
				</table>
			</div>
		</div>
	</div>`,
	created() {
		window.onscroll = () => this.onscrollHandler();
		window.onwheel = ev => this.onwheelHandler(ev);
	},
	data() {
		return {
			scrollCoords: {
				x: 0,
				y: 0
			},
			rightClickDownCoords: {
				x: 0,
				y: 0
			},
			rightClickDownScrollCoords: {
				x: 0,
				y: 0
			},
			hovering: false,
			newNoteMarkerTick: 0,
			rightClickMovingPaused: true
		};
	},
	computed: {
		noteWidth() { return 10; },
		scrollTickLead() { return 20; },
		tickX() { return this.tickToX(this.tick); },
		scrollTick() { return this.xToTick(this.scrollCoords.x); },
		scrollTickDiff() { return this.tick + this.scrollTick; },
		notes() { return this.parts.reduce((reduction, part) => reduction.concat(part.notes), []); },
		notesByFrequency() {
			return this.notes.reduce((reduction, note) => {
				let frequency = note.tone.frequency;

				if (!reduction[frequency]) reduction[frequency] = [];

				reduction[frequency].push(note);

				return reduction;
			}, {});
		},
	},
	watch: {
		'scrollCoords.x'() {
			if (this.scrollCoords.x > 0) this.scrollCoords.x = 0;
		},
		'scrollCoords.y'() {
			document.scrollingElement.scrollTop = -this.scrollCoords.y;

			// If the user keeps scrolling past the scrolling element's limit,
			// then the scrolling element's scrollTop stops at the limit, but
			// scrollCoords.y keeps going.
			if (this.scrollCoords.y != -document.scrollingElement.scrollTop) this.scrollCoords.y = -document.scrollingElement.scrollTop;
		},
		tick(newTick, oldTick) {
			if (!this.autoProgress) return;

			if (newTick > oldTick) {
				let tickCount = this.xToTick(this.$refs.editor.rows[0].children[1].offsetWidth) - 1;
				let diff = tickCount - this.scrollTickLead;

				if (this.tick + this.scrollTick > diff) this.scrollCoords.x = -this.tickToX(Math.min(this.maxTick, this.tick + this.scrollTickLead) - tickCount);
			}
			else if (this.scrollTickDiff < this.scrollTickLead) this.scrollCoords.x = Math.min(0, -this.tickToX(this.tick - this.scrollTickLead));
		},
		hovering() {
			if (!this.hovering) this.pauseRightClickMoving();
			else if (this.rightClickDownCoords.x != 0) this.continueRightClickMoving();
		}
	},
	methods: {
		tickToX(tick) {
			return tick * this.noteWidth;
		},
		xToTick(x) {
			return Math.floor(x / this.noteWidth);
		},
		moveScrollCoords(axis, delta) {
			this.scrollCoords[axis] += delta;

			if (axis == 'x') this.$emit('x-axis-scroll');
		},
		endHover() {
			this.hovering = false;
		},
		beginHover() {
			this.hovering = true;
		},
		onRightClickDown(ev) {
			this.rightClickDownCoords.x = ev.screenX;
			this.rightClickDownCoords.y = ev.screenY;
			this.rightClickDownScrollCoords.x = this.scrollCoords.x;
			this.rightClickDownScrollCoords.y = this.scrollCoords.y;
			this.continueRightClickMoving();
		},
		onRightClickUp() {
			this.endRightClickMoving();
		},
		endRightClickMoving() {
			this.rightClickDownCoords.x = 0;
			this.pauseRightClickMoving();
		},
		continueRightClickMoving() {
			this.rightClickMovingPaused = false;
		},
		pauseRightClickMoving() {
			this.rightClickMovingPaused = true;
		},
		mouseEnter() {
			this.beginHover();
		},
		onMouseMove(ev) {
			if (this.rightClickMovingPaused) return;

			this.scrollCoords.x = this.rightClickDownScrollCoords.x - this.rightClickDownCoords.x + ev.screenX;
			this.scrollCoords.y = this.rightClickDownScrollCoords.y - this.rightClickDownCoords.y + ev.screenY;

			this.$emit('right-mouse-move');
		},
		mouseLeave() {
			this.endHover();
		},
		movedNewNoteMarker(newNoteMarkerTick) {
			this.newNoteMarkerTick = newNoteMarkerTick;
		},
		onscrollHandler() {
			this.scrollCoords.y = -document.scrollingElement.scrollTop;
		},
		onwheelHandler(ev) {
			if (!this.hasModals && ev.shiftKey && ev.target.closest('.music-box-editor-scroller')) this.moveScrollCoords('x', this.tickToX(-3 * ev.deltaY / Math.abs(ev.deltaY)));
		},
		addProject() {
			this.$emit('add-project');
		},
		importProject() {
			this.$emit('import-project');
		},
		activateProject(project) {
			this.$emit('activate-project', project);
		},
		activatePart(part) {
			this.$emit('activate-part', part);
		},
		addPart(project) {
			this.$emit('add-part', project);
		},
		closeProject(project) {
			this.$emit('close-project', project);
		},
		exportProject(project) {
			this.$emit('export-project', project);
		}
	}
});