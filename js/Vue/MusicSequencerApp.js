new Vue({
	el: '#music-sequencer-app',
	data() {
		return {
			stream: null,
			audioContext: null
		};
	},
	created() {
		navigator.getUserMedia({
			audio: true
		}, stream => this.gotStream(stream), err => this.getStreamError(err));
	},
	methods: {
		gotStream(stream) {
			this.stream = stream;
			this.audioContext = new AudioContext();
		},
		getStreamError(err) {
			console.log(err);
		}
	}
});