import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, withStyles } from '@material-ui/core'

import { Aluno as AlunoModel } from '../model/aluno.model'
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

class Aluno extends BaseComponent {

	constructor(props) {
		super(props)

		this.state = {
			...this.defaultState,
		}
	}

	componentDidMount() {
		this.model = AlunoModel
		this.modelName = "aluno"
		this.propsId = this.props.match.params.alunoId
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
				this.props.match.params.turmaId,
				this.propsId
			]

			this.get()
		}
	}

	render() {

		this.Content = (
			<>
				<Grid container spacing={10}>
					<Grid item md={6}>
						{
							this.state.edit ? (
								<TextField
									required
									id="nome"
									name="nome"
									label="Nome"
									fullWidth
									value={this.state.model.nome}
									onChange={this.updateValue}
								/>
							) : (
									<div>
										<Typography variant="h6" gutterBottom>
											Nome
											</Typography>
										<Typography gutterBottom>
											{this.state.model.nome}
										</Typography>
									</div>
								)
						}

					</Grid>
					<Grid item md={6}>
						{
							this.state.edit ? (
								<TextField
									required
									multiline
									rowsMax="4"
									id="email"
									name="email"
									label="E-mail"
									fullWidth
									value={this.state.model.email}
									onChange={this.updateValue}
								/>
							) : (
									<div>
										<Typography variant="h6" gutterBottom>
											E-mail
											</Typography>
										<Typography gutterBottom>
											{this.state.model.email}
										</Typography>
									</div>
								)
						}
					</Grid>
				</Grid>
			</>
		)

		const { classes } = this.props

		return super.renderBase(classes)
	}
}

Aluno.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Aluno)