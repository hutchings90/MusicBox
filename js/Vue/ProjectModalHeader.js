Vue.component('project-modal-header', {
	props: {
		headerData: {
			type: Object,
			required: true
		}
	},
	template: `<div class='project-modal-header'>
		<div><input v-model=headerData.project.name @keyup.enter=blur($event) type='text' /></div>
		<button @click=close class='close-button'>&#10006;</button>
	</div>`,
	methods: {
		close() {
			this.$emit('close');
		},
		blur(ev) {
			ev.target.blur();
		}
	}
});