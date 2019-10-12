import { connect } from 'react-redux'
import {
	MateriaAction
} from '../action/materia.action'

import ListaMateria from '../component/ListaMateria.component'

const materiaAction	= new MateriaAction()

function mapDispatchToProps(dispatch) {
	return({
		requestMaterias: (usuario_id) => {
			materiaAction.setUrl(usuario_id)
			dispatch(materiaAction.request())
		},
		updateMateria: (materia) => {
			dispatch(materiaAction.update(materia))
		}
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.materia.isFetching,
		didInvalidate: state.materia.didInvalidate,
		error: state.materia.error,
		modified: state.materia.modified,
		materias: state.materia.materias.materias,
		usuario_id: state.usuario.usuario._id
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListaMateria)
