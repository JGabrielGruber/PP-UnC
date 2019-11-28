import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import {
	withStyles, Paper, AppBar,
	Toolbar, CssBaseline, Button,
	Grid, IconButton, Tooltip, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions
} from '@material-ui/core'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'

import Formulario from './Formulario.component'
import Copyright from './Copyright.component'
import {
	requestDadosProva,
	requestDadosRealizacao,
	requestDadosToken,
	startRealizacao,
	defineAxios,
	updateRealizacao
} from '../controller/realizacao.controller'
import { Prova as ProvaModel } from '../model/prova.model'
import { Realizacao as RealizacaoModel } from '../model/realizacao.model'

const styles = theme => ({
	'@global': {
		body: {
			backgroundColor: "#FAFAFA",
		},
	},
	root: {
		display: 'flex',
	},
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
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
		background: 'linear-gradient(to right, #0E2580, #297CFB)',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	title: {
		flexGrow: 1,
	},
	avatarProgress: {
		position: 'absolute',
		zIndex: 1,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	counter: {
		padding: theme.spacing(2)
	}
})


class Realizacao extends Component {

	constructor(props) {
		super(props)

		this.state = {
			prova: ProvaModel(),
			realizacao: RealizacaoModel(),
			acesso: null,
			token: "",
			timeLeft: 0,
			finalizar: false
		}

		this.handleStartRealizacao = this.handleStartRealizacao.bind(this)
		this.handleFinalizarRealizacao = this.handleFinalizarRealizacao.bind(this)
		this.handleClose = this.handleClose.bind(this)
	}

	updateMinLeft = async event => {
		clearInterval(this.timer)
		let finish = new Date(
			new Date(this.state.realizacao.timestarted).getTime() +
			(this.state.prova.duracao ? this.state.prova.duracao : 60) * 60000
		)
		let now = new Date()
		let left = finish.getTime() - (now.isDstObserved() ? now.getTime() - (60000 * 60) : now.getTime())
		let minLeft = Math.round(left / 60000)
		if (left > 0) {
			this.setState({
				timeLeft: `${minLeft}`
			})
			this.timer = setInterval(this.updateMinLeft, 1000)
		} else {
			clearInterval(this.timer)
		}
	}

	handleChangeText = questaoId => event => {
		let respostas = this.state.realizacao.respostas
		let i = respostas.findIndex((item) => {
			return item.questao === questaoId ? item : false
		})
		let resposta = respostas[i]
		if (resposta) {
			resposta.resposta = event.target.value
			respostas[i] = resposta
			let realizacao = this.state.realizacao
			realizacao.respostas = respostas
			this.setState({
				realizacao
			})
		}
	}

	handleChangeCheck = questaoId => event => {
		let respostas = this.state.realizacao.respostas
		let i = respostas.findIndex((item) => {
			return item.questao === questaoId ? item : false
		})
		let resposta = respostas[i]
		if (resposta) {
			let escolhas = resposta.escolhas
			if (event.target.checked) {
				escolhas.push(event.target.value)
			} else {
				escolhas.splice(escolhas.indexOf(event.target.value), 1)
			}
			resposta.escolhas = escolhas
			respostas[i] = resposta
			let realizacao = this.state.realizacao
			this.setState({
				realizacao
			})
		}
	}

	handleChangeRadio = questaoId => event => {
		let respostas = this.state.realizacao.respostas
		let i = respostas.findIndex((item) => {
			return item.questao === questaoId ? item : false
		})
		let resposta = respostas[i]
		if (resposta) {
			let escolhas = []
			escolhas.push(event.target.value)
			resposta.escolhas = escolhas
			respostas[i] = resposta
			let realizacao = this.state.realizacao
			this.setState({
				realizacao
			})
		}
	}

	handleClose = () => {
		this.setState({
			finalizar: false
		})
	}

	componentDidMount() {
		Date.prototype.stdTimezoneOffset = function () {
			var jan = new Date(this.getFullYear(), 0, 1);
			var jul = new Date(this.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		}
		
		Date.prototype.isDstObserved = function () {
			return this.getTimezoneOffset() < this.stdTimezoneOffset();
		}
		if (!this.timer) {
			this.updateMinLeft()
		}
		this.getDataToken()
	}
	
	async getDataToken() {
		let token = new URLSearchParams(this.props.location.search).get("token")
		if (token !== undefined && token !== null) {
			await this.setState({
				token: token
			})
			defineAxios(this.state.token)
			let data = await requestDadosToken(this.state.token)
			if (data) {
				await this.setState({
					...this.state,
					...data
				})
				this.getProva()
			}
		}
	}

	async handleStartRealizacao() {
		let data = await startRealizacao(this.state.acesso)
		if (data.realizacao !== undefined) {
			await this.setState({
				...this.state,
				...data
			})
			this.getProva()
		}
	}

	async getProva() {
		let data = await requestDadosProva(this.state.acesso)
		if (data.prova !== undefined) {
			await this.setState({
				...this.state,
				...data
			})
			this.getRealizacao()
		}
	}

	async getRealizacao() {
		let data = await requestDadosRealizacao(this.state.acesso)
		if (data.realizacao !== undefined) {
			await this.setState({
				...this.state,
				...data
			})
			console.log(this.state)
			this.updateMinLeft()
		}
	}

	async handleFinalizarRealizacao() {
		await this.setState({
			...this.state,
			realizacao: {
				...this.state.realizacao,
				finalizada: true
			}
		})
		
		let data = await updateRealizacao(this.state.acesso, this.state.realizacao)
		if (data.realizacao !== undefined) {
			await this.setState({
				...this.state,
				...data
			})
		}
	}

	render() {

		const { classes } = this.props

		return (
			<Container component="main" maxWidth="xl">
				<div className={classes.root}>
					<CssBaseline />
					{
						this.state.realizacao.iniciada && this.state.prova.questoes.length > 0 ? (
							<>
								<AppBar position="absolute" className={classes.appBar}>
									<Toolbar className={classes.toolbar}>
										<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
											{this.state.prova.titulo}
										</Typography>
										
										{
											this.state.realizacao.finalizada ? 
											<Typography variant="h6" className={classes.counter}>
													Finalizada
											</Typography> :
											<>
												<Typography variant="h6" className={classes.counter}>
													{this.state.timeLeft} minutos
												</Typography>
												<Tooltip title="Finalizar a prova" onClick={() => this.setState({finalizar: true})}>
													<IconButton color="inherit">
														<AssignmentTurnedInIcon />
													</IconButton>
												</Tooltip>
											</>
										}
									</Toolbar>
								</AppBar>
								<main className={classes.content}>
									<Container maxWidth="lg" className={classes.container}>
										<Paper className={classes.paper}>
											<Grid container>
												<Typography variant="h6" className={classes.title}>
													Aluno: {this.state.realizacao.aluno.nome}
												</Typography>
												<Typography variant="h6">
													Data: {this.state.realizacao.timestarted}
												</Typography>
											</Grid>
											{
												this.state.realizacao.finalizada ? null :
													<Formulario
														prova={this.state.prova}
														respostas={this.state.realizacao.respostas}
														onChangeText={this.handleChangeText}
														onChangeCheck={this.handleChangeCheck}
														onChangeRadio={this.handleChangeRadio}
													/>
											}
										</Paper>
									</Container>
									<Box mt={8}>
										<Copyright />
									</Box>
								</main>
							</>
						) : (
								<Grid container direction="column" alignContent="center" className={classes.paper} spacing={5}>
									<Typography variant="h3" className={classes.title} align="center" color="textPrimary">
										Realizar prova - {this.state.prova.titulo}
									</Typography>
									<Typography variant="h5" align="center" color="textSecondary" component="p">
										Você realmente deseja iniciar a prova?<br />
										A partir do momento que você iniciar, você terá somente {this.state.prova.duracao} minutos para realizar ela!
									</Typography>
									<Grid container item justify="flex-end">
										<Grid item>
											<Button
												color="primary"
												title="Sim! Estou pronto!"
												variant="contained"
												size="large"
												onClick={this.handleStartRealizacao}
											>
												Sim! estou pronto!
											</Button>
										</Grid>
									</Grid>
								</Grid>
							)

					}
				</div >
				<Dialog
					open={this.state.finalizar}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						FINALIZAR A PROVA
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Vocẽ realmente deseja finalizar a prova? Você não poderá mais editar ela assim que finalizar!
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="secondary" autoFocus>
							Cancelar
						</Button>
						<Button onClick={() => {
							this.handleClose()
							this.handleFinalizarRealizacao()
						}} color="primary">
							Confirmar
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		)
	}
}

Realizacao.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Realizacao)