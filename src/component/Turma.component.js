import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, Paper, withStyles, Toolbar, Tooltip, IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import MaterialTable from 'material-table';

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
			materia: {
				titulo: 'Turma de Teste',
				descricao: 'Uma matéria criada para testes',
				timeupdate: '2019-08-08 12:12:00',
				timestamp: '2019-07-08 12:12:12'
			},
			alunos: {
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
					{ title: 'Nome', field: 'nome' },
					{ title: 'E-mail', field: 'email' },
					{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
					{ title: 'Criada', field: 'timestamp', type: 'datetime' }
				],
				data: []
			}
		}
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
				<Toolbar>
					<Typography component="h1" variant="h5" className={classes.title}>
						Turma - {this.props.match.params.materiaId}
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
									value={this.state.materia.titulo}
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
							title="Lista de Alunos"
							columns={this.state.alunos.columns}
							data={this.state.alunos.data}
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
											'/panel/materias/' + this.state.materia._id + '/turmas/' + this.state.turma._id + '/provas/' + rowData._id
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
											'/panel/materias/' + this.state.materia._id + '/turmas/' + this.state.turma._id + '/provas/' + rowData._id
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