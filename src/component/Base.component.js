import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Typography, Grid, Paper, Toolbar,
	Tooltip, IconButton, Snackbar, Dialog, DialogTitle,
	DialogActions, Button, DialogContent, DialogContentText
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'

class BaseComponent extends Component {

	constructor(props) {
		super(props)

		this.model = () => {
			return {
				_id: "",
				titulo: ""
			}
		}
		this.modelName = ""
		this.propsId = ""
		this.args = []
		this.Content = (<></>)

		this.defaultState = {
			dialog: false,
			edit: false,
			model: this.model()
		}

		this.state = {
			...this.defaultState
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
			}
		}
	}

	update = () => {
		this.props.update(this.state.model)
		this.switchEdit()
	}

	remove = () => {
		this.props.remove(this.state.model)
		this.props.history.push(
			this.props.location.pathname.substring(
				0,
				this.props.location.pathname.lastIndexOf('/')
			)
		)
	}

	getData = async (caller, propsSlug, stateSlug) => {
		return caller(...this.args).then(() => {
			let list = []
			let item, index
			for (item of this.state.model[stateSlug]) {
				index = this.props[propsSlug + "_ids"].indexOf(item._id)
				if (index >= 0) {
					item = this.props[propsSlug][index]
					if (item) {
						list.push(item)
					}
				}
			}
			let data = this.state[stateSlug]
			data.data = list
			this.setState({
				[stateSlug]: data
			})
		})
	}

	updateValue = (event) => {
		let model = this.state.model
		if (event.target.type === "number") {
			model[event.target.id] = Number(event.target.value)
		} else {
			model[event.target.id] = event.target.value
		}
		this.setState({
			...this.state, model
		})
	}

	switchEdit = () => {
		this.setState({
			edit: !this.state.edit
		})
	}

	handleCloseDialog = () => {
		this.setState({
			dialog: false
		})
	}

	headerBase(classes) {
		return (
			<Toolbar>
				<Typography component="h1" variant="h5" className={classes.title}>
					{this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} - {this.state.model._id}
				</Typography>
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

	renderBase(classes) {

		return (
			<Paper className={classes.paper}>
				<Snackbar
					open={this.props.isFetching}
					message={`Carregando ${this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1)} ...`}
				/>
				{this.headerBase(classes)}
				<Grid container direction='column'>
					<Typography variant="caption" color="secondary">
						{`Criado em: ${this.state.model.timestamp}`}
					</Typography>
					<Typography variant="caption" color="secondary">
						{`Modificado em: ${this.state.model.timeupdate}`}
					</Typography>
				</Grid>
				<Grid container spacing={3}>
					{this.Content}
				</Grid>
				<Dialog
					open={this.state.dialog}
					onClose={this.handleCloseDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{`Confirmar remoção da ${this.modelName}?`}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{`Você realmente deseja remover a ${this.modelName} ${
								this.state.model.titulo ? this.state.model.titulo : this.state.model.nome
								} ?
								\n Ela e tudo o que for atribuido a ela, não poderá ser recuperado!`}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCloseDialog} color="secondary" autoFocus>
							Cancelar
						</Button>
						<Button onClick={() => {
							this.handleCloseDialog()
							this.remove()
						}} color="primary">
							Confirmar
						</Button>
					</DialogActions>
				</Dialog>
			</Paper >
		)
	}
}

BaseComponent.propType = {
	classes: PropTypes.object.isRequired
}

export default BaseComponent