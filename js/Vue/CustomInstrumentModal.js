Vue.component('custom-instrument-modal-body', {
	props: {
		sectionData: {
			type: Instrument,
			required: true
		}
	},
	template: `<div class='custom-instrument-modal-body'>
	</div>`,
	computed: {
		instrument() { return this.sectionData; }
	}
});