import { connect } from 'react-redux'
import {
	AlunoAction
} from '../action/aluno.action'

import Aluno from '../component/Aluno.component'

const alunoAction	= new AlunoAction()

function mapDispatchToProps(dispatch) {
	return({
		request: (usuario_id, materia_id, turma_id, aluno_id = null) => {
			alunoAction.setUrl(usuario_id, materia_id, turma_id, aluno_id)
			return dispatch(alunoAction.request())
		},
		update: (aluno) => {
			return dispatch(alunoAction.update(aluno))
		},
		remove: (aluno) => {
			return dispatch(alunoAction.delete(aluno))
		},
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.turma.isFetching,
		didInvalidate: state.turma.didInvalidate,
		error: state.turma.error,
		modified: state.turma.modified,
		ids: state.aluno.alunos.ids,
		usuario_id: state.usuario.usuario._id,
		models: state.aluno.alunos.alunos,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Aluno)
