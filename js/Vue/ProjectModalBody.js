Vue.component('project-modal-body', {
	props: {
		bodyData: {
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
				<tr v-for='part in bodyData.project.parts'>
					<td><input v-model=part.showInEditor type='checkbox'/></td>
					<td v-text=part.name></td>
					<td v-text=part.instrument.displayName></td>
				</tr>
			</tbody>
		</table>
	</div>`
});