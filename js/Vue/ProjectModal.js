Vue.component('project-modal-body', {
	props: {
		sectionData: {
			type: Object,
			required: true
		}
	},
	template: `<div class='project-modal-body'>
		<table>
			<thead>
				<tr>
					<th>Show in Editor</th>
					<th>Name</th>
					<th>Instrument</th>
				</tr>
			</thead>
			<tbody>
				<project-modal-body-part
					v-for='(part, i) in sectionData.project.parts'
					@update-show-in-editor=updateShowInEditor
					@new-custom-instrument=newCustomInstrument
					:key=i
					:is-last='i == lastPartIndex'
					:project-has-name=projectHasName
					:part=part
					:initial-show-in-editor=partShownInEditor(part)
					:custom-instrument-options=sectionData.customInstrumentOptions></project-modal-body-part>
			</tbody>
		</table>
	</div>`,
	computed: {
		project() { return this.sectionData.project; },
		projectHasName() { return Boolean(this.project.name); },
		lastPartIndex() { return this.project.parts.length - 1; },
		partsShownInEditor() { return this.project.settings.partsShownInEditor; }
	},
	methods: {
		partShownInEditor(part) {
			return Boolean(this.partsShownInEditor.some(partShownInEditor => part == partShownInEditor));
		},
		findShownPartIndex(part) {
			return this.partsShownInEditor.findIndex(partShownInEditor => part == partShownInEditor);
		},
		updateShowInEditor(part) {
			let i = this.findShownPartIndex(part);

			if (i != -1) this.partsShownInEditor.splice(i, 1);
			else this.partsShownInEditor.push(part);
		},
		newCustomInstrument() {
			this.$emit('emit', {
				action: 'newCustomInstrument'
			});
		}
	}
});

Vue.component('project-modal-body-part', {
	props: {
		projectHasName: {
			type: Boolean,
			default: true
		},
		isLast: {
			type: Boolean,
			default: false
		},
		part: {
			type: Part,
			required: true
		},
		initialShowInEditor: {
			type: Boolean,
			default: true
		},
		customInstrumentOptions: {
			type: Array,
			default: []
		}
	},
	template: `<tr class='project-modal-body-part'>
		<td><input @change=updateShowInEditor v-model=showInEditor type='checkbox'/></td>
		<td><input ref=partNameInput v-model=part.name @keyup.enter=$event.target.blur() placeholder='Enter Part Name' /></td>
		<td>
			<select v-model=instrumentName>
				<optgroup label='Standard'>
					<option v-for='option in standardInstrumentOptions' v-text=option.name @change=updateInstrument>></option>
				</optgroup>
				<optgroup label='Custom'>
					<option>New Custom Instrument</option>
					<option v-for='option in customInstrumentOptions' v-text=option.name @change=updateInstrument>></option>
				</optgroup>
			</select>
		</td>
	</tr>`,
	mounted() {
		if (this.isLast && this.projectHasName && !this.part.name) this.$refs.partNameInput.focus();
	},
	data() {
		return {
			instrumentName: this.part.instrument.name,
			showInEditor: this.initialShowInEditor,
			creatingCustomInstrument: false
		};
	},
	computed: {
		standardInstrumentOptions() { return Instrument.STANDARD_OPTIONS; },
		hasCustomInstrumentOptions() { return this.customInstrumentOptions.length > 0; },
		lastCustomInstrumentOptionIndex() { return this.customInstrumentOptions.length - 1; }
	},
	watch: {
		customInstrumentOptions() {
			if (this.creatingCustomInstrument && this.hasCustomInstrumentOptions) this.instrumentName = this.customInstrumentOptions[this.lastCustomInstrumentOptionIndex].name;
		},
		instrumentName() {
			this.updateInstrument();
		}
	},
	methods: {
		updateShowInEditor() {
			this.$emit('update-show-in-editor', this.part);
		},
		updateInstrument() {
			if (this.instrumentName == 'New Custom Instrument') {
				this.creatingCustomInstrument = true;
				this.$emit('new-custom-instrument');
			}
			else {
				this.creatingCustomInstrument = false;
				this.part.setInstrument(this.instrumentName);
			}
		}
	}
});