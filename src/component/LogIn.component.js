import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Copyright from './Copyright.component'
import { CircularProgress, withStyles } from '@material-ui/core'

import { requestToken, requestId } from '../controller/login.controller'

const styles = theme => ({
	'@global': {
		body: {
			backgroundColor: "#FAFAFA",
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
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
})

class LogIn extends Component {

	constructor(props) {
		super(props)

		this.state = {
			email: "",
			senha: "",
			keep: true,
			waiting: false,
			ok: false
		}
	}

	handleChange = name => event => {
		this.setState({ ...this.state, [name]: (name !== "keep") ? event.target.value : event.target.checked })
	}

	handleSubmit = async event => {
		event.preventDefault()
		this.setState({ ...this.state, waiting: true })
		if (await requestToken(this.state.email, this.state.senha, this.state.keep)) {
			await requestId()
			this.setState({ ...this.state, ok: true })
			setTimeout(() => {
				this.setState({ ...this.state, waiting: false })
				this.setState({ ...this.state, ok: false })
				this.props.history.push('/panel/dashboard')
			}, 500)
		} else {
			this.setState({ ...this.state, waiting: false })
		}
	}

	render() {

		const { classes } = this.props

		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						{this.state.ok ? <LockOpenOutlinedIcon /> : <LockOutlinedIcon />}
						{this.state.waiting && <CircularProgress className={classes.avatarProgress} />}
					</Avatar>
					<Typography component="h1" variant="h5">
						Acesso
					</Typography>
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Endereço de E-mail"
							name="email"
							value={this.state.email}
							onChange={this.handleChange('email')}
							autoComplete="email"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="senha"
							label="Senha"
							type="password"
							id="senha"
							value={this.state.senha}
							onChange={this.handleChange('senha')}
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Manter-me conectado"
							checked={this.state.keep}
							onChange={this.handleChange('keep')}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={this.state.waiting}
						>
							Acessar
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Esqueceu a senha?
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		)
	}
}

LogIn.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LogIn)