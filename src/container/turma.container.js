import { connect } from 'react-redux'
import {
	TurmaAction
} from '../action/turma.action'
import {
	AlunoAction
} from '../action/aluno.action'
import {
	ProvaAction
} from '../action/prova.action'

import Turma from '../component/Turma.component'

const turmaAction	= new TurmaAction()
const alunoAction	= new AlunoAction()
const provaAction	= new ProvaAction()

function mapDispatchToProps(dispatch) {
	return({
		request: (usuario_id, materia_id, turma_id = null) => {
			turmaAction.setUrl(usuario_id, materia_id, turma_id)
			return dispatch(turmaAction.request())
		},
		update: (turma) => {
			return dispatch(turmaAction.update(turma))
		},
		remove: (turma) => {
			return dispatch(turmaAction.delete(turma))
		},
		requestAlunos: (usuario_id, materia_id, turma_id) => {
			alunoAction.setUrl(usuario_id, materia_id, turma_id)
			return dispatch(alunoAction.request())
		},
		updateAluno: (aluno) => {
			return dispatch(alunoAction.update(aluno))
		},
		requestProvas: (usuario_id, materia_id, turma_id) => {
			provaAction.setUrl(usuario_id, materia_id, turma_id)
			return dispatch(provaAction.request())
		},
		updateProva: (prova) => {
			return dispatch(provaAction.update(prova))
		},
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.turma.isFetching,
		didInvalidate: state.turma.didInvalidate,
		error: state.turma.error,
		modified: state.turma.modified,
		ids: state.turma.turmas.ids,
		usuario_id: state.usuario.usuario._id,
		models: state.turma.turmas.turmas,
		alunos: state.aluno.alunos.alunos,
		alunos_ids: state.aluno.alunos.ids,
		provas: state.prova.provas.provas,
		provas_ids: state.prova.provas.ids,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Turma)
