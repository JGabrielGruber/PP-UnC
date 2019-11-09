import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Checkbox, TextField, Radio, RadioGroup,
	FormControl, FormGroup, FormControlLabel,
	Grid, Typography
} from '@material-ui/core'

import { ProvaBase as ProvaBaseModel } from '../model/provaBase.model'
import { Resposta as RespostaModel } from '../model/resposta.model'

class Formulario extends Component {

	constructor(props) {
		super(props)

		this.state = {
			prova: ProvaBaseModel()
		}
	}

	componentDidMount() {
		if (this.props.prova) {
			this.setState({
				prova: this.props.prova
			})
		}
	}

	render() {

		return (
			<>
				<div style={{ padding: '70px', textAlign: 'center' }}>
					<Typography variant="h4">
						{this.props.prova.titulo}
					</Typography>
					<Typography variant="caption" color="secondary">
						{this.props.prova._id}
					</Typography>
				</div>
				<Grid container spacing={3}>
					{this.getQuestoes()}
				</Grid>
			</>
		)
	}

	getQuestoes = () => {
		let questoes = [], questao, componente
		for (questao of this.props.prova.questoes) {
			let preenchimento, items = [], item
			let index = this.props.prova.questoes.indexOf(questao)
			let resposta = this.props.respostas.find((rep) => {
				return rep.questao === this.props.prova.questoes[index]._id ? rep : false
			})
			
			if (!questao.isAlternativa) {
				preenchimento = (
					<TextField
						required
						multiline
						rowsMax="12"
						id="resposta"
						name="resposta"
						label="Resposta"
						fullWidth
						value={resposta.resposta}
						onChange={this.props.onChangeText(questao._id)}
					/>
				)
			} else if (!questao.isMultipla) {
				for (item of questao.alternativas) {
					items.push((
						<FormControlLabel
							value={item._id}
							control={<Radio />}
							key={item._id}
							label={item.descricao}
						/>
					))
				}
				preenchimento = (
					<FormControl component="fieldset" style={{ width: '100%' }}>
						<RadioGroup
							name="selecionada"
							value={resposta.escolhas[0] ? resposta.escolhas[0] : undefined}
							onChange={this.props.onChangeRadio(questao._id)}
							key={questao._id}
						>
							{items}
						</RadioGroup>
					</FormControl>
				)
			} else {
				for (item of questao.alternativas) {
					items.push((
						<FormControlLabel
							value={item._id}
							control={<Checkbox
								checked={resposta.escolhas.indexOf(item._id) >= 0 ? true : false}
								onChange={this.props.onChangeCheck(questao._id)}
								value={item._id}
							/>}
							key={item._id}
							label={item.descricao}
						/>
					))
				}
				preenchimento = (
					<FormControl component="fieldset" style={{ width: '100%' }}>
						<FormGroup>
							{items}
						</FormGroup>
					</FormControl>
				)
			}
			componente = (
				<Grid item xs={12} key={questao._id}>
					<Grid>
						<Typography variant="h6">
							{`${questao.numero} - ${questao.descricao}`}
						</Typography>
					</Grid>
					{preenchimento}
				</Grid>
			)
			questoes.push(
				componente
			)
		}
		return questoes
	}
}

Formulario.propType = {
	prova: PropTypes.object.isRequired,
	respostas: PropTypes.object,
	onChangeText: PropTypes.func,
	onChangeCheck: PropTypes.func,
	onChangeRadio: PropTypes.func,
	classes: PropTypes.object.isRequired,
}

export default Formulario