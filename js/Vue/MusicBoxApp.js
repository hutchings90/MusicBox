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

			input.type = 'file';
			input.accept = 'application/JSON';
			input.onchange = () => this.getImportedJSON();

			return input;
		},
		fileReader() {
			let fileReader = new FileReader();

			fileReader.onload = () => this.parseImportedJSON();

			return fileReader;
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
		lastModalIsProjectModal() { return this.modals.length > 0 && this.modals[0].bodyIs == 'projects-modal-body'; }
	},
	watch: {
		projects() {
			if (this.hasModals) {
				let modal = this.modals[this.modals.length - 1];

				if (this.lastModalIsProjectModal) modal.bodyData.projects = this.projects;
			}

			if (this.projects.length < 1) this.activeProject = null;
			else if (!this.projects.some(project => this.activeProject)) this.activeProject = this.projects[this.projects.length - 1];
		},
		activeProject() {
			if (this.hasModals) {
				let modal = this.modals[this.modals.length - 1];

				if (this.lastModalIsProjectModal) modal.bodyData.activeProject = this.activeProject;
			}
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
		setActiveProject(project) {
			this.activeProject = project;
		},
		exportMusic() {
			this.exportProject(this.activeProject);
		},
		importMusic() {
			this.importElement.click();
		},
		getImportedJSON() {
			if (this.importElement.files.length > 0) this.fileReader.readAsText(this.importElement.files[0]);;
		},
		parseImportedJSON() {
			let data = JSON.parse(this.fileReader.result);
			let project = new Project({
				name: data.name,
				tempo: Number(data.tempo),
				ticksPerBeat: Number(data.ticksPerBeat),
				parts: data.parts.map(part => Part.fromObject(part, this.tonesByFrequency, this.audioContext))
			});

			this.newActiveProject(project);

			this.importElement.value = '';
		},
		exportProject(project) {
			this.exportLink.href = this.exportUrl;
			this.exportLink.download = project.name + '.json';
			this.exportLink.click();
		},
		activateProject(project) {
			this.activeProject = project;
		},
		closeProject(projectToClose) {
			projectToClose.close();

			this.projects = this.projects.filter(project => project != projectToClose);
		},
		makeNewProject(instrumentName) {
			this.newActiveProject(new Project({
				parts: [ new Part(instrumentName, this.audioContext) ]
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