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
			provas: {
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
		this.getTurmas()
		this.getProvasBases()
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
			await this.props.requestMaterias(this.props.usuario_id)
			let index = this.props.ids.indexOf(this.state.id)
			if (index >= 0) {
				this.setState({
					materia: this.props.materias[index]
				})
			}
		}
	}

	getTurmas = async () => {
		if (!this.props.usuario_id || !this.state.id) {
			setTimeout(async () => {
				this.getTurmas()
			}, 100)
		} else {
			await this.props.requestTurmas(this.props.usuario_id, this.state.id)
		}
	}

	getProvasBases = async () => {
		if (!this.props.usuario_id || !this.state.id) {
			setTimeout(async () => {
				this.getProvasBases()
			}, 100)
		} else {
			await this.props.requestProvasBases(this.props.usuario_id, this.state.id)
		}
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
								<Tooltip title="Confirmar" onClick={this.switchEdit}>
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
									<Tooltip title="Remover">
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
							data={this.props.turmas}
							editable={{
								onRowAdd: this.state.edit ? newData =>
									new Promise(resolve => {
										setTimeout(() => {
											resolve();
											const turmas = this.state.turmas;
											turmas.data.push(newData);
											this.setState({ ...this.state, turmas });
										}, 600);
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
							columns={this.state.provas.columns}
							data={this.props.provasBases}
							editable={{
								onRowAdd: this.state.edit ? newData =>
									new Promise(resolve => {
										setTimeout(() => {
											resolve();
											const provas = this.state.provas;
											provas.data.push(newData);
											this.setState({ ...this.state, provas });
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