Vue.component('music-box-sidebar-project', {
	props: {
		project: {
			type: Project,
			required: true
		},
		isActive: {
			type: Boolean,
			default: false
		},
		activePart: {
			type: Part
		}
	},
	template: `<div class='music-box-sidebar-project' :class=objectClass>
		<input ref='projectName' v-model=project.name @click=activate @keyup.enter=$event.target.blur() placeholder='Unnamed Project' />
		<br>
		<button @click=close class='danger'>Close</button>
		<button @click=exportProject>Export</button>

		<div v-show=isActive>
			<div>
				Parts
				<button @click=addPart($event)>New</button>
			</div>

			<div>
				<music-box-sidebar-part
					v-for='(part, i) in project.parts'
					@activate=activatePart
					@update-show-in-editor=updateShowInEditor
					:key=i
					:part=part
					:is-active='part == activePart'
					:shown-parts=partsShownInEditor></music-box-sidebar-part>
			</div>
		</div>
	</div>`,
	mounted() {
		if (!this.project.name) this.$refs.projectName.focus();
	},
	computed: {
		objectClass() {
			return {
				active: this.isActive
			};
		},
		partsShownInEditor: {
			get() { return this.project.settings.partsShownInEditor; },
			set(partsShownInEditor) { this.project.settings.partsShownInEditor = partsShownInEditor; }
		}
	},
	methods: {
		activate() {
			this.$emit('activate', this.project);
		},
		addPart(ev) {
			this.$emit('add-part', this.project);

			ev.preventDefault();
			ev.stopPropagation();
		},
		activatePart(part) {
			this.$emit('activate-part', part);
		},
		updateShowInEditor(data) {
			if (!data.showInEditor) this.partsShownInEditor = this.partsShownInEditor.filter(part => part != data.part);
			else if (this.partsShownInEditor.indexOf(data.part) < 0) this.partsShownInEditor.push(data.part);
		},
		close() {
			this.$emit('close', this.project);
		},
		exportProject() {
			this.$emit('export-project', this.project);
		}
	}
});