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
				v-for='(modalData, i) in modals'
				@emit=emitReceived
				@close=popModal
				@custom-button-clicked=customButtonClicked
				:key=i
				:show-backdrop='i == lastIndex'
				:content-data=modalData.contentData
				:custom-data=modalData.customData
				:close-on-cancel=modalData.closeOnCancel
				:close-on-submit=modalData.closeOnSubmit
				:on-close=modalData.onClose
				:on-cancel=modalData.onCancel
				:on-submit=modalData.onSubmit
				:trigger-close=modalData.triggerClose
				:trigger-cancel=modalData.triggerCancel
				:trigger-submit=modalData.triggerSubmit
				:header-is=modalData.headerIs
				:body-is=modalData.bodyIs
				:footer-is=modalData.footerIs></modal>
		</div>
	</div>`,
	created() {
		window.addEventListener('keydown', ev => this.keyHandler(ev));
		window.addEventListener('keypress', ev => this.keyHandler(ev));
	},
	data() {
		return {
			keyDownTarget: null
		};
	},
	computed: {
		hasModals() { return this.modals.length > 0; },
		activeModal() { return this.modals[this.modals.length - 1]; },
		lastIndex() { return this.modals.length - 1; }
	},
	methods: {
		emitReceived(data) {
			this.$emit('emit', data);
		},
		popModal() {
			this.modals.pop();
		},
		customButtonClicked(button) {
			this.$emit('custom-button-clicked', button);
		},
		keyHandler(ev) {
			if (!this.hasModals) return;

			switch (ev.target.tagName.toLowerCase()) {
			case 'button':
			case 'input': return;
			}

			switch (ev.keyCode) {
			case 13: // 'Enter' key submits modal if active modal submits
				if (this.activeModal.submits) this.activeModal.triggerSubmit = true;
				else this.activeModal.triggerClose = true;
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