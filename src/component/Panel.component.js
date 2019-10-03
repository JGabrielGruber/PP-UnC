import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import PersonIcon from '@material-ui/icons/Person';
import { Avatar, Paper, Breadcrumbs, Tooltip, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import Copyright from './Copyright.component';
import Dashboard from './Dashboard.component';
import ListaMateria from '../container/listaMateria.container';
import Materia from '../container/materia.container';
import Turma from './Turma.component';
import { loadLocalLogin } from '../controller/login.controller'
import Axios from 'axios';

const drawerWidth = 240;

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
			open: false
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
						<IconButton color="inherit">
							<Avatar className={classes.avatar}>
								<PersonIcon />
							</Avatar>
						</IconButton>
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
	let breads = []
	path.split('/').reduce((path, part) => {
		if (list.length) {
			list.push(list[list.length - 1] + "/" + part)
		} else {
			list.push("/" + part)
		}
		return null
	})

	list.forEach((item, key) => {
		breads.push((
			<Button title={"Voltar para " + item} size="small" color="inherit" key={key} onClick={() => { history.push(item) }}>
				{item}
			</Button>
		))
	})

	breads[breads.length - 1] = (
		<Button disabled size="small" key={breads.length}>
			{breads[breads.length - 1].props.children}
		</Button>
	)

	breads.splice(0, 1)

	return breads
}

export default withStyles(styles)(Panel)