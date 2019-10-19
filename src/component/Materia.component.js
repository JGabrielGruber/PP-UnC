import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, Paper, withStyles, Toolbar, Tooltip, IconButton, Snackbar } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import MaterialTable from 'material-table';

import localization from '../library/localizationMaterialTable'
import fixedTableComponents from '../library/fixedTableComponents'
import { Materia as MateriaModel } from '../model/materia.model'

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

class Materia extends Component {

	constructor(props) {
		super(props)

		this.state = {
			edit: false,
			materia: MateriaModel(),
			id: "",
			turmas: {
				columns: [
					{ title: 'Título', field: 'titulo' },
					{ title: 'Ano', field: 'ano' },
					{ title: 'Semestre', field: 'semestre' },
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

	componentWillMount() {
		this.getMateria()
		this.awaitData()
	}

	getMateria = async () => {
		this.setState({
			id: this.props.match.params.materiaId
		})
		if (!this.props.usuario_id || !this.state.id) {
			setTimeout(async () => {
				this.getMateria()
			}, 100)
		} else {
			await this.props.requestMaterias(this.props.usuario_id, this.state.id)
			let index = this.props.ids.indexOf(this.state.id)
			if (index >= 0) {
				this.setState({
					materia: this.props.materias[index]
				})
			}
		}
		return {}
	}

	awaitData = async () => {
		if (!this.props.usuario_id || !this.state.id || !this.state.materia._id) {
			setTimeout(async () => {
				this.awaitData()
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

	getData = async (caller, propsSlug, stateSlug) => {
		return caller(this.props.usuario_id, this.state.id).then(() => {

			let list = []
			let item
			for (item of this.state.materia[stateSlug]) {
				item = this.props[propsSlug][this.props[propsSlug + "_ids"].indexOf(item._id)]
				if (item) {
					list.push(item)
				}
			}
			let data = this.state[stateSlug]
			data.data = list
			this.setState({
				[stateSlug]: data
			})
		})
	}

	updateValue = (event) => {
		let materia = this.state.materia
		materia[event.target.id] = event.target.value
		this.setState({
			...this.state, materia
		})
	}

	switchEdit = () => {
		this.setState({
			edit: !this.state.edit
		})
	}

	updateMateria = () => {
		this.props.updateMateria(this.state.materia)
		this.switchEdit()
	}

	removeMateria = () => {
		this.props.deleteMateria(this.state.materia)
		this.props.history.push(
			'/panel/materias/'
		)
	}

	render() {

		const { classes } = this.props

		return (
			<Paper className={classes.paper}>
				<Snackbar open={this.props.isFetching} message="Carregando matéria...">
				</Snackbar>
				<Toolbar>
					<Typography component="h1" variant="h5" className={classes.title}>
						Matéria - {this.props.match.params.materiaId}
					</Typography>
					{
						this.state.edit ? (
							<div>
								<Tooltip title="Confirmar" onClick={this.updateMateria}>
									<IconButton>
										<CheckIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Cancelar" onClick={() => {
									this.switchEdit()
									this.getMateria()
								}}>
									<IconButton>
										<CloseIcon />
									</IconButton>
								</Tooltip>
							</div>
						) : (
								<div>
									<Tooltip title="Editar" onClick={this.switchEdit}>
										<IconButton>
											<EditIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Remover" onClick={this.removeMateria}>
										<IconButton>
											<DeleteIcon />
										</IconButton>
									</Tooltip>
								</div>
							)
					}
				</Toolbar>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						{
							this.state.edit ? (
								<TextField
									required
									id="titulo"
									name="titulo"
									label="Título"
									fullWidth
									value={this.state.materia.titulo}
									onChange={this.updateValue}
								/>
							) : (
									<div>
										<Typography variant="h6" gutterBottom>
											Título
										</Typography>
										<Typography gutterBottom>
											{this.state.materia.titulo}
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
									value={this.state.materia.descricao}
									onChange={this.updateValue}
								/>
							) : (
									<div>
										<Typography variant="h6" gutterBottom>
											Descrição
										</Typography>
										<Typography gutterBottom>
											{this.state.materia.descricao}
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
										this.props.updateTurma(newData).then(() => {
											resolve()
											this.getMateria().then(() => {
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
											'/panel/materias/' + this.state.materia._id + '/turmas/' + rowData._id
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
							title="Lista de Provas Bases"
							columns={this.state.provas_bases.columns}
							data={this.state.provas_bases.data}
							editable={{
								onRowAdd: this.state.edit ? newData =>
									new Promise(resolve => {
										setTimeout(() => {
											resolve();
											const provas_bases = this.state.provas_bases;
											provas_bases.data.push(newData);
											this.setState({ ...this.state, provas_bases });
										}, 600);
									}) : null
							}}
							actions={[
								{
									icon: 'more_horiz',
									tooltip: 'Ver Prova Base',
									onClick: (event, rowData) => {
										this.props.history.push(
											'/panel/materias/' + this.state.materia._id + '/provas/' + rowData._id
										)
									}
								}
							]}
							localization={localization}
							components={fixedTableComponents}
						/>
					</Grid>
				</Grid>
			</Paper >
		)
	}
}

Materia.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Materia)