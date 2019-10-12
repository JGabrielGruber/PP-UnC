import { connect } from 'react-redux'

import { MateriaAction } from '../action/materia.action'
import {
	requestTurmas,
	updateTurma
} from '../action/turma.action'
import {
	requestProvasBases,
	updateProvaBase
} from '../action/provaBase.action'
import Materia from '../component/Materia.component'

const materiaAction	= new MateriaAction()

function mapDispatchToProps(dispatch) {
	return({
		requestMaterias: (usuario_id) => {
			materiaAction.setUrl(usuario_id)
			dispatch(materiaAction.request())
		},
		updateMateria: (materia) => {
			dispatch(materiaAction.update(materia))
		},
		deleteMateria: (materia) => {
			dispatch(materiaAction.delete(materia))
		},
		requestTurmas: (usuario_id, materia_id) => {
			dispatch(requestTurmas(usuario_id, materia_id))
		},
		updateTurma: (turma) => {
			dispatch(updateTurma(turma))
		},
		requestProvasBases: (usuario_id, materia_id) => {
			dispatch(requestProvasBases(usuario_id, materia_id))
		},
		updateProvaBase: (turma) => {
			dispatch(updateProvaBase(turma))
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
		ids: state.materia.materias.ids,
		usuario_id: state.usuario.usuario._id,
		turmas: state.turma.turmas.turmas,
		turmas_ids: state.turma.turmas.ids,
		provasBases: state.provaBase.provasBases.provasBases,
		provasBases_ids: state.provaBase.provasBases.ids
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Materia)
