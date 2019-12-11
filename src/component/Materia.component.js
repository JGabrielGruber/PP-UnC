import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, withStyles } from '@material-ui/core'
import MaterialTable from 'material-table';

import localization from '../library/localizationMaterialTable'
import fixedTableComponents from '../library/fixedTableComponents'
import { Materia as MateriaModel } from '../model/materia.model'
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

class Materia extends BaseComponent {

	constructor(props) {
		super(props)

		this.state = {
			...this.defaultState,
			turmas: {
				columns: [
					{ title: 'Título', field: 'titulo' },
					{ title: 'Ano', field: 'ano', type: 'numeric' },
					{ title: 'Semestre', field: 'semestre', type: 'numeric' },
					{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
					{ title: 'Criada', field: 'timestamp', type: 'datetime' }
				],
				data: []
			},
			provas_bases: {
				columns: [
					{ title: 'Título', field: 'titulo' },
					{ title: 'Descrição', field: 'descricao' },
					{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
					{ title: 'Criada', field: 'timestamp', type: 'datetime' }
				],
				data: []
			}
		}
	}

	componentDidMount() {
		this.model = MateriaModel
		this.modelName = "matéria"
		this.propsId = this.props.match.params.materiaId
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
				this.props.requestTurmas,
				'turmas',
				'turmas'
			)
			this.getData(
				this.props.requestProvasBases,
				'provasBases',
				'provas_bases'
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
						title="Lista de Turmas"
						columns={this.state.turmas.columns}
						data={this.state.turmas.data}
						editable={{
							onRowAdd: this.state.edit ? newData =>
								new Promise(resolve => {
									newData.ano = newData.ano ? parseInt(newData.ano) : undefined
									newData.semestre = newData.semestre ? parseInt(newData.semestre) : undefined
									this.props.updateTurma(newData).then(() => {
										resolve()
										this.get().then(() => {
											this.getData(this.props.requestTurmas, 'turmas', 'turmas')
										})
									})
								}) : null
						}}
						actions={[
							{
								icon: 'more_horiz',
								tooltip: 'Ver Turma',
								onClick: (event, rowData) => {
									this.props.history.push(
										'/panel/materias/' + this.state.model._id + '/turmas/' + rowData._id
									)
								}
							}
						]}
						localization={localization}
						components={fixedTableComponents}
						isLoading={this.props.turmas_isFetching}
					/>
				</Grid>
				<Grid item xs={12}>
					<MaterialTable
						title="Lista de Provas Bases"
						columns={this.state.provas_bases.columns}
						data={this.state.provas_bases.data}
						editable={{
							onRowAdd: this.state.edit ? newData =>
								new Promise(resolve => {
									this.props.updateProvaBase(newData).then(() => {
										resolve()
										this.get().then(() => {
											this.getData(this.props.requestProvasBases, 'provasBases', 'provas_bases')
										})
									})
								}) : null
						}}
						actions={[
							{
								icon: 'more_horiz',
								tooltip: 'Ver Prova Base',
								onClick: (event, rowData) => {
									this.props.history.push(
										'/panel/materias/' + this.state.model._id + '/provas/' + rowData._id
									)
								}
							}
						]}
						localization={localization}
						components={fixedTableComponents}
						isLoading={this.props.provasBases_isFetching}
					/>
				</Grid>
			</>
		)

		const { classes } = this.props

		return super.renderBase(classes)
	}
}

Materia.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Materia)