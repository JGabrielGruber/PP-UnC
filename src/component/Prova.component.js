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
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	DateTimePicker,
} from '@material-ui/pickers';
import ptBrLocale from 'date-fns/locale/pt-BR'

import { Prova as ProvaModel } from '../model/prova.model'
import { Questao as QuestaoModel } from '../model/questao.model'
import { Realizacao as RealizacaoModel } from '../model/realizacao.model'
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
			questoesTable: {
				columns: [
					{ title: 'Número', field: 'numero' },
					{ title: 'Descrição', field: 'descricao' },
					{ title: 'Peso', field: 'peso' },
				],
				data: []
			},
			realizacoesTable: {
				columns: [
					{ title: 'Aluno', field: 'aluno.nome' },
					{ title: 'Iniciada', field: 'iniciada', type: 'boolean' },
					{ title: 'Finalizada', field: 'finalizada', type: 'boolean' },
					{ title: 'Limite', field: 'limite' },
					{ title: 'Nota', field: 'total', type: 'numeric' },
				],
				data: []
			},
			alunosTable: {
				columns: [
					{ title: 'Nome', field: 'nome' },
					{ title: 'E-mail', field: 'email' },
				],
				data: []
			},
			questao: QuestaoModel(),
			limite: null,
			questaoModal: false,
			previewModal: false,
			baseModal: false,
			realizacaoModal: false,
			provaBaseSelecionada: '',
			alunosSelecionados: [],
			provasBases: null,
			turma: null,
			materia: {},
			realizacoes: [],
			realizacao: null
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
			this.awaitData()
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
				this.props.setTitle(
					this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1) + " - " +
					(this.state.model.titulo ? this.state.model.titulo : this.state.model.nome)
				)
			}
		}
	}

	awaitData = async () => {
		if (!this.state.model.timestamp) {
			setTimeout(async () => {
				this.awaitId()
			}, 100)
		} else {
			this.getRealizacoes()
		}
	}

	getRealizacoes = async (id = null) => {
		return this.props.requestRealizacoes(...[...this.args, id]).then(() => {
			let list = []
			let item, index
			for (item of this.state.model.realizacoes) {
				index = this.props.realizacoes_ids.indexOf(item._id)
				if (index >= 0) {
					item = this.props.realizacoes[index]
					if (item) {
						list.push(item)
					}
				}
			}
			let data = this.state.realizacoes
			data.data = list
			this.setState({
				realizacoes: data
			})
			let realizacoesTable = this.state.realizacoesTable
			realizacoesTable.data = JSON.parse(JSON.stringify(list))
			this.setState({
				realizacoesTable
			})
		})
	}

	update = () => {
		this.props.update({
			...this.state.model,
			realizacoes: undefined
		})
		this.switchEdit()
	}

	handleOpenQuestao = (questao = null) => {
		this.setState({
			questaoModal: true,
			questao: (questao ? questao : QuestaoModel())
		})
	}

	handleOpenRealizacao = (realizacao = null) => {
		this.setState({
			realizacaoModal: true,
			realizacao: (realizacao ? realizacao : RealizacaoModel())
		})
	}

	handleOpenResposta = (realizacao = null) => {
		if (realizacao._id) {
			this.args = [
				this.props.usuario_id,
				this.props.match.params.materiaId,
				this.props.match.params.turmaId,
				this.propsId
			]
			this.awaitData().then(this.getRealizacoes(realizacao._id)).then(() => {
				this.setState({
					realizacao: this.state.realizacoesTable.data[realizacao.tableData.id],
					previewModal: true
				})
			})
		} else {
			this.setState({
				realizacao: null,
				previewModal: true
			})
		}
	}

	handleClose = object => event => {
		this.setState({
			[object]: false
		})
	}

	handleAdd = questao => event => {
		this.handleClose('questaoModal')
		let questoes = this.state.model.questoes ? this.state.model.questoes : []
		let index = this.state.questoesTable.data.indexOf(questao)
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
			questaoModal: false
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
		questoes = this.state.questoesTable
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

	handleSelectAluno = rows => {
		let row, raw, alunos = []
		for (row of rows) {
			raw = JSON.parse(JSON.stringify(row))
			raw.tableData = undefined
			alunos.push(raw)
		}
		this.setState({
			alunosSelecionados: alunos
		})
	}

	handleAddRealizacao = async event => {
		if (this.state.alunosSelecionados.length > 0) {
			let ids = [], aluno
			for (aluno of this.state.alunosSelecionados) {
				ids.push(aluno._id)
			}

			await this.props.updateRealizacoes({
				alunos: ids,
				limite: (this.state.limite.getTime() / 1000 | 0)
			})

			this.setState({
				realizacaoModal: false
			})

			await this.get()
			this.getRealizacoes()
			this.setState({
				alunosSelecionados: [],
				limite: null
			})
		}
	}

	handleUpdateRealizacao = realizacao => event => {
		if (realizacao._id) {
			realizacao.aluno = realizacao.aluno._id
			realizacao.tableData = undefined
			this.props.updateRealizacoes(realizacao)
				.then(this.handleClose('realizacaoModal')).then(this.getRealizacoes)
		}
	}

	handleRemoveRealizacao = async realizacao => {
		if (realizacao._id) {
			this.props.removeRealiacoes(realizacao, ...this.args, realizacao._id)
				.then(this.get).then(this.getRealizacoes)
		}
	}

	openProvaBase = event => {
		this.getProvasBases()
		this.setState({ baseModal: true })
	}

	getMateria = async () => {
		await this.props.requestMaterias(this.props.usuario_id)
		let index = this.props.materias_ids.indexOf(this.props.match.params.materiaId)
		if (index >= 0) {
			await this.setState({
				materia: this.props.materias[index]
			})
		}
	}

	getProvasBases = async () => {
		if (!this.state.provasBases) {
			await this.getMateria()

			await this.props.requestProvasBases(this.props.usuario_id, this.props.match.params.materiaId)
			let list = []
			let item
			for (item of this.state.materia.provas_bases) {
				item = this.props.provasBases[this.props.provasBases_ids.indexOf(item._id)]
				if (item) {
					list.push(item)
				}
			}
			this.setState({
				provasBases: list
			})
		}
	}

	getTurma = async () => {
		await this.getMateria()

		await this.props.requestTurmas(this.props.usuario_id, this.props.match.params.materiaId)
		let item
		item = this.props.turmas[this.props.turmas_ids.indexOf(this.props.match.params.turmaId)]

		if (item) {
			this.setState({
				turma: item
			})
		}
		return
	}

	getAlunos = async () => {
		await this.getTurma()
		if (this.state.turma) {

			await this.props.requestAlunos(this.props.usuario_id, this.props.match.params.materiaId, this.props.match.params.turmaId)
			let list = []
			let item
			for (item of this.state.turma.alunos) {
				item = this.props.alunos[this.props.alunos_ids.indexOf(item._id)]
				if (item) {
					list.push(item)
				}
			}
			let alunos = this.state.alunosTable
			alunos.data = JSON.parse(JSON.stringify(list))
			this.setState({
				alunos
			})
		}
	}

	copyProvaBase = async event => {
		let model = this.state.model
		var questoes = this.state.questoesTable, questoesProvaBase = []
		await this.props.requestProvasBases(this.props.usuario_id, this.props.match.params.materiaId, this.state.provaBaseSelecionada)
		let prova = this.props.provasBases[this.props.provasBases_ids.indexOf(this.state.provaBaseSelecionada)]

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
			baseModal: false
		})
	}

	headerBase(classes) {
		return (
			<Toolbar>
				<Typography component="h1" variant="h5" className={classes.title}>
					{this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} - {this.state.model._id}
				</Typography>
				<Tooltip title="Visualizar" onClick={this.handleOpenResposta}>
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
						columns={this.state.questoesTable.columns}
						data={this.state.questoesTable.data}
						isLoading={this.props.isFetching}
						actions={this.state.edit ? [
							{
								icon: 'add_box',
								tooltip: 'Adicionar',
								isFreeAction: true,
								onClick: (event) => {
									this.handleOpenQuestao()
								}
							},
							{
								icon: 'edit',
								iconProps: { color: 'action' },
								tooltip: 'Editar',
								onClick: (event, rowData) => {
									this.handleOpenQuestao(rowData)
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
				<Grid item xs={12}>
					<MaterialTable
						title="Lista de Realizações"
						columns={this.state.realizacoesTable.columns}
						data={this.state.realizacoesTable.data}
						isLoading={this.props.realizacoes_isFetching}
						actions={this.state.edit ? [
							{
								icon: 'add_box',
								tooltip: 'Adicionar',
								isFreeAction: true,
								onClick: (event) => {
									this.getAlunos()
									this.handleOpenRealizacao()
								}
							},
							{
								icon: 'delete',
								iconProps: { color: 'action' },
								tooltip: 'Remover',
								onClick: (event, rowData) => {
									this.handleRemoveRealizacao(rowData)
								}
							},
						] : [
								{
									icon: 'edit',
									iconProps: { color: 'action' },
									tooltip: 'Corrigir',
									onClick: (event, rowData) => {
										this.handleOpenResposta(rowData)
									}
								},
							]}
						localization={localization}
						components={fixedTableComponents}
					/>
				</Grid>
				<Dialog
					open={this.state.questaoModal} onClose={this.handleClose('questaoModal')}
					aria-labelledby="form-dialog-title" maxWidth='md'
					fullWidth
				>
					<Questao
						questao={this.state.questao}
						onAdd={this.handleAdd}
						onCancel={this.handleClose('questaoModal')}
					/>
				</Dialog>
				<Dialog
					open={this.state.previewModal} onClose={this.handleClose('previewModal')}
					aria-labelledby="form-dialog-title" maxWidth='lg'
					fullWidth
				>
					<DialogTitle disableTypography id="form-dialog-title">
						<Grid style={{ display: "flex" }}>
							<Typography variant="h5" className={classes.title}>
								{
									this.state.realizacao ? "Correção da Prova - " + this.state.realizacao.aluno.nome
										: "Visualização da Prova"
								}
							</Typography>
							{
								this.state.realizacao ?
									<Tooltip
										title="Confirmar"
										onClick={this.handleUpdateRealizacao(this.state.realizacao)}
									>
										<IconButton>
											<CheckIcon />
										</IconButton>
									</Tooltip> : undefined
							}
							<Tooltip title="Cancelar" onClick={this.handleClose('previewModal')}>
								<IconButton>
									<CloseIcon />
								</IconButton>
							</Tooltip>
						</Grid>
					</DialogTitle>
					<DialogContent>
						<Formulario
							prova={this.state.model}
							respostas={this.state.realizacao ? this.state.realizacao.respostas : undefined}
							onChangeText={() => { }} onChangeRadio={() => { }} onChangeCheck={() => { }}
						/>
					</DialogContent>
				</Dialog>
				<Dialog
					open={this.state.baseModal} onClose={this.handleClose('baseModal')}
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
						<Button color="secondary">
							Cancelar
						</Button>
						<Button color="primary" onClick={this.copyProvaBase}>
							Confirmar
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={this.state.realizacaoModal} onClose={this.handleClose('realizacaoModal')}
					aria-labelledby="form-dialog-title" maxWidth='md'
					fullWidth scroll={"body"}
				>
					<DialogTitle id="form-dialog-title">Realizar prova</DialogTitle>
					<DialogContent>
						<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale}>
							<DateTimePicker
								clearable
								format="yyyy/MM/dd HH:mm"
								margin="normal"
								id="limite"
								name="limite"
								label="Limite para realizar a prova"
								fullWidth
								value={this.state.limite}
								onChange={item => {
									this.setState({
										limite: item
									})
								}}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
						<MaterialTable
							title="Alunos a realizarem a prova"
							columns={this.state.alunosTable.columns}
							data={this.state.alunosTable.data}
							isLoading={this.props.aluno_isFetching || this.props.turmas_isFetching}
							options={{
								selection: true
							}}
							localization={{
								...localization,
								toolbar: {
									nRowsSelected: '{0} aluno(s) selecionados'
								}
							}}
							components={fixedTableComponents}
							onSelectionChange={this.handleSelectAluno}
						/>
					</DialogContent>
					<DialogActions>
						<Button color="secondary">
							Cancelar
						</Button>
						<Button color="primary" onClick={this.handleAddRealizacao}>
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
