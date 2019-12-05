import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Checkbox, TextField, Radio, RadioGroup,
	FormControl, FormGroup, FormControlLabel,
	Grid, Typography, Tooltip, IconButton
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { ProvaBase as ProvaBaseModel } from '../model/provaBase.model'
import { Resposta as RespostaModel } from '../model/resposta.model'

class Formulario extends Component {

	constructor(props) {
		super(props)

		this.state = {
			prova: ProvaBaseModel(),
			respostas: []
		}
	}

	componentDidMount() {
		if (this.props.prova) {
			this.setState({
				prova: this.props.prova,
				respostas: this.props.respostas
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
		var questoes = [], questao, componente, correcao
		for (questao of this.props.prova.questoes) {
			let preenchimento, items = [], item, resposta, attr = []
			let index = this.props.prova.questoes.indexOf(questao)
			if (this.props.respostas) {
				resposta = this.props.respostas.find((rep) => {
					return rep.questao === this.props.prova.questoes[index]._id ? rep : false
				})
			}

			if (!questao.isAlternativa) {
				if (resposta) {
					attr["value"] = resposta.resposta
					attr["onChange"] = this.props.onChangeText(questao._id)
				}
				preenchimento = (
					<>
						<TextField
							required
							multiline
							rowsMax="12"
							id="resposta"
							name="resposta"
							label="Resposta"
							fullWidth
							{...attr}
						/>
						{questao.esperado ?
							(<Typography variant="body1" color="error">
							{questao.esperado}
							</Typography>) : null
						}
					</>
				)
			} else if (!questao.isMultipla) {
				if (resposta) {
					attr["value"] = resposta.escolhas[0] ? resposta.escolhas[0] : 0
					attr["onChange"] = this.props.onChangeRadio(questao._id)
				}
				for (item of questao.alternativas) {
					items.push((
						<Grid key={item._id} style={{ display: 'inline-flex' }}>
							<FormControlLabel
								value={item._id}
								control={<Radio />}
								key={item._id}
								label={item.descricao}
							/>
							{ questao.corretas && resposta ?
								(item._id === questao.corretas[0] ? 
									(resposta.escolhas[0] === questao.corretas[0] ?
										<CheckIcon color="primary" /> :
										<CloseIcon color="error"/>) : null) : null
							}
						</Grid>
					))
				}
				preenchimento = (
					<FormControl component="fieldset" style={{ width: '100%' }}>
						<RadioGroup
							name="selecionada"
							key={questao._id}
							{...attr}
						>
							{items}
						</RadioGroup>
					</FormControl>
				)
			} else {
				for (item of questao.alternativas) {
					attr = []
					if (resposta) {
						attr["checked"] = resposta.escolhas.indexOf(item._id) >= 0 ? true : false
						attr["value"] = item._id
						attr["onChange"] = this.props.onChangeCheck(questao._id)
					}
					items.push((
						<Grid key={item._id} style={{ display: 'inline-flex' }}>
							<FormControlLabel
								value={item._id}
								control={<Checkbox
									{...attr}
								/>}
								key={item._id}
								label={item.descricao}
							/>
							{ questao.corretas && resposta ?
								(questao.corretas.indexOf(item._id) >= 0 ?
									(attr["checked"] ?
										<CheckIcon color="primary" /> :
										<CloseIcon color="error"/>) : null) : null
							}
						</Grid>
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

			correcao = (questao, resposta) => {
				if ((questao.corretas || questao.esperado) && resposta) {
					return (
						<Grid spacing={10}>
							<Typography variant="overline">
							{
								resposta.correta ? questao.peso :
								(resposta.meioCorreta ? questao.peso / 2 : 0)
							} pontos
							</Typography>
							<Tooltip title="Marcar como correta">
								<IconButton onClick={() => {
									let index = this.state.respostas.indexOf(resposta);
									resposta.correta = resposta.correta != null ? !resposta.correta : true
									this.setState(prevState => ({
										respostas: [
											...prevState.respostas,
											{
												[index]: {
													...resposta
												}
											}
										]
									}))
								}}>
									<CheckIcon color={resposta.correta || resposta.meioCorreta ? "primary" : "action"} />
								</IconButton>
							</Tooltip>
							<Tooltip title={resposta.correta != null && resposta.correta !== true ? "Marcar como incorreta" : "Marcar como meio correta"}>
								<IconButton onClick={() => {
									let index = this.state.respostas.indexOf(resposta)
									if (resposta.correta === true) {
										resposta.meioCorreta = true
									} else {
										resposta.meioCorreta = false
									}
									resposta.correta = false
									this.setState(prevState => ({
										respostas: [
											...prevState.respostas,
											{
												[index]: {
													...resposta
												}
											}
										]
									}))
								}}>
									<CloseIcon color={resposta.correta != null && resposta.correta !== true ? "error" : "action"} />
								</IconButton>
							</Tooltip>
						</Grid>
					)
				}
				return null
			}

			componente = (
				<Grid item xs={12} key={questao._id}>
					<Grid style={{ width: '100%', display: 'inline-flex' }}>
						<Typography variant="h6" style={{ flex: 1 }}>
							{questao.numero} - {questao.descricao}
							<Typography variant="caption">
								{questao.peso} ponto(s)
							</Typography>
						</Typography>
						{correcao(questao, resposta)}
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