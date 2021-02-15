new Vue({
	el: '#music-box-app',
	data() {
		return {
			audioContext: null,
			modals: [],
			projects: [],
			activeProject: null,
			selectedToneSet: {
				name: 'None',
				tones: []
			}
		};
	},
	created() {
		window.addEventListener('contextmenu', ev => this.contextMenuHandler(ev));
		window.addEventListener('keydown', ev => this.keydownHandler(ev));

		if (navigator.getUserMedia) {
			navigator.getUserMedia({
				audio: true
			}, stream => this.gotStream(stream), err => this.getStreamError(err));
		}
	},
	mounted() {
		if (this.notSecure) this.$refs.secureLink.click();
	},
	computed: {
		notSecure() { return !(window.location.href.startsWith('https://') || window.location.href.startsWith('file:///')); },
		secureHref() { return window.location.href.replace('http://', 'https://'); },
		title() { return 'Music Box' + (this.activeProject ? ' - ' + (this.activeProject.name || 'Unnamed Project') : ''); },
		hasProjects() { return this.projects.length > 0; },
		hasModals() { return this.modals.length > 0; },
		exportBlob() {
			return new Blob([ JSON.stringify(this.activeProject)], {
				type: 'text/plain;charset=utf-8'
			});
		},
		exportUrl() { return URL.createObjectURL(this.exportBlob); },
		exportLink() { return document.createElement('a'); },
		importElement() {
			let input = document.createElement('input');

			input.multiple = 'multiple';
			input.type = 'file';
			input.accept = 'application/JSON';
			input.onchange = () => this.getImportedJSON();

			return input;
		},
		toneSetOptions() { return Tone.TONE_SETS; },
		tones() { return this.audioContext ? [...this.selectedToneSet.tones].reverse() : []; },
		tonesByFrequency() {
			return Tone.TONES.reduce((reduction, tone) => {
				let frequency = tone.frequency;

				if (!reduction[frequency]) reduction[frequency] = [];

				reduction[frequency] = tone;

				return reduction;
			}, {});
		},
		lastModal() { return this.modals[this.modals.length - 1]; },
		lastModalIsProjectModal() { return this.lastModal && this.lastModal.bodyIs == 'projects-modal-body'; },
		lastModalIsCustomInstrumentModal() { return this.lastModal && this.lastModal.bodyIs == 'custom-instrument-modal-body'}
	},
	watch: {
		projects() {
			if (this.hasModals && this.lastModalIsProjectModal) this.lastModal.customData.body.projects = this.projects;

			if (!this.projects.some(project => project == this.activeProject)) this.activeProject = null;
		},
		activeProject() {
			if (this.hasModals && this.lastModalIsProjectModal) this.lastModal.customData.body.activeProject = this.activeProject;
		},
		audioContext() {
			if (this.audioContext && !this.hasProjects) this.makeProject();
		}
	},
	methods: {
		emitReceived(data) {
			this[data.action](data.data);
		},
		gotStream(stream) {
			this.audioContext = new AudioContext();
		},
		getStreamError(err) {
			console.log(err);
		},
		openProjectModal() {
			let newProjectButtonText = 'New Project';
			let importProjectButtonText = 'Import Project';

			this.modals.push({
				bodyIs: 'projects-modal-body',
				customData: {
					body: {
						projects: this.projects,
						activeProject: this.activeProject,
						instructions: 'Click "' + newProjectButtonText + '" to create a new project, or click "' + importProjectButtonText + '" to import an existing project.'
					}
				},
				contentData: {
					headerText: 'Projects',
					leftButtons: [{
						action: 'makeProject',
						text: newProjectButtonText
					}],
					rightButtons: [{
						action: 'importProject',
						text: importProjectButtonText
					}]
				},
				triggerClose: false
			});
		},
		exportMusic() {
			this.exportProject(this.activeProject);
		},
		importProject() {
			this.importElement.click();
		},
		getImportedJSON() {
			Object.values(this.importElement.files).forEach(file => {
				let fileReader = new FileReader();

				fileReader.onload = () => {
					let data = JSON.parse(fileReader.result);

					this.importElement.value = '';

					this.newActiveProject(new Project({
						name: data.name,
						tempo: Number(data.tempo),
						ticksPerBeat: Number(data.ticksPerBeat),
						parts: data.parts.map(part => new Part({
							name: part.name || '',
							notes: part.notes.map(note => new Note(note.tick, this.tonesByFrequency[note.frequency])),
							instrument: new Instrument(this.audioContext, Instrument.KEYED_ALL_OPTIONS[part.instrument.name] || {
								name: part.instrument.name || ''
							})
						}))
					}));
				};

				fileReader.readAsText(file);
			});
		},
		activateProject(project) {
			this.activeProject = project;
		},
		closeProject(projectToClose) {
			this.projects = this.projects.filter(project => project != projectToClose);

			projectToClose.close();
		},
		editProject(project) {
			this.modals.push({
				headerIs: 'modal-header-input',
				bodyIs: 'project-modal-body',
				customData: {
					header: {
						item: project,
						placeholder: 'Enter Project Name'
					},
					body: {
						project: project,
						customInstrumentOptions: Instrument.CUSTOM_OPTIONS
					}
				},
				contentData: {
					leftButtons: [{
						action: 'newPart',
						text: 'New Part',
						params: project
					}]
				},
				triggerClose: false
			});
		},
		exportProject(project) {
			this.exportLink.href = this.exportUrl;
			this.exportLink.download = project.name + '.json';
			this.exportLink.click();
		},
		makeProject() {
			this.newActiveProject(new Project({
				parts: [ new Part({
					instrument: new Instrument(this.audioContext, Instrument.KEYED_STANDARD_OPTIONS['Music Box'])
				}) ]
			}));
		},
		newActiveProject(project) {
			this.addProject(project);
			this.activeProject = project;
		},
		addProject(project) {
			this.projects.push(project);
		},
		customButtonClicked(button) {
			this[button.action](button.params);
		},
		newPart(project) {
			project.addPart(this.audioContext);
		},
		contextMenuHandler(ev) {
			ev.preventDefault();
			ev.stopPropagation();
		},
		keydownHandler(ev) {
			switch (ev.keyCode) {
			case 69:
			case 83:
				if (ev.ctrlKey) {
					ev.preventDefault();
					ev.stopPropagation();
					this.exportMusic();
				}
				break;
			}
		},
		newCustomInstrument() {
			let app = this;
			let modal = this.lastModal;
			let instrument = new Instrument(this.audioContext);

			this.modals.push({
				headerIs: 'modal-header-input',
				bodyIs: 'custom-instrument-modal-body',
				onSubmit() {
					if (!app.validateCustomInstrument(instrument)) return false;

					modal.customData.body.customInstrumentOptions = Instrument.CUSTOM_OPTIONS;

					return true;
				},
				contentData: {
					submits: true
				},
				customData: {
					header: {
						item: instrument,
						placeholder: 'Enter Instrument Name'
					},
					body: instrument
				},
				triggerSubmit: false,
				triggerCancel: false
			});
		},
		validateCustomInstrument(instrument) {
			let type = '';
			let name = instrument.name;

			if (Instrument.KEYED_STANDARD_OPTIONS[name]) type = 'standard';
			else if (Instrument.KEYED_CUSTOM_OPTIONS[name]) type = 'custom';
			else {
				Instrument.addCustomInstrument(name);
				return true;
			}

			this.modals.push({
				contentData: {
					headerText: 'Instrument Unavailable',
					bodyText: 'A ' + type + ' instrument named "' + name + '" already exists. Instruments must have a unique name.'
				},
				triggerClose: false
			});

			return false;
		},
		addPart(project) {
			project.addPart(this.audioContext);
		},
		selectToneSet(toneSet) {
			this.selectedToneSet = toneSet;
		}
	}
});