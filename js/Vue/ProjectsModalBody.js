Vue.component('projects-modal-body', {
	props: {
		sectionData: {
			type: Object,
			required: true
		}
	},
	template: `<div class='projects-modal-body'>
		<table>
			<tbody>
				<template v-if=noProjects>
					<tr class='instructions'>
						<td colspan=2 v-text=sectionData.instructions></td>
					</tr>
				</template>
				<projects-modal-body-project
					v-for='(project, i) in sectionData.projects'
					@activate=activateProject
					@close=closeProject
					@edit=editProject
					@export-project=exportProject
					@copy=copyProject
					:key=i
					:project=project
					:is-active='project == sectionData.activeProject'
					:is-last='i == lastIndex'></projects-modal-body-project>
			</tbody>
		</table>
	</div>`,
	computed: {
		noProjects() { return this.sectionData.projects.length < 1; },
		lastIndex() { return this.sectionData.projects.length - 1; }
	},
	methods: {
		emit(action, data) {
			this.$emit('emit', {
				action: action,
				data: data
			});
		},
		makeNewProject() {
			this.emit('makeNewProject');
		},
		activateProject(project) {
			this.emit('activateProject', project);
		},
		closeProject(project) {
			this.emit('closeProject', project);
		},
		editProject(project) {
			this.emit('editProject', project);
		},
		exportProject(project) {
			this.emit('exportProject', project);
		},
		copyProject(project) {
			this.emit('addProject', project.copy());
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
		},
		isLast: {
			type: Boolean,
			default: false
		}
	},
	template: `<tr class='projects-modal-body-project'>
		<td>
			<template><span :class=checkClass>&#10004;</span></template>
			<input ref='nameInput' v-model=project.name @keyup.enter=$event.target.blur() type='text' placeholder='Enter Project Name'/>
		</td>
		<td>
			<div>
				<button v-if=!isActive @click=activate class='activate-button'>Activate</button>
				<button @click=close class='close-button'>Close</button>
				<button @click=edit class='edit-button'>Edit</button>
			</div>
			<div>
				<button @click=exportProject class='export-button'>Export</button>
				<button @click=copy class='copy-button'>Copy</button>
				<button @click=clear class='clear-button'>Clear</button>
			</div>
		</td>
	</tr>`,
	mounted() {
		if (this.autofocus) this.$refs.nameInput.focus();
	},
	computed: {
		checkClass() {
			return {
				'active-check-mark': true,
				'hide-in-plain-sight': !this.isActive
			};
		},
		autofocus() { return this.isLast && this.isActive && !this.project.name; }
	},
	methods: {
		emit(action) {
			this.$emit(action, this.project);
		},
		activate() {
			this.emit('activate');
		},
		close() {
			this.emit('close');
		},
		edit() {
			this.emit('edit');
		},
		exportProject() {
			this.emit('export-project');
		},
		copy() {
			this.emit('copy');
		},
		clear() {
			this.project.clear();
		}
	}
});