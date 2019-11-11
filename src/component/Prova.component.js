import React from 'react'
import PropTypes from 'prop-types'
import {
	Typography, Grid, TextField,
	withStyles, Dialog, DialogContent,
	DialogTitle, Tooltip, IconButton,
	Toolbar, InputLabel, MenuItem, Input,
	DialogActions, Button, Select, FormControl
} from '@material-ui/core'
import MaterialTable from 'material-table'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import VisibilityIcon from '@material-ui/icons/Visibility'
import FileCopyIcon from '@material-ui/icons/FileCopy'

import { Prova as ProvaModel } from '../model/prova.model'
import { Questao as QuestaoModel } from '../model/questao.model'
import localization from '../library/localizationMaterialTable'
import fixedTableComponents from '../library/fixedTableComponents'
import BaseComponent from './Base.component'
import Questao from './Questao.component'
import Formulario from './Formulario.component'

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
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
})

class Prova extends BaseComponent {

	constructor(props) {
		super(props)

		this.state = {
			...this.defaultState,
			questoes: {
				columns: [
					{ title: 'Número', field: 'numero' },
					{ title: 'Descrição', field: 'descricao' },
					{ title: 'Peso', field: 'peso' },
				],
				data: []
			},
			questao: QuestaoModel(),
			modal: false,
			preview: false,
			base: false,
			provaBaseSelecionada: '',
			provasBases: null,
			materia: {}
		}
	}

