Vue.component('project-modal-header', {
	props: {
		headerData: {
			type: Object,
			required: true
		}
	},
	template: `<div class='project-modal-header'>
		<input v-model=headerData.project.name @keyup.enter=blur($event) type='text' />
	</div>`,
	methods: {
		blur(ev) {
			ev.target.blur();
		}
	}
});