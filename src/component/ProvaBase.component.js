import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, TextField, withStyles, Dialog, DialogContent, DialogTitle, Tooltip, IconButton, Toolbar } from '@material-ui/core'
import MaterialTable from 'material-table'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import VisibilityIcon from '@material-ui/icons/Visibility'

import { ProvaBase as ProvaBaseModel } from '../model/provaBase.model'
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
})

class ProvaBase extends BaseComponent {

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
		}
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
		let index = questoes.indexOf(questao)
		if (index >= 0) {
			questoes.splice(index, 1)
			questoes.push(questao)
		} else {
			questoes.push(questao)
		}
		let model = this.state.model
		model.questoes = questoes
		this.setState({
			model
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
