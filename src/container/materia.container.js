import { connect } from 'react-redux'

import { MateriaAction } from '../action/materia.action'
import { TurmaAction } from '../action/turma.action'
import { ProvaBaseAction } from '../action/provaBase.action'
import Materia from '../component/Materia.component'

const materiaAction = new MateriaAction()
const turmaAction = new TurmaAction()
const provaBaseAction = new ProvaBaseAction()

function mapDispatchToProps(dispatch) {
	return ({
		request: (usuario_id, materia_id = null) => {
			materiaAction.setUrl(usuario_id, materia_id)
			return dispatch(materiaAction.request())
		},
		update: (materia) => {
			return dispatch(materiaAction.update(materia))
		},
		remove: (materia) => {
			return dispatch(materiaAction.delete(materia))
		},
		requestTurmas: (usuario_id, materia_id) => {
			turmaAction.setUrl(usuario_id, materia_id)
			return dispatch(turmaAction.request())
		},
		updateTurma: (turma) => {
			return dispatch(turmaAction.update(turma))
		},
		requestProvasBases: (usuario_id, materia_id) => {
			provaBaseAction.setUrl(usuario_id, materia_id)
			return dispatch(provaBaseAction.request(usuario_id, materia_id))
		},
		updateProvaBase: (turma) => {
			return dispatch(provaBaseAction.update(turma))
		}
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.materia.isFetching,
		didInvalidate: state.materia.didInvalidate,
		error: state.materia.error,
		modified: state.materia.modified,
		models: state.materia.materias.materias,
		ids: state.materia.materias.ids,
		usuario_id: state.usuario.usuario._id,
		turmas: state.turma.turmas.turmas,
		turmas_ids: state.turma.turmas.ids,
		turmas_isFetching: state.turma.isFetching,
		provasBases: state.provaBase.provasBases.provasBases,
		provasBases_ids: state.provaBase.provasBases.ids,
		provasBases_isFetching: state.provaBase.isFetching,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Materia)
