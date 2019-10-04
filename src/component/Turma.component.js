import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, Paper, withStyles, Toolbar, Tooltip, IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import MaterialTable from 'material-table'

import localization from '../library/localizationMaterialTable'
import fixedTableComponents from '../library/fixedTableComponents'

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

class Turma extends Component {

	constructor(props) {
		super(props)

		this.state = {
			edit: false,
			turma: {
				_id: '',
				titulo: '',
				descricao: '',
				timeupdate: '',
				timestamp: ''
			},
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
					{ title: 'Ano', field: 'ano' },
					{ title: 'Semestre', field: 'semestre' },
					{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
					{ title: 'Criada', field: 'timestamp', type: 'datetime' }
				],
				data: []
			},
			materia_id: '',
		}
	}

	componentWillMount() {
		this.getTurma()
		this.getAlunos()
	}

	switchEdit = () => {
		this.setState({
			edit: !this.state.edit
		})
	}

	getTurma = async () => {
		let turma = this.state.turma
		turma._id = this.props.match.params.turmaId
		this.setState({ turma })
		this.setState({ materia_id: this.props.match.params.materiaId })
		if (!this.props.usuario_id || !this.state.materia_id) {
			setTimeout(async () => {
				this.getTurma()
			}, 1000)
		} else {
			await this.props.requestTurmas(this.props.usuario_id, this.state.materia_id)
			let index = this.props.ids.indexOf(this.state.turma._id)
			if (index >= 0) {
				this.setState({
					turma: this.props.turmas[index]
				})
			}
		}
	}

	getAlunos = async () => {
		if (!this.props.usuario_id || !this.state.materia_id || !this.state.turma._id) {
			setTimeout(async () => {
				this.getAlunos()
			}, 1000)
		} else {
			await this.props.requestAlunos(this.props.usuario_id, this.state.materia_id, this.state.turma._id)
		}
	}

	render() {

		const { classes } = this.props

		return (
			<Paper className={classes.paper}>
				<Toolbar>
					<Typography component="h1" variant="h5" className={classes.title}>
						Turma - {this.state.turma._id}
					</Typography>
					{
						this.state.edit ? (
							<div>
								<Tooltip title="Confirmar" onClick={this.switchEdit}>
									<IconButton>
										<CheckIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Cancelar">
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
									value={this.state.turma.titulo}
								/>
							) : (
									<div>
										<Typography variant="h6" gutterBottom>
											Título
										</Typography>
										<Typography gutterBottom>
											{this.state.turma.titulo}
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
									value={this.state.turma.descricao}
								/>
							) : (
									<div>
										<Typography variant="h6" gutterBottom>
											Descrição
										</Typography>
										<Typography gutterBottom>
											{this.state.turma.descricao}
										</Typography>
									</div>
								)
						}
					</Grid>
					<Grid item xs={12}>
						<MaterialTable
							title="Lista de Alunos"
							columns={this.state.alunos.columns}
							data={this.props.alunos}
							editable={{
								onRowAdd: this.state.edit ? newData =>
									new Promise(resolve => {
										setTimeout(() => {
											resolve();
											const alunos = this.state.alunos;
											alunos.data.push(newData);
											this.setState({ ...this.state, alunos });
										}, 600);
									}) : null
							}}
							actions={[
								{
									icon: 'more_horiz',
									tooltip: 'Ver Turma',
									onClick: (event, rowData) => {
										this.props.history.push(
											'/panel/materias/' + this.state.materia_id + '/turmas/' + this.state.turma._id + '/provas/' + rowData._id
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
									tooltip: 'Ver Turma',
									onClick: (event, rowData) => {
										this.props.history.push(
											'/panel/materias/' + this.state.materia_id + '/turmas/' + this.state.turma._id + '/provas/' + rowData._id
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

Turma.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Turma)