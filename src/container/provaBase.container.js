import { connect } from 'react-redux'
import {
	ProvaBaseAction
} from '../action/provaBase.action'

import ProvaBase from '../component/ProvaBase.component'

const provaBaseAction	= new ProvaBaseAction()

function mapDispatchToProps(dispatch) {
	return({
		request: (usuario_id, materia_id, turma_id = null) => {
			provaBaseAction.setUrl(usuario_id, materia_id, turma_id)
			return dispatch(provaBaseAction.request())
		},
		update: (turma) => {
			return dispatch(provaBaseAction.update(turma))
		},
		remove: (turma) => {
			return dispatch(provaBaseAction.delete(turma))
		},
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.provaBase.isFetching,
		didInvalidate: state.provaBase.didInvalidate,
		error: state.provaBase.error,
		modified: state.provaBase.modified,
		usuario_id: state.usuario.usuario._id,
		ids: state.provaBase.provasBases.ids,
		models: state.provaBase.provasBases.provasBases,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProvaBase)
