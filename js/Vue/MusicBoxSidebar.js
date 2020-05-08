Vue.component('music-box-sidebar', {
	props: {
		projects: {
			type: Array,
			default: []
		},
		activeProject: {
			type: Project
		},
		activePart: {
			type: Part
		},
		activeNote: {
			type: Note
		}
	},
	template: `<div class='music-box-sidebar'>
		<div>
			<div>
				Projects
				<button @click=addProject>New</button>
				<button @click=importProject>Import</button>
			</div>

			<div>
				<music-box-sidebar-project
					v-for='(project, i) in projects'
					@activate=activateProject
					@add-part=addPart
					@activate-part=activatePart
					@close=closeProject
					@export-project=exportProject
					:key=i
					:project=project
					:is-active='project == activeProject'
					:active-part=activePart></music-box-sidebar-project>
			</div>
		</div>

		<music-box-sidebar-note
			v-if=activeNote
			:note=activeNote></music-box-sidebar-note>
		</div>
	</div>`,
	methods: {
		activateProject(project) {
			this.$emit('activate-project', project);
		},
		addProject() {
			this.$emit('add-project');
		},
		importProject() {
			this.$emit('import-project');
		},
		addPart(project) {
			this.$emit('add-part', project);
		},
		activatePart(part) {
			this.$emit('activate-part', part);
		},
		closeProject(project) {
			this.$emit('close-project', project);
		},
		exportProject(project) {
			this.$emit('export-project', project);
		}
	}
});