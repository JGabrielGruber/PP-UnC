import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, withStyles } from '@material-ui/core'

import { ProvaBase as ProvaBaseModel } from '../model/provaBase.model'
import BaseComponent from './Base.component'

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
	title: {
		flexGrow: 1,
	},
})

class ProvaBase extends BaseComponent {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.model = ProvaBaseModel
		this.modelName = "prova base"
		this.propsId = this.props.match.params.provaBaseId
		this.awaitId()
	}

	awaitId = () => {
		if (!this.props.usuario_id) {
			setTimeout(async () => {
				this.awaitId()
			}, 100)
		} else {
			this.args = [
				this.props.usuario_id,
				this.props.match.params.materiaId,
				this.propsId
			]

			this.get()
		}
	}

	render() {

		this.Content = (
			<>
				<Grid item xs={12}>
					{
						this.state.edit ? (
							<TextField
								required
								id="titulo"
								name="titulo"
								label="Título"
								fullWidth
								value={this.state.model.titulo}
							/>
						) : (
								<div>
									<Typography variant="h6" gutterBottom>
										Título
										</Typography>
									<Typography gutterBottom>
										{this.state.model.titulo}
									</Typography>
								</div>
							)
					}

				</Grid>
				<Grid item xs={12}>
					{
						this.state.edit ? (
							<TextField
								required
								multiline
								rowsMax="4"
								id="descricao"
								name="descricao"
								label="Descrição"
								fullWidth
								value={this.state.model.descricao}
							/>
						) : (
								<div>
									<Typography variant="h6" gutterBottom>
										Descrição
										</Typography>
									<Typography gutterBottom>
										{this.state.model.descricao}
									</Typography>
								</div>
							)
					}
				</Grid>
			</>
		)

		const { classes } = this.props

		return super.renderBase(classes)
	}
}

ProvaBase.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(ProvaBase)