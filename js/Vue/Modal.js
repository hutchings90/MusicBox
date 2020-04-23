Vue.component('modal', {
	props: {
		showBackdrop: {
			type: Boolean,
			default: true
		},
		headerText: {
			type: String
		},
		bodyText: {
			type: String
		},
		doneText: {
			type: String
		},
		submitText: {
			type: String
		},
		cancelText: {
			type: String
		},
		submits: {
			type: Boolean,
			default: false
		},
		closeOnCancel: {
			type: Boolean,
			default: true
		},
		closeOnSubmit: {
			type: Boolean,
			default: true
		},
		onClose: {
			type: Function
		},
		onCancel: {
			type: Function
		},
		onSubmit: {
			type: Function
		},
		triggerClose: {
			type: Boolean,
			default: false
		},
		triggerCancel: {
			type: Boolean,
			default: false
		},
		triggerSubmit: {
			type: Boolean,
			default: false
		},
		headerIs: {
			type: String,
			default: 'default-modal-header'
		},
		bodyIs: {
			type: String,
			default: 'default-modal-body'
		},
		footerIs: {
			type: String,
			default: 'default-modal-footer'
		},
		headerData: {
			type: Object,
			default: () => { return {}; }
		},
		bodyData: {
			type: Object,
			default: () => { return {}; }
		},
		footerData: {
			type: Object,
			default: () => { return {}; }
		}
	},
	template: `<div class='modal'>
		<div v-show=showBackdrop @click=close class='backdrop'></div>
		<div class='display-container'>
			<slot name=header>
				<div
					@close=close
					:is=headerIs
					:header-data=headerData></div>
			</slot>
			<slot name=body>
				<div
					@emit=emitReceived
					:is=bodyIs
					:body-data=bodyData></div>
			</slot>
			<slot name=footer>
				<div
					@close=close
					@cancel=cancel
					@submit=submit
					:is=footerIs
					:submits=submits
					:footer-data=footerData></div>
			</slot>
		</div>
	</div>`,
	watch: {
		triggerClose() {
			this.close();
		},
		triggerCancel() {
			this.cancel();
		},
		triggerSubmit() {
			this.submit();
		},
	},
	methods: {
		emitReceived(data) {
			this.$emit('emit', data);
		},
		close() {
			if (this.onClose) this.onClose();

			this.$emit('close');
		},
		cancel() {
			if (this.onCancel) this.onCancel();
			if (this.closeOnCancel) this.close();
		},
		submit() {
			if (this.onSubmit) this.onSubmit();
			if (this.closeOnSubmit) this.close();
		}
	}
});

Vue.component('default-modal-header', {
	props: {
		headerText: {
			type: String,
			default: 'Notice'
		}
	},
	template: `<div class='header'>
		<div><strong v-text=headerText></strong></div>
		<button @click=close class='close-button'>&#10006;</button>
	</div>`,
	methods: {
		close() {
			this.$emit('close');
		}
	}
});

Vue.component('default-modal-body', {
	props: {
		bodyText: {
			type: String
		}
	},
	template: `<div class='body'>
		<div v-text=bodyText></div>
	</div>`
});

Vue.component('default-modal-footer', {
	props: {
		doneText: {
			type: String,
			default: 'Done'
		},
		submitText: {
			type: String,
			default: 'Submit'
		},
		cancelText: {
			type: String,
			default: 'Cancel'
		},
		submits: {
			type: Boolean,
			default: false
		}
	},
	template: `<div class='footer'>
		<template v-if=submits>
			<button @click=cancel v-text=cancelText></button>
			<button @click=submit v-text=submitText></button>
		</template>
		<button v-else @click=close v-text=doneText></button>
	</div>`,
	methods: {
		close() {
			this.$emit('close');
		},
		cancel() {
			this.$emit('cancel');
		},
		submit() {
			this.$emit('submit');
		}
	}
});