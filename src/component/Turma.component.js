import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, withStyles } from '@material-ui/core'
import MaterialTable from 'material-table';

import localization from '../library/localizationMaterialTable'
import fixedTableComponents from '../library/fixedTableComponents'
import { Turma as TurmaModel } from '../model/turma.model'
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

class Turma extends BaseComponent {

	constructor(props) {
		super(props)

		this.state = {
			...this.defaultState,
			alunos: {
				columns: [
					{ title: 'Nome', field: 'nome' },
					{ title: 'E-mail', field: 'email' },
					{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
					{ title: 'Criada', field: 'timestamp', type: 'datetime' }
				],
				data: []
			},
			provas: {
				columns: [
					{ title: 'Título', field: 'titulo' },
					{ title: 'Duração(Minutos)', field: 'duracao', type: 'numeric' },
					{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
					{ title: 'Criada', field: 'timestamp', type: 'datetime' }
				],
				data: []
			}
		}
	}

	componentDidMount() {
		this.model = TurmaModel
		this.modelName = "turma"
		this.propsId = this.props.match.params.turmaId
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
			this.awaitData()
		}
	}

	awaitData = async () => {
		if (!this.state.model.timestamp) {
			setTimeout(async () => {
				this.awaitId()
			}, 100)
		} else {
			this.getData(
				this.props.requestAlunos,
				'alunos',
				'alunos'
			)
			this.getData(
				this.props.requestProvas,
				'provas',
				'provas'
			)
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
								onChange={this.updateValue}
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
								onChange={this.updateValue}
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
				<Grid item xs={12}>
					<MaterialTable
						title="Lista de Alunos"
						columns={this.state.alunos.columns}
						data={this.state.alunos.data}
						isLoading={this.props.isFetching}
						editable={{
							onRowAdd: this.state.edit ? newData =>
								new Promise(resolve => {
									this.props.updateAluno(newData).then(() => {
										resolve()
										this.get().then(() => {
											this.getData(this.props.requestAlunos, 'alunos', 'alunos')
										})
									})
								}) : null
						}}
						actions={[
							{
								icon: 'more_horiz',
								tooltip: 'Ver Aluno',
								onClick: (event, rowData) => {
									this.props.history.push(
										'/panel/materias/' + this.props.match.params.materiaId + '/turmas/' + this.state.model._id + '/provas/' + rowData._id
									)
								}
							}
						]}
						localization={localization}
						components={fixedTableComponents}
					/>
				</Grid>
				<Grid item xs={12}>
					<MaterialTable
						title="Lista de Provas"
						columns={this.state.provas.columns}
						data={this.state.provas.data}
						editable={{
							onRowAdd: this.state.edit ? newData =>
								new Promise(resolve => {
									newData.duracao = newData.duracao ? parseInt(newData.duracao) : undefined
									this.props.updateProva(newData).then(() => {
										resolve()
										this.get().then(() => {
											this.getData(this.props.requestProvas, 'provas', 'provas')
										})
									})
								}) : null
						}}
						actions={[
							{
								icon: 'more_horiz',
								tooltip: 'Ver Prova',
								onClick: (event, rowData) => {
									this.props.history.push(
										'/panel/materias/' + this.props.match.params.materiaId + '/turmas/' + this.state.model._id + '/provas/' + rowData._id
									)
								}
							}
						]}
						localization={localization}
						components={fixedTableComponents}
					/>
				</Grid>
			</>
		)

		const { classes } = this.props

		return super.renderBase(classes)
	}
}

Turma.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Turma)