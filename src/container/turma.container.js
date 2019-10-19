import { connect } from 'react-redux'
import {
	TurmaAction
} from '../action/turma.action'
import {
	requestAlunos,
	updateAluno
} from '../action/aluno.action'
import {
	requestProvas,
	updateProva
} from '../action/prova.action'

import Turma from '../component/Turma.component'

const turmaAction	= new TurmaAction()

function mapDispatchToProps(dispatch) {
	return({
		requestTurmas: (usuario_id, materia_id) => {
			turmaAction.setUrl(usuario_id, materia_id)
			dispatch(turmaAction.request())
		},
		updateTurma: (turma) => {
			dispatch(turmaAction.update(turma))
		},
		deleteTurma: (turma) => {
			dispatch(turmaAction.delete(turma))
		},
		requestAlunos: (usuario_id, materia_id, turma_id) => {
			dispatch(requestAlunos(usuario_id, materia_id, turma_id))
		},
		updateAluno: (aluno) => {
			dispatch(updateAluno(aluno))
		},
		requestProvas: (usuario_id, materia_id, turma_id) => {
			dispatch(requestProvas(usuario_id, materia_id, turma_id))
		},
		updateProva: (prova) => {
			dispatch(updateProva(prova))
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
		turmas: state.turma.turmas.turmas,
		alunos: state.aluno.alunos.alunos,
		provas: state.prova.provas.provas,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Turma)
