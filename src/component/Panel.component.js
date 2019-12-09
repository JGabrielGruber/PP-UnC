import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import clsx from 'clsx'
import Axios from 'axios'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary'
import PersonIcon from '@material-ui/icons/Person'
import { Avatar, Paper, Breadcrumbs, Tooltip, Button, SnackbarContent, Snackbar, Menu, MenuItem } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/styles'
import CloseIcon from '@material-ui/icons/Close'
import { amber, green } from '@material-ui/core/colors'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import WarningIcon from '@material-ui/icons/Warning'
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt'

import Copyright from './Copyright.component'
import Dashboard from './Dashboard.component'
import ListaMateria from '../container/listaMateria.container'
import Materia from '../container/materia.container'
import Turma from '../container/turma.container'
import ProvaBase from '../container/provaBase.container'
import { loadLocalLogin } from '../controller/login.controller'
import Aluno from '../container/aluno.container'
import Prova from '../container/prova.container'
import { removeLocalLogin } from '../controller/login.controller'

const drawerWidth = 240

const styles = theme => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
		background: 'linear-gradient(to right, #0E2580, #297CFB)',
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	brandLogo: {
		height: 'auto',
		width: '60%',
		margin: '6px'
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	paperBread: {
		padding: theme.spacing(1, 2),
		borderBottom: '1px solid #0003',
		borderRadius: 'inherit'
	},
	fixedHeight: {
		height: 240,
	},
});

class Panel extends Component {

	constructor(props) {
		super(props)

		this.handleDrawerOpen = this.handleDrawerOpen.bind(this)
		this.handleDrawerClose = this.handleDrawerClose.bind(this)
		this.state = {
			open: false,
			menuAnchor: null
		}
	}

	componentDidMount() {
		loadLocalLogin()
		this.getUsuario()
		if (!Axios.defaults.headers.AUTHORIZATION) {
			this.props.history.push('/login')
		}

	}

	getUsuario = () => {
		this.props.requestUsuario()
	}

	handleDrawerOpen = () => {
		this.setState({ open: true })
	}
	handleDrawerClose = () => {
		this.setState({ open: false })
	}

	handleSnackClose = (event, reason) => {
		if (reason !== "clickaway") {
			this.props.delMensagem(event.key)
		}
	}

	handleOpenMenu = event => {
		this.setState({
			menuAnchor: event.currentTarget
		})
	}

	handleCloseMenu = () => {
		this.setState({
			menuAnchor: null
		})
	}

	handleLogOff = () => {
		this.handleCloseMenu()
		removeLocalLogin()
		this.props.history.push('/login')
	}

	render() {

		const classes = this.props.classes;

		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="absolute" className={clsx(classes.appBar, this.state.open && classes.appBarShift)}>
					<Toolbar className={classes.toolbar}>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={this.handleDrawerOpen}
							className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}
						>
							<MenuIcon />
						</IconButton>
						<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
							Dashboard
						</Typography>
						<IconButton color="inherit" onClick={this.handleOpenMenu}>
							<Avatar className={classes.avatar}>
								<PersonIcon />
							</Avatar>
						</IconButton>
						<Menu
							id="simple-menu"
							anchorEl={this.state.menuAnchor}
							keepMounted
							open={Boolean(this.state.menuAnchor)}
							onClose={this.handleCloseMenu}
						>
							<MenuItem onClick={this.handleLogOff}>Sair</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					classes={{
						paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
					}}
					open={this.state.open}
				>
					<div className={classes.toolbarIcon}>
						<img src="/PPUnCLogo.png" alt="PP-UnC" className={classes.brandLogo} />
						<IconButton onClick={this.handleDrawerClose}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<List>
						<ListItem button onClick={() => {
							this.props.history.push("/panel/dashboard")
						}}>
							<Tooltip title="Dashboard">
								<ListItemIcon>
									<DashboardIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText primary="Dashboard" />
						</ListItem>
						<ListItem button onClick={() => {
							this.props.history.push("/panel/materias")
						}}>
							<Tooltip title="Matérias">
								<ListItemIcon>
									<LocalLibraryIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText primary="Matérias" />
						</ListItem>
					</List>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.appBarSpacer} />
					<Paper className={classes.paperBread} elevation={0}>
						<Breadcrumbs aria-label="breadcrumb" separator="›">
							{AppBreadCrumb(this.props.location.pathname, this.props.history)}
						</Breadcrumbs>
					</Paper>
					<Container maxWidth="lg" className={classes.container}>
						<div style={{ top: '24px', left: '50%', right: 'auto', transform: 'translateX(-50%)', position: 'fixed', zIndex: 1400 }}>
							<SnackbarMessages mensagens={this.props.mensagens} onClose={this.handleSnackClose} />
						</div>
						<OfflineMsg status={this.props.status} />
						<Switch>
							<Route
								path={'/panel/dashboard'}
								render={props => (
									<Dashboard {...props} />
								)}
							/>
							<Route
								path={'/panel/materias'}
								exact={true}
								render={props => (
									<ListaMateria {...props} />
								)}
							/>
							<Route
								path={'/panel/materias/:materiaId'}
								exact={true}
								render={props => (
									<Materia {...props} />
								)}
							/>
							<Route
								path={'/panel/materias/:materiaId/turmas/:turmaId'}
								exact={true}
								render={props => (
									<Turma {...props} />
								)}
							/>
							<Route
								path={'/panel/materias/:materiaId/provas/:provaBaseId'}
								exact={true}
								render={props => (
									<ProvaBase {...props} />
								)}
							/>
							<Route
								path={'/panel/materias/:materiaId/turmas/:turmaId/alunos/:alunoId'}
								exact={true}
								render={props => (
									<Aluno {...props} />
								)}
							/>
							<Route
								path={'/panel/materias/:materiaId/turmas/:turmaId/provas/:provaId'}
								exact={true}
								render={props => (
									<Prova {...props} />
								)}
							/>
						</Switch>
					</Container>
					<Copyright />
				</main>
			</div>
		);
	}
}

