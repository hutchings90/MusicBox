// TODO: Slots and :is?
Vue.component('modal-root', {
	props: {
		modals: {
			type: Array,
			required: true
		}
	},
	template: `<div v-show=hasModals class='modal-root'>
		<div class='modal-sticker'>
			<modal
				v-for='(modal, i) in modals'
				@emit=emitReceived
				@close=popModal
				:key=i
				:show-backdrop='i + 1 == modals.length'
				:header-text=modal.headerText
				:body-text=modal.bodyText
				:done-text=modal.doneText
				:submit-text=modal.submitText
				:cancel-text=modal.cancelText
				:submits=modal.submits
				:close-on-cancel=modal.closeOnCancel
				:close-on-submit=modal.closeOnSubmit
				:on-close=modal.onClose
				:on-cancel=modal.onCancel
				:on-submit=modal.onSubmit
				:trigger-close=modal.triggerClose
				:trigger-cancel=modal.triggerCancel
				:trigger-submit=modal.triggerSubmit
				:header-is=modal.headerIs
				:body-is=modal.bodyIs
				:footer-is=modal.footerIs
				:header-data=modal.headerData
				:body-data=modal.bodyData
				:footer-data=modal.footerData></modal>
		</div>
	</div>`,
	created() {
		window.addEventListener('keydown', ev => this.keyHandler(ev));
		window.addEventListener('keypress', ev => this.keyHandler(ev));
	},
	computed: {
		hasModals() { return this.modals.length > 0; },
		activeModal() { return this.modals[this.modals.length - 1]; }
	},
	methods: {
		emitReceived(data) {
			this.$emit('emit', data);
		},
		popModal() {
			this.modals.pop();
		},
		keyHandler(ev) {
			if (!this.hasModals) return;

			switch (ev.keyCode) {
			case 13: // 'Enter' key submits modal if active modal submits
				if (this.activeModal.submits) this.activeModal.triggerSubmit = true;
				break;
			case 27: // 'Escape' key closes modal if active modal submits, closes otherwise
				if (this.activeModal.submits) this.activeModal.triggerCancel = true;
				else this.activeModal.triggerClose = true;
				break;
			default: return; // Return to avoid calls to preventDefault and stopPropagation.
			}

			ev.preventDefault();
			ev.stopPropagation();
		}
	}
});