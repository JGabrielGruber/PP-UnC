import React from 'react'
import { MTableToolbar } from 'material-table';

const fixedTableComponents = {
	Container: props => (
		<div {...props}>
		</div>
	),
	Toolbar: props => (
		<div style={{ marginLeft: -24 }}>
			<MTableToolbar {...props}>
			</MTableToolbar>
		</div>
	)
}

export default fixedTableComponents