Panel.propTypes = {
	classes: PropTypes.object.isRequired
}

const AppBreadCrumb = (path, history) => {
	let list = []
	let titles = []
	let breads = []
	path.split('/').reduce((path, part) => {
		if (list.length) {
			list.push(list[list.length - 1] + "/" + part)
		} else {
			list.push("/" + part)
		}
		titles.push(part)
		return null
	})

	for (let key = 0; key < list.length; key++) {
		if (key == 1) {
			breads.push((
				<Button
				title={"Voltar para " + titles[key]}
				size="small"
				color="inherit"
					key={key}
					onClick={() => { history.push(list[key]) }}
				>
					{titles[key]}
				</Button>
			))
		} else if ((key % 2) == 0) {
			breads.push((
				<Button
					title={"Voltar para " + titles[key]}
					size="small"
					color="inherit"
					key={key}
					onClick={() => { history.push(list[key]) }}
				>
					{titles[(key - 1)]} - {titles[key]}
				</Button>
			))
		}
	}

	breads[breads.length - 1] = (
		<Button disabled size="small" key={breads.length}>
			{breads[breads.length - 1].props.children}
		</Button>
	)

	breads.splice(0, 1)

	return breads
}

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStylesSM = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
		verticalAlign: 'middle'
	},
}));

const SnackbarMessages = (props) => {
	const classes = useStylesSM()
	const { className, mensagens, onClose } = props;

	let snacks = []
	let count = 0
	mensagens.forEach((item, key) => {
		if (count === 3) {
			return
		} else {
			count++
		}
		let Icon = variantIcon[item.variant];
		snacks.push((
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				autoHideDuration={6000}
				open={item.open}
				onClose={() => { onClose({ key: key }, "auto") }}
				key={key}
				style={{ position: 'relative', margin: '10px' }}
			>
				<SnackbarContent
					className={clsx(classes[item.variant], className)}
					aria-describedby="client-snackbar"
					message={
						<span id="client-snackbar" className={classes.message}>
							<Icon className={clsx(classes.icon, classes.iconVariant)} />
							{item.message}
						</span>
					}
					action={[
						<IconButton key="close" aria-label="close" color="inherit" onClick={() => { onClose({ key: key }, "click") }}>
							<CloseIcon className={classes.icon} />
						</IconButton>,
					]}
				/>
			</Snackbar>
		))
	});

	return (
		<div>
			{snacks}
		</div>
	)
}

const OfflineMsg = ({ status }) => {
	const classes = useStylesSM()

	return (
		<div style={{
			position: 'fixed',
			top: '50px',
			right: '5%',
			left: 'auto',
			zIndex: '1400',
			transform: 'translateY(0px)'}}>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={!status}
			>
				<SnackbarContent
					aria-describedby="client-snackbar"
					message={
						<span id="client-snackbar" className={classes.message}>
							<OfflineBoltIcon />
							Offline
				</span>
					}
				/>
			</Snackbar>
		</div>
	)
}

export default withStyles(styles)(Panel)