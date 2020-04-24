Vue.component('projects-modal-body', {
	props: {
		bodyData: {
			type: Object,
			required: true
		}
	},
	template: `<div class='projects-modal-body'>
		<table>
			<tbody>
				<tr v-if=noProjects>
					<td>No projects</td>
					<td>
						<button @click=makeNewProject>New Project</button>
					</td>
				</tr>
				<projects-modal-body-project
					v-for='(project, i) in bodyData.projects'
					@activate=activateProject
					@close=closeProject
					@edit=editProject
					@export-project=exportProject
					@copy=copyProject
					:key=i
					:project=project
					:is-active='project == bodyData.activeProject'></projects-modal-body-project>
			</tbody>
		</table>
	</div>`,
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
		}
	},
	template: `<tr class='projects-modal-body-project'>
		<td>
			<template><span :class=checkClass>&#10004;</span></template>
			<input v-model=project.name @keyup.enter='blur($event)' type='text'/>
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
	computed: {
		checkClass() {
			return {
				'active-check-mark': true,
				'hide-in-plain-sight': !this.isActive
			};
		}
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
		},
		blur(ev) {
			ev.target.blur();
		}
	}
});