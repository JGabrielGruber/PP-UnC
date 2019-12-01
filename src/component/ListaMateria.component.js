import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MaterialTable from 'material-table'
import { Paper, Snackbar } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import localization from '../library/localizationMaterialTable'
import fixedTableComponents from '../library/fixedTableComponents';

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
})

class ListaMateria extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			columns: [
				{ title: 'Título', field: 'titulo' },
				{ title: 'Descrição', field: 'descricao' },
				{ title: 'Modificada', field: 'timeupdate', type: 'datetime', initialEditValue: '' },
				{ title: 'Criada', field: 'timestamp', type: 'datetime' }
			]
		}
	}

	componentDidMount() {
		this.getMaterias()
	}

	getMaterias = async () => {
		if (this.props.usuario_id === "" || this.props.usuario === undefined) {
			await setTimeout(async () => {
				this.getMaterias()
			}, 100)
		} else {
			await this.props.requestMaterias(this.props.usuario_id)
			let list = []
			let item, index
			for (item of this.props.usuario.materias) {
				index = this.props.materias_ids.indexOf(item._id)
				if (index >= 0) {
					item = this.props.materias[index]
					if (item) {
						list.push(item)
					}
				}
			}
			this.setState({
				data: list
			})
		}
	}

	render() {

		const { classes } = this.props

		return (
			<Paper className={classes.paper}>
				<Snackbar open={this.props.isFetching} message="Carregando lista de matérias...">
				</Snackbar>
				<MaterialTable
					title="Lista de Matérias"
					columns={this.state.columns}
					data={this.state.data}
					editable={{
						onRowAdd: newData =>
							new Promise(resolve => {
								this.props.updateMateria(newData)
								setTimeout(() => {
									resolve();
								}, 600);
							})
					}}
					actions={[
						{
							icon: 'more_horiz',
							tooltip: 'Ver Matéria',
							onClick: (event, rowData) => {
								this.props.history.push('/panel/materias/' + rowData._id)
							}
						}
					]}
					localization={localization}
					components={fixedTableComponents}
					isLoading={this.props.isFetching}
				/>
			</Paper>
		)
	}

}

ListaMateria.propType = {
	classes: PropTypes.object.isRequired
}

export default withStyles(style)(ListaMateria)