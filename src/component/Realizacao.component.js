import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import {
	withStyles, Paper, AppBar,
	Toolbar, CssBaseline, Button,
	Grid, IconButton, Tooltip
} from '@material-ui/core'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'

import Formulario from './Formulario.component'
import Copyright from './Copyright.component'
import {
	loadLocalRealizacao,
	requestDadosProva,
	requestDadosRealizacao,
	updateLocalRealizacao,
	requestDadosToken,
	startRealizacao,
	defineAxios,
	updateRealizacao
} from '../controller/realizacao.controller'

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

const provaxe = {
	"_id": "5d766034936b84b7fec0406a",
	"titulo": "Prova Teste",
	"descricao": "Uma prova base testada",
	"duracao": 120,
	"questoes": [
		{
			"_id": "5dc36303123e35aab0c7c43b",
			"alternativas": [],
			"corretas": [],
			"descricao": "Descreva o teste:",
			"esperado": "É um teste",
			"isAlternativa": false,
			"isMultipla": false,
			"numero": 1,
			"peso": 1
		},
		{
			"_id": "5dc36303123e35aab0c7c43c",
			"alternativas": [
				{
					"_id": "_2mc3p630h7s",
					"descricao": "Teste 1"
				},
				{
					"_id": "_62o8tidfr0",
					"descricao": "Teste 2"
				},
				{
					"_id": "_18ngj7oz9jk",
					"descricao": "Teste 3"
				},
				{
					"_id": "_1jtp8ctwutb",
					"descricao": "Teste 4"
				}
			],
			"corretas": [
				"_2mc3p630h7s",
				"_62o8tidfr0",
				"_18ngj7oz9jk"
			],
			"descricao": "Quais testes?",
			"esperado": "",
			"isAlternativa": true,
			"isMultipla": true,
			"numero": 2,
			"peso": 1
		},
		{
			"_id": "5dc36303123e35aab0c7c43d",
			"alternativas": [
				{
					"_id": "_cecbb7rqfgo",
					"descricao": "Sim"
				},
				{
					"_id": "_1ddz9e75be8",
					"descricao": "Não"
				}
			],
			"corretas": [
				"_cecbb7rqfgo"
			],
			"descricao": "Foram validos?",
			"esperado": "",
			"isAlternativa": true,
			"isMultipla": false,
			"numero": 3,
			"peso": 1
		},
		{
			"_id": "5dc4080e123e35aab0c7c906",
			"alternativas": [],
			"corretas": [],
			"descricao": "Qual o veredito?",
			"esperado": "Que é um teste!",
			"isAlternativa": false,
			"isMultipla": false,
			"numero": 4,
			"peso": 1
		}
	]
}

const realizacaoxe = {
	"_id": "asdjfkjskdasdas",
	"aluno": {
		"_id": "asjkdlkajsdklsjdas",
		"nome": "Josisnei da Voadora",
		"email": "josisnei@voado.ra"
	},
	"finalizada": false,
	"respostas": [
		{
			"_id": "asldkjaskdad",
			"questao": "5dc36303123e35aab0c7c43b",
			"escolhas": [],
			"resposta": "",
			"correta": false,
			"meioCorreta": false,
		},
		{
			"_id": "asldyyyyyyytr",
			"questao": "5dc36303123e35aab0c7c43c",
			"escolhas": [],
			"resposta": "",
			"correta": false,
			"meioCorreta": false,
		},
		{
			"_id": "tyuytjghvvcbwewr",
			"questao": "5dc36303123e35aab0c7c43d",
			"escolhas": [],
			"resposta": "",
			"correta": false,
			"meioCorreta": false,
		},
		{
			"_id": "asfxczcfvsdasda",
			"questao": "5dc4080e123e35aab0c7c906",
			"escolhas": [],
			"resposta": "",
			"correta": false,
			"meioCorreta": false,
		}
	],
	"timestamp": "2019-11-13 21:12:18.944000",
	"total": 0
}

class Realizacao extends Component {

	constructor(props) {
		super(props)

		this.state = {
			prova: provaxe,
			realizacao: realizacaoxe,
			acesso: null,
			token: "",
			timeLeft: 0
		}

		this.handleStartRealizacao = this.handleStartRealizacao.bind(this)
		this.handleFinalizarRealizacao = this.handleFinalizarRealizacao.bind(this)
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
			realizacaoxe.respostas = respostas
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
			realizacaoxe.respostas = respostas
			this.setState({
				realizacao
			})
		}
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
						this.state.realizacao.iniciada ? (
							<>
								<AppBar position="absolute" className={classes.appBar}>
									<Toolbar className={classes.toolbar}>
										<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
											{this.state.prova.titulo}
										</Typography>
										<Typography variant="h6" className={classes.counter}>
											{this.state.timeLeft} minutos
							</Typography>
										<Tooltip title="Finalizar a prova" onClick={this.handleFinalizarRealizacao}>
											<IconButton color="inherit">
												<AssignmentTurnedInIcon />
											</IconButton>
										</Tooltip>
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
											<Formulario
												prova={this.state.prova}
												respostas={this.state.realizacao.respostas}
												onChangeText={this.handleChangeText}
												onChangeCheck={this.handleChangeCheck}
												onChangeRadio={this.handleChangeRadio}
											/>
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
			</Container>
		)
	}
}

Realizacao.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Realizacao)