import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	}
}))

class Dashboard extends Component {

	render() {
		return (
			<p>
				Dashboard
			</p>
		)
	}

}

export default Dashboard