// TODO: Decide whether to implement fully or remove.
Vue.component('commander', {
	props: {
		part: {
			type: Part
		},
		tick: {
			type: Number,
			required: true
		}
	},
	template: `<div class='commander'>
	</div>`
});