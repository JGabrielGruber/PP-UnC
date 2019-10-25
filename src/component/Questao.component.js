import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Checkbox, TextField, Radio, RadioGroup,
	FormControl, FormGroup, FormControlLabel,
	FormHelperText, DialogTitle, DialogContent,
	DialogActions, Button, IconButton, Tooltip, Grid
} from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox'
import DeleteIcon from '@material-ui/icons/Delete'

import { Questao as QuestaoModel } from '../model/questao.model'

class QuestaoForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			questao: QuestaoModel()
		}

		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		if (this.props.questao) {
			this.setState({
				questao: this.props.questao
			})
		}
	}

	handleChange = event => {
		if (event.target.type === "checkbox") {
			let questao = this.state.questao
			questao[event.target.value] = event.target.checked
			this.setState({
				questao
			})
		} else {
			let questao = this.state.questao
			questao[event.target.name] = event.target.value
			this.setState({
				questao
			})
		}
	}

	handleCheck = event => {
		let corretas = this.state.questao.corretas
		if (event.target.checked) {
			corretas.push(event.target.value)
		} else {
			corretas.splice(corretas.indexOf(event.target.value), 1)
		}
		let questao = this.state.questao
		questao.corretas = corretas
		this.setState({
			questao
		})
	}

	handleAlternativa = event => {
		let index = this.state.questao.alternativas.indexOf(
			(this.state.questao.alternativas.filter(obj => {
				return obj._id === event.target.name
			})[0])
		)
		if (index >= 0) {
			let alternativa = this.state.questao.alternativas[index]
			alternativa.descricao = event.target.value
			let questao = this.state.questao
			questao.alternativas[index] = alternativa
			this.setState({
				questao
			})
		}
	}

	handleRadio = event => {
		let corretas = []
		corretas.push(event.target.value)
		let questao = this.state.questao
		questao.corretas = corretas
		this.setState({
			questao
		})
	}

	addEscolha = () => {
		let alternativas = this.state.questao.alternativas
		alternativas = alternativas ? alternativas : []
		alternativas.push({
			_id: random_id(),
			descricao: ''
		})
		let questao = this.state.questao
		questao.alternativas = alternativas
		this.setState({
			questao
		})
	}

	rmEscolha = id => event => {
		let alternativas = this.state.questao.alternativas

		alternativas.splice(this.state.questao.alternativas.indexOf((this.state.questao.alternativas.filter(obj => {
			return obj._id === id
		})[0])), 1)

		let questao = this.state.questao
		questao.alternativas = alternativas
		this.setState({
			questao
		})
	}

	render() {

		return (
			<>
				<DialogTitle id="form-dialog-title">Adicionar Questão</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item sm={2}>
							<TextField
								required
								id="numero"
								name="numero"
								label="Número"
								type="number"
								value={this.state.questao.numero}
								onChange={this.handleChange}
							/>
						</Grid>
						<Grid item sm={2}>
							<TextField
								required
								id="peso"
								name="peso"
								label="Peso"
								type="number"
								value={this.state.questao.peso}
								onChange={this.handleChange}
							/>
						</Grid>
					</Grid>
					<TextField
						required
						multiline
						rowsMax="10"
						id="descricao"
						name="descricao"
						label="Descrição"
						fullWidth
						value={this.state.questao.descricao}
						onChange={this.handleChange}
					/>
					<Grid>
						<FormControl component="fieldset">
							<FormGroup row>
								<FormControlLabel
									control={<Checkbox
										checked={this.state.questao.isAlternativa}
										onChange={this.handleChange}
										value="isAlternativa"
									/>}
									label="É de alternativas?"
								/>
								<FormControlLabel
									control={<Checkbox
										disabled={!this.state.questao.isAlternativa}
										checked={this.state.questao.isAlternativa ? this.state.questao.isMultipla : false}
										onChange={this.handleChange}
										value="isMultipla"
									/>}
									label="São multiplas alternativas?"
								/>
								{this.state.questao.isAlternativa ? (
									<Tooltip title="Adicionar" onClick={this.addEscolha}>
										<IconButton>
											<AddBoxIcon />
										</IconButton>
									</Tooltip>
								) : undefined}
							</FormGroup>
							{this.state.questao.isAlternativa ? (
								<FormHelperText>
									Escolha {this.state.questao.isMultipla ? 'as corretas' : 'a correta'} abaixo
							</FormHelperText>
							) : undefined}

						</FormControl>
					</Grid>
					{
						!this.state.questao.isAlternativa ? (
							<TextField
								required
								multiline
								rowsMax="12"
								id="esperado"
								name="esperado"
								label="Resposta esperada"
								fullWidth
								value={this.state.questao.esperado}
								onChange={this.handleChange}
							/>
						) : !this.state.questao.isMultipla ?
								this.getAlternativas()
								: this.getEscolhas()
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.onCancel} color="default">
						Cancelar
					</Button>
					<Button onClick={this.props.onAdd(this.state.questao)} color="primary">
						Confirmar
					</Button>
				</DialogActions>
			</>
		)
	}

	getAlternativas = () => {
		let item, items = []
		for (item of this.state.questao.alternativas) {
			items.push((
				<Grid key={item._id} style={{ display: 'inline-flex' }}>
					<FormControlLabel
						value={item._id}
						control={<Radio />}
						key={item._id}
					/>
					<Grid style={{ flex: 1 }}>
						<TextField
							required
							multiline
							fullWidth
							rowsMax="2"
							id="alternativa"
							name={item._id}
							label="Descrição da alternativa"
							value={item.descricao}
							onChange={this.handleAlternativa}
						/>
					</Grid>
					<Tooltip title="Remover" onClick={this.rmEscolha(item._id)}>
						<IconButton>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Grid>
			))
		}

		return (
			<FormControl component="fieldset" style={{ width: '100%' }}>
				<RadioGroup
					name="correta"
					value={this.state.questao.corretas[0] ? this.state.questao.corretas[0] : 0}
					onChange={this.handleRadio}
				>
					{items}
				</RadioGroup>
			</FormControl>
		)
	}

	getEscolhas = () => {
		let item, items = []
		for (item of this.state.questao.alternativas) {
			items.push((
				<Grid key={item._id} style={{ display: 'inline-flex' }}>
					<FormControlLabel
						control={<Checkbox
							checked={this.state.questao.corretas.indexOf(item._id) >= 0 ? true : false}
							onChange={this.handleCheck}
							value={item._id}
						/>}
						key={item._id}
					/>
					<Grid style={{ flex: 1 }}>
						<TextField
							required
							multiline
							fullWidth
							rowsMax="2"
							id="alternativa"
							name={item._id}
							label="Descrição da alternativa"
							value={item.descricao}
							onChange={this.handleAlternativa}
						/>
					</Grid>
					<Tooltip title="Remover" onClick={this.rmEscolha(item._id)}>
						<IconButton>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Grid>
			))
		}

		return (
			<FormControl component="fieldset" style={{ width: '100%' }}>
				<FormGroup>
					{items}
				</FormGroup>
			</FormControl>
		)
	}
}

function random_id() {
	return '_' + (
		Number(String(Math.random()).slice(2)) +
		Date.now() +
		Math.round(performance.now())
	).toString(36);
}

QuestaoForm.propType = {
	questao: PropTypes.object,
	onAdd: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
}

export default QuestaoForm