import { connect } from 'react-redux'
import {
	requestMaterias,
	updateMateria
} from '../action/materia.action'

import Materia from '../component/Materia.component'

function mapDispatchToProps(dispatch) {
	return({
		requestMaterias: () => {
			dispatch(requestMaterias());
		},
		updateMateria: (materia) => {
			dispatch(updateMateria(materia));
		}
	})
}

const mapStateToProps = (state) => {
	return {
		isfetching: state.materia.isfetching,
		didInvalidate: state.materia.didInvalidate,
		error: state.materia.error,
		modified: state.materia.modified,
		materias: state.materia.materias.materias,
		ids: state.materia.materias.ids
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Materia)
