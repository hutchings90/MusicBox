Vue.component('projects-modal-body', {
	props: {
		bodyData: {
			type: Object,
			required: true
		}
	},
	template: `<table class='projects-modal-body'>
		<tbody>
			<tr v-if=noProjects>
				<td>No projects</td>
				<td>
					<button @click=makeNewProject>New Project</button>
				</td>
			</tr>
			<projects-modal-body-project
				v-for='(project, i) in bodyData.projects'
				@export-project=exportProject
				@activate=activateProject
				@close=closeProject
				:key=i
				:project=project
				:is-active='project == bodyData.activeProject'></projects-modal-body-project>
		</tbody>
	</table>`,
	computed: {
		noProjects() { return this.bodyData.projects.length < 1; }
	},
	methods: {
		emit(action, data) {
			this.$emit('emit', {
				action: action,
				data: data
			});
		},
		exportProject(project) {
			this.emit('exportProject', project);
		},
		activateProject(project) {
			this.emit('activateProject', project);
		},
		closeProject(project) {
			this.emit('closeProject', project);
		},
		makeNewProject() {
			this.emit('makeNewProject');
		}
	}
});

Vue.component('projects-modal-body-project', {
	props: {
		project: {
			type: Project,
			required: true
		},
		isActive: {
			type: Boolean,
			default: false
		}
	},
	template: `<tr class='projects-modal-body-project'>
		<td><input v-model=project.name type='text'/></td>
		<td>
			<button @click=exportProject>Export</button>
			<button v-if=!isActive @click=activate>Activate</button>
			<button @click=close>Close</button>
		</td>
	</tr>`,
	methods: {
		emit(action) {
			this.$emit(action, this.project);
		},
		exportProject() {
			this.emit('export-project');
		},
		activate() {
			this.emit('activate');
		},
		close() {
			this.emit('close');
		}
	}
});