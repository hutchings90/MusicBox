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
			if (this.hasModals && this.lastModalIsProjectModal) this.lastModal.bodyData.projects = this.projects;

			if (!this.projects.some(project => project == this.activeProject)) this.activeProject = null;
		},
		activeProject() {
			if (this.hasModals && this.lastModalIsProjectModal) this.lastModal.bodyData.activeProject = this.activeProject;
		},
		audioContext() {
			if (this.audioContext && this.projects.length < 1) this.makeNewProject();
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
			this.modals.push({
				headerText: 'Projects',
				bodyIs: 'projects-modal-body',
				bodyData: {
					projects: this.projects,
					activeProject: this.activeProject
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
				headerData: {
					project: project
				},
				bodyData: {
					project: project
				},
				triggerClose: false
			});
		},
		exportProject(project) {
			this.exportLink.href = this.exportUrl;
			this.exportLink.download = project.name + '.json';
			this.exportLink.click();
		},
		makeNewProject() {
			this.newActiveProject(new Project({
				parts: [ new Part({
					name: 'Unnamed Part',
					instrument: new Instrument(this.audioContext, Instrument.OPTIONS.music_box)
				}) ]
			}));
		},
		newActiveProject(project) {
			this.addProject(project);
			this.activeProject = project;
		},
		addProject(project) {
			this.projects.push(project);
		}
	}
});