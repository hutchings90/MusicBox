Vue.component('music-box-sidebar-part', {
	props: {
		part: {
			type: Part,
			required: true
		},
		isActive: {
			type: Boolean,
			default: false
		},
		shownParts: {
			type: Array,
			default: []
		}
	},
	template: `<div class='music-box-sidebar-part' :class=objectClass>
		<span v-if=isActive>&bullet;</span>
		<input ref=partName v-model=part.name @click=activate @keyup.enter=$event.target.blur() placeholder='Unnamed Part' />
		<br>
		<instrument-select
			@update-instrument=updateInstrument
			:instrument=part.instrument></instrument-select>
		<br>
		<label>
			<input type='checkbox' v-model=showInEditor />
			Show in editor
		</label>
	</div>`,
	mounted() {
		if (!this.part.name) this.$refs.partName.focus();
	},
	computed: {
		objectClass() {
			return {
				active: this.isActive
			};
		},
		showInEditor: {
			get() { return this.shownParts.some(part => part == this.part); },
			set(showInEditor) {
				this.$emit('update-show-in-editor', {
					part: this.part,
					showInEditor: showInEditor
				});
			}
		}
	},
	methods: {
		activate() {
			this.$emit('activate', this.part);
		},
		updateInstrument(instrumentName) {
			this.part.setInstrument(instrumentName);
		}
	}
});