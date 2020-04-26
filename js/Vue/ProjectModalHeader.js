Vue.component('project-modal-header', {
	props: {
		sectionData: {
			type: Project,
			required: true
		}
	},
	template: `<div class='project-modal-header'>
		<div><input ref='projectNameInput' v-model=project.name @keyup.enter=$event.target.blur() type='text' placeholder='Enter Project Name'/></div>
		<button @click=close class='close-button'>&#10006;</button>
	</div>`,
	mounted() {
		if (!this.project.name) this.$refs.projectNameInput.focus();
	},
	computed: {
		project() { return this.sectionData; }
	},
	methods: {
		close() {
			this.$emit('close');
		}
	}
});