import { connect } from 'react-redux'
import {
	ProvaAction
} from '../action/prova.action'
import {
	ProvaBaseAction
} from '../action/provaBase.action'
import {
	MateriaAction
} from '../action/materia.action'

import Prova from '../component/Prova.component'

const provaAction = new ProvaAction()
const provaBaseAction = new ProvaBaseAction()
const materiaAction = new MateriaAction()

function mapDispatchToProps(dispatch) {
	return({
		request: (usuario_id, materia_id, turma_id, prova_id = null) => {
			provaAction.setUrl(usuario_id, materia_id, turma_id, prova_id)
			return dispatch(provaAction.request())
		},
		update: (prova) => {
			return dispatch(provaAction.update(prova))
		},
		remove: (prova) => {
			return dispatch(provaAction.delete(prova))
		},
		requestProvasBases: (usuario_id, materia_id, provabase_id = null) => {
			provaBaseAction.setUrl(usuario_id, materia_id, provabase_id)
			return dispatch(provaBaseAction.request())
		},
		requestMaterias: (usuario_id) => {
			materiaAction.setUrl(usuario_id)
			return dispatch(materiaAction.request())
		}
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.provaBase.isFetching,
		didInvalidate: state.provaBase.didInvalidate,
		error: state.provaBase.error,
		modified: state.provaBase.modified,
		usuario_id: state.usuario.usuario._id,
		ids: state.prova.provas.ids,
		models: state.prova.provas.provas,
		provasBases_ids: state.provaBase.provasBases.ids,
		provasBases_models: state.provaBase.provasBases.provasBases,
		materias_ids: state.materia.materias.ids,
		materias_models: state.materia.materias.materias,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Prova)
