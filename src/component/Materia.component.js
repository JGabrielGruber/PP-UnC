import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, Paper, withStyles } from '@material-ui/core'

const style = theme => ({
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
			marginTop: theme.spacing(6),
			marginBottom: theme.spacing(6),
			padding: theme.spacing(3),
		},
	},
})

class Materia extends Component {

	render() {

		const {classes} = this.props

		return (
			<Paper className={classes.paper}>
				<Typography variant="h6" gutterBottom>
					Matéria - {this.props.match.params.materiaId}
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextField
							required
							id="titulo"
							name="titulo"
							label="Título"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							multiline
							rowsMax="4"
							id="descricao"
							name="descricao"
							label="Descrição"
							fullWidth
						/>
					</Grid>
				</Grid>
			</Paper>
		)
	}
}

Materia.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Materia)