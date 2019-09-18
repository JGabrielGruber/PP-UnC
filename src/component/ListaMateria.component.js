import React, { Component } from 'react'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

import localization from '../library/localizationMaterialTable'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	}
}))

class ListaMateria extends Component {

	constructor(props) {
		super(props);

		this.state = {
			columns: [
				{ title: 'Título', field: 'titulo' },
				{ title: 'Descrição', field: 'descricao' },
				{ title: 'Modificada', field: 'timeupdate', type: 'datetime' },
				{ title: 'Criada', field: 'timestamp', type: 'datetime' }
			],
			data: [
				{
					_id: 'asdasdasdasd',
					titulo: 'Materia de Teste',
					descricao: 'Uma matéria criada para testes',
					timeupdate: '2019-08-08 12:12:00',
					timestamp: '2019-07-08 12:12:12'
				},
			],
		}
	}

	render() {
		return (
			<MaterialTable
				title="Lista de Matérias"
				columns={this.state.columns}
				data={this.state.data}
				editable={{
					onRowAdd: newData =>
						new Promise(resolve => {
							setTimeout(() => {
								resolve();
								const data = [...this.state.data];
								data.push(newData);
								this.setState({ ...this.state, data });
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
			/>
		)
	}

}

export default ListaMateria