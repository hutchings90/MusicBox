Vue.component('modal', {
	props: {
		showBackdrop: {
			type: Boolean,
			default: true
		},
		contentData: {
			type: Object,
			default: () => { return {}; }
		},
		customData: {
			type: Object,
			default: () => { return {}; }
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
			default: 'modal-header-default'
		},
		bodyIs: {
			type: String,
			default: 'modal-body-default'
		},
		footerIs: {
			type: String,
			default: 'modal-footer-default'
		}
	},
	template: `<div class='modal'>
		<div v-show=showBackdrop @click=close class='backdrop'></div>
		<div class='display-container'>
			<slot name=header>
				<div
					class='header'
					@close=close
					:is=headerIs
					:section-data=customData.header
					:text=contentData.headerText></div>
			</slot>
			<slot name=body>
				<div
					class='body'
					@emit=emitReceived
					:is=bodyIs
					:section-data=customData.body
					:text=contentData.bodyText></div>
			</slot>
			<slot name=footer>
				<div
					class='footer'
					@close=close
					@cancel=cancel
					@submit=submit
					@custom-button-clicked=customButtonClicked
					:is=footerIs
					:done-text=contentData.doneText
					:submit-text=contentData.submitText
					:cancel-text=contentData.cancelText
					:submits=contentData.submits
					:section-data=customData.footer
					:left-buttons=contentData.leftButtons
					:right-buttons=contentData.rightButtons></div>
			</slot>
		</div>
	</div>`,
	watch: {
		triggerClose() {
			if (this.triggerClose) this.close();
		},
		triggerCancel() {
			if (this.triggerCancel) this.cancel();
		},
		triggerSubmit() {
			if (this.triggerSubmit) this.submit();
		}
	},
	methods: {
		emitReceived(data) {
			this.$emit('emit', data);
		},
		close() {
			if (this.onClose && false === this.onClose()) {
				this.$emit('untrigger-close');
				return;
			}

			this.$emit('close');
		},
		cancel() {
			if (this.onCancel && false === this.onCancel()) {
				this.$emit('untrigger-cancel');
				return;
			}

			if (this.closeOnCancel) this.close();
		},
		submit() {
			if (this.onSubmit && false === this.onSubmit()) {
				this.$emit('untrigger-submit');
				return;
			}

			if (this.closeOnSubmit) this.close();
		},
		customButtonClicked(button) {
			this.$emit('custom-button-clicked', button);
		}
	}
});

Vue.component('modal-header-default', {
	props: {
		text: {
			type: String,
			default: 'Notice'
		}
	},
	template: `<div class='default'>
		<div><strong v-text=text></strong></div>
		<button @click=close class='close-button'>&#10006;</button>
	</div>`,
	methods: {
		close() {
			this.$emit('close');
		}
	}
});

Vue.component('modal-body-default', {
	props: {
		text: {
			type: String
		}
	},
	template: `<div class='default'>
		<div v-text=text></div>
	</div>`
});

Vue.component('modal-footer-default', {
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
		},
		leftButtons: {
			type: Array,
			default: () => []
		},
		rightButtons: {
			type: Array,
			default: () => []
		}
	},
	template: `<div class='default'>
		<modal-footer-custom-buttons
			@button-clicked=customButtonClicked
			:buttons=leftButtons></modal-footer-custom-buttons>

		<div class='primary-buttons'>
			<template v-if=submits>
				<button @click=cancel v-text=cancelText class='danger'></button>
				<button @click=submit v-text=submitText class='submit'></button>
			</template>
			<button v-else @click=close v-text=doneText class='done'></button>
		</div>
		<modal-footer-custom-buttons
			@button-clicked=customButtonClicked
			:buttons=rightButtons></modal-footer-custom-buttons>
		</div>
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
		},
		customButtonClicked(button) {
			this.$emit('custom-button-clicked', button);
		}
	}
});

Vue.component('modal-footer-custom-buttons', {
	props: {
		buttons: {
			type: Array,
			default: []
		}
	},
	template: `<div class='modal-footer-custom-buttons'>
		<button
			v-for='button in buttons'
			v-text=button.text
			@click=buttonClicked(button)
			:class=button.class></button>
	</div>`,
	methods: {
		buttonClicked(button) {
			this.$emit('button-clicked', button)
		}
	}
});

Vue.component('modal-header-input', {
	props: {
		sectionData: {
			type: Object,
			required: true
		}
	},
	template: `<modal-header-input-renderer
		@close=close
		:item=sectionData.item
		:prop-name=sectionData.propName
		:placeholder=sectionData.placeholder
		:onChange=sectionData.onChange></modal-header-input-renderer>`,
	methods: {
		close() {
			this.$emit('close');
		}
	}
});

Vue.component('modal-header-input-renderer', {
	props: {
		item: {
			type: Object,
			required: true
		},
		propName: {
			type: String,
			default: 'name'
		},
		placeholder: {
			type: String,
			default: 'Enter Name'
		},
		onChange: {
			type: Function
		}
	},
	template: `<div class='modal-header-input'>
		<div><input ref='nameInput' v-model=value @change=changed @keyup.enter=$event.target.blur() type='text' :placeholder=placeholder /></div>
		<button @click=close class='close-button'>&#10006;</button>
	</div>`,
	mounted() {
		if (!this.value) this.$refs.nameInput.focus();
	},
	computed: {
		value: {
			get() { return this.item[this.propName]; },
			set(value) { this.item[this.propName] = value; }
		}
	},
	methods: {
		close() {
			this.$emit('close');
		},
		changed() {
			if (this.onChange) this.onChange();
		}
	}
});