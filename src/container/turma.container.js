import { connect } from 'react-redux'
import {
	requestTurmas,
	updateTurma
} from '../action/turma.action'
import {
	requestAlunos,
	updateAluno
} from '../action/aluno.action'

import Turma from '../component/Turma.component'

function mapDispatchToProps(dispatch) {
	return({
		requestTurmas: (usuario_id, materia_id) => {
			dispatch(requestTurmas(usuario_id, materia_id))
		},
		updateTurma: (turma) => {
			dispatch(updateTurma(turma))
		},
		requestAlunos: (usuario_id, materia_id, turma_id) => {
			dispatch(requestAlunos(usuario_id, materia_id, turma_id))
		},
		updateAluno: (aluno) => {
			dispatch(updateAluno(aluno))
		},
	})
}

const mapStateToProps = (state) => {
	return {
		isfetching: state.turma.isfetching,
		didInvalidate: state.turma.didInvalidate,
		error: state.turma.error,
		modified: state.turma.modified,
		ids: state.turma.turmas.ids,
		usuario_id: state.usuario.usuario._id,
		turmas: state.turma.turmas.turmas,
		alunos: state.aluno.alunos.alunos,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Turma)