	componentDidMount() {
		this.model = ProvaModel
		this.modelName = "prova"
		this.propsId = this.props.match.params.provaId
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

	get = async () => {
		if (!this.props.usuario_id || !this.state.model._id) {
			let model = this.model()
			model._id = this.propsId
			this.setState({
				model: model
			})
			setTimeout(async () => {
				this.get()
			}, 100)
		} else {
			await this.props.request(...this.args)
			let index = this.props.ids.indexOf(this.state.model._id)
			if (index >= 0) {
				await this.setState({
					model: this.props.models[index]
				})
				this.handleSort()
			}
		}
	}

	handleOpen = (questao = null) => {
		this.setState({
			modal: true,
			questao: (questao ? questao : QuestaoModel())
		})
	}

	handleClose = object => event => {
		this.setState({
			[object]: false
		})
	}

	handleAdd = questao => event => {
		this.handleClose('modal')
		let questoes = this.state.model.questoes ? this.state.model.questoes : []
		let index = this.state.questoes.data.indexOf(questao)
		if (index >= 0) {
			questoes.splice(index, 1)
			questao.tableData = undefined
			questoes.push(questao)
		} else {
			questoes.push(questao)
		}
		let model = this.state.model
		model.questoes = questoes
		this.setState({
			model
		})
		this.setState({
			modal: false
		})
		this.handleSort()
	}

	handleSort = async () => {
		let questoes = this.state.model.questoes
		questoes.sort(function (a, b) {
			if (a.numero < b.numero) return -1;
			if (a.numero > b.numero) return 1;
			return 0;
		})
		let model = this.state.model
		this.setState({
			model
		})
		questoes = this.state.questoes
		questoes.data = JSON.parse(JSON.stringify(this.state.model.questoes))
		this.setState({
			questoes
		})
	}

	handleChange = attr => event => {
		this.setState({
			[attr]: event.target.value
		})
	}

	openProvaBase = event => {
		this.getProvasBases()
		this.setState({ base: true })
	}

	getProvasBases = async () => {
		if (!this.state.provasBases) {
			await this.props.requestMaterias(this.props.usuario_id)
			let index = this.props.materias_ids.indexOf(this.props.match.params.materiaId)
			if (index >= 0) {
				await this.setState({
					materia: this.props.materias_models[index]
				})
			}

			await this.props.requestProvasBases(this.props.usuario_id, this.props.match.params.materiaId)
			let list = []
			let item
			for (item of this.state.materia.provas_bases) {
				item = this.props.provasBases_models[this.props.provasBases_ids.indexOf(item._id)]
				if (item) {
					list.push(item)
				}
			}
			this.setState({
				provasBases: list
			})
		}
	}

	copyProvaBase = async event => {
		let model = this.state.model
		var questoes = this.state.questoes, questoesProvaBase = []
		await this.props.requestProvasBases(this.props.usuario_id, this.props.match.params.materiaId, this.state.provaBaseSelecionada)
		let prova = this.props.provasBases_models[this.props.provasBases_ids.indexOf(this.state.provaBaseSelecionada)]

		if (prova) {
			model.titulo = prova.titulo
			model.descricao = prova.descricao
			let questao
			for (questao of prova.questoes) {
				questao._id = undefined
				questoesProvaBase.push(questao)
			}
			model.questoes = questoesProvaBase
			this.setState({
				model
			})
			questoes.data = JSON.parse(JSON.stringify(questoesProvaBase))
			this.setState({
				questoes
			})
		}
		this.setState({
			base: false
		})
	}

	headerBase(classes) {
		return (
			<Toolbar>
				<Typography component="h1" variant="h5" className={classes.title}>
					{this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} - {this.state.model._id}
				</Typography>
				<Tooltip title="Visualizar" onClick={event => this.setState({ preview: true })}>
					<IconButton>
						<VisibilityIcon />
					</IconButton>
				</Tooltip>
				{
					this.state.edit ? (
						<>
							<Tooltip title="Copiar de Prova Base" onClick={this.openProvaBase}>
								<IconButton>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title="Confirmar" onClick={this.update}>
								<IconButton>
									<CheckIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title="Cancelar" onClick={() => {
								this.switchEdit()
								this.get()
							}}>
								<IconButton>
									<CloseIcon />
								</IconButton>
							</Tooltip>
						</>
					) : (
							<>
								<Tooltip title="Editar" onClick={this.switchEdit}>
									<IconButton>
										<EditIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Remover" onClick={() => {
									this.setState({ dialog: true })
								}}>
									<IconButton>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</>
						)
				}
			</Toolbar>
		)
	}

	listProvasBases = () => {
		if (this.state.provasBases) {
			let item, list = []
			for (item of this.state.provasBases) {
				list.push(
					<MenuItem key={item._id} value={item._id}>{item.titulo}</MenuItem>
				)
			}
			return list
		}
	}

	render() {

		const { classes } = this.props

		this.Content = (
			<>
				<Grid item xs={3}>
					{
						this.state.edit ? (
							<TextField
								required
								id="duracao"
								name="duracao"
								label="Duração em minutos"
								fullWidth
								value={this.state.model.duracao}
								onChange={this.updateValue}
								type="number"
							/>
						) : (
								<div>
									<Typography variant="h6" gutterBottom>
										Duração
										</Typography>
									<Typography gutterBottom>
										{this.state.model.duracao} minutos
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
						title="Lista de Questões"
						columns={this.state.questoes.columns}
						data={this.state.questoes.data}
						isLoading={this.props.isFetching}
						actions={this.state.edit ? [
							{
								icon: 'add_box',
								tooltip: 'Adicionar',
								isFreeAction: true,
								onClick: (event) => {
									this.handleOpen()
								}
							},
							{
								icon: 'edit',
								iconProps: { color: 'action' },
								tooltip: 'Editar',
								onClick: (event, rowData) => {
									this.handleOpen(rowData)
								}
							},
							{
								icon: 'delete',
								iconProps: { color: 'action' },
								tooltip: 'Remover',
								onClick: (event, rowData) => {
									let questoes = this.state.model.questoes
									questoes.splice(questoes.indexOf(rowData), 1)
									let model = this.state.model
									model.questoes = questoes
									this.setState({
										model
									})
								}
							},
						] : undefined}
						localization={localization}
						components={fixedTableComponents}
					/>
				</Grid>
				<Dialog
					open={this.state.modal} onClose={this.handleClose('modal')}
					aria-labelledby="form-dialog-title" maxWidth='md'
					fullWidth
				>
					<Questao
						questao={this.state.questao}
						onAdd={this.handleAdd}
						onCancel={this.handleClose('modal')}
					/>
				</Dialog>
				<Dialog
					open={this.state.preview} onClose={this.handleClose('preview')}
					aria-labelledby="form-dialog-title" maxWidth='lg'
					fullWidth
				>
					<DialogTitle id="form-dialog-title">Visualização da Prova</DialogTitle>
					<DialogContent>
						<Formulario
							prova={this.state.model}
						/>
					</DialogContent>
				</Dialog>
				<Dialog
					open={this.state.base} onClose={this.handleClose('base')}
					aria-labelledby="form-dialog-title" maxWidth='md'
					fullWidth scroll={"body"}
				>
					<DialogTitle id="form-dialog-title">Copiar de Prova Base</DialogTitle>
					<DialogContent>
						<form className={classes.container}>
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel id="demo-dialog-select-label">Prova Base</InputLabel>
								<Select
									id="demo-dialog-select"
									value={this.state.provaBaseSelecionada}
									onChange={this.handleChange("provaBaseSelecionada")}
									input={<Input />}
									fullWidth
								>
									{this.listProvasBases()}
								</Select>
							</FormControl>
						</form>
					</DialogContent>
					<DialogActions>
						<Button color="primary">
							Cancelar
          				</Button>
						<Button color="primary" onClick={this.copyProvaBase}>
							Confirmar
          				</Button>
					</DialogActions>
				</Dialog>

			</>
		)

		return super.renderBase(classes)
	}
}

Prova.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(Prova)
