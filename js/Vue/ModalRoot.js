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
				@untrigger-close=untriggerClose(modalData)
				@untrigger-cancel=untriggerCancel(modalData)
				@untrigger-submit=untriggerSubmit(modalData)
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
		lastIndex() { return this.modals.length - 1; },
		lastModal() { return this.modals[this.lastIndex]; }
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

			switch (ev.keyCode) {
			case 13: // 'Enter' key submits modal if active modal submits, unless a button or input had focus.
				if (this.inputIgnoredBySubmit(ev)) return;

				if (this.lastModal.contentData.submits) this.lastModal.triggerSubmit = true;
				else this.lastModal.triggerClose = true;
				break;
			case 27: // 'Escape' key closes modal if active modal submits, closes otherwise.
				if (this.inputIgnoredBySubmit(ev)) return;

				if (this.lastModal.contentData.submits) this.lastModal.triggerCancel = true;
				else this.lastModal.triggerClose = true;
				break;
			default: return; // Return to avoid calls to preventDefault and stopPropagation.
			}

			ev.preventDefault();
			ev.stopPropagation();
		},
		inputIgnoredBySubmit(ev) {
			switch (ev.target.tagName.toLowerCase()) {
			case 'button':
			case 'input': return true;
			}

			return false;
		},
		untriggerClose(modalData) {
			modalData.triggerClose = false;
		},
		untriggerCancel(modalData) {
			modalData.triggerCancel = false;
		},
		untriggerSubmit(modalData) {
			modalData.triggerSubmit = false;
		}
	}
});