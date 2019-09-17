import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	}
}))

class Materia extends Component {

	render() {
		return (
			<p>
				Materia
			</p>
		)
	}

}

export default Materia