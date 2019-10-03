import React, { Component } from 'react'
import MaterialTable from 'material-table'

import localization from '../library/localizationMaterialTable'

class ListaMateria extends Component {

	constructor(props) {
		super(props);

		this.state = {
			columns: [
				{ title: 'Título', field: 'titulo' },
				{ title: 'Descrição', field: 'descricao' },
				{ title: 'Modificada', field: 'timeupdate', type: 'datetime', initialEditValue: '' },
				{ title: 'Criada', field: 'timestamp', type: 'datetime' }
			]
		}
	}

	componentDidMount() {
		this.props.requestMaterias(this.props.usuario_id)
	}

	render() {
		return (
			<MaterialTable
				title="Lista de Matérias"
				columns={this.state.columns}
				data={this.props.materias}
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
			/>
		)
	}

}

export default ListaMateria