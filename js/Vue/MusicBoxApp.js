new Vue({
	el: '#music-box-app',
	data() {
		return {
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
			this.audioContext = new AudioContext();
		},
		getStreamError(err) {
			console.log(err);
		}
	}
});