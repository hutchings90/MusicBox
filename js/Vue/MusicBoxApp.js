new Vue({
	el: '#music-box-app',
	data() {
		return {
			audioContext: null,
			modals: [],
			projects: [],
			activeProject: null
		};
	},
	created() {
		navigator.getUserMedia({
			audio: true
		}, stream => this.gotStream(stream), err => this.getStreamError(err));
	},
	computed: {
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
		tones() { return this.audioContext ? [...Tone.TONES].reverse() : []; },
		tonesByFrequency() {
			return this.tones.reduce((reduction, tone) => {
				let frequency = tone.frequency;

				if (!reduction[frequency]) reduction[frequency] = [];

				reduction[frequency] = tone;

				return reduction;
			}, {});
		},
		lastModal() { return this.modals[this.modals.length - 1]; },
		lastModalIsProjectModal() { return this.lastModal && this.lastModal.bodyIs == 'projects-modal-body'; }
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
			if (this.audioContext && !this.hasProjects) {
				this.makeProject();
				this.openProjectModal();
			}
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
			let newProjectButtonText = 'New';
			let importProjectButtonText = 'Import';

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
						action: 'importMusic',
						text: importProjectButtonText
					}]
				},
				triggerClose: false
			});
		},
		exportMusic() {
			this.exportProject(this.activeProject);
		},
		importMusic() {
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
							name: part.name,
							notes: part.notes.map(note => new Note(note.tick, this.tonesByFrequency[note.frequency])),
							instrument: new Instrument(this.audioContext, Instrument.OPTIONS[part.instrument.name])
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
				headerText: project.name,
				headerIs: 'project-modal-header',
				bodyIs: 'project-modal-body',
				customData: {
					header: project,
					body: project
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
					instrument: new Instrument(this.audioContext, Instrument.OPTIONS['Music Box'])
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
		}
	}
});