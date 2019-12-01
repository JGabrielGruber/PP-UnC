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
import {
	TurmaAction
} from '../action/turma.action'
import {
	AlunoAction
} from '../action/aluno.action'
import {
	RealizacaoAction
} from '../action/realizacao.action'

import Prova from '../component/Prova.component'

const provaAction = new ProvaAction()
const provaBaseAction = new ProvaBaseAction()
const materiaAction = new MateriaAction()
const turmaAction = new TurmaAction()
const alunoAction = new AlunoAction()
const realizacaoAction = new RealizacaoAction()

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
		},
		requestTurmas: (usuario_id, materia_id, turma_id = null) => {
			turmaAction.setUrl(usuario_id, materia_id, turma_id)
			return dispatch(turmaAction.request())
		},
		requestAlunos: (usuario_id, materia_id, turma_id, aluno_id = null) => {
			alunoAction.setUrl(usuario_id, materia_id, turma_id, aluno_id)
			return dispatch(alunoAction.request())
		},
		requestRealizacoes: (usuario_id, materia_id, turma_id, prova_id, requisicao_id = null) => {
			realizacaoAction.setUrl(usuario_id, materia_id, turma_id, prova_id, requisicao_id)
			return dispatch(realizacaoAction.request())
		},
		updateRealizacoes: (realizacoes) => {
			return dispatch(realizacaoAction.update(realizacoes))
		},
		removeRealiacoes: (realizacoes, usuario_id, materia_id, turma_id, prova_id, requisicao_id = null) => {
			realizacaoAction.setUrl(usuario_id, materia_id, turma_id, prova_id, requisicao_id)
			return dispatch(realizacaoAction.delete(realizacoes))
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
		ids: state.prova.provas.ids,
		models: state.prova.provas.provas,
		provasBases_ids: state.provaBase.provasBases.ids,
		provasBases: state.provaBase.provasBases.provasBases,
		materias_ids: state.materia.materias.ids,
		materias: state.materia.materias.materias,
		turmas_ids: state.turma.turmas.ids,
		turmas: state.turma.turmas.turmas,
		turmas_isFetching: state.turma.isFetching,
		alunos_ids: state.aluno.alunos.ids,
		alunos: state.aluno.alunos.alunos,
		alunos_isFetching: state.aluno.isFetching,
		realizacoes_ids: state.realizacao.realizacoes.ids,
		realizacoes: state.realizacao.realizacoes.realizacoes,
		realizacoes_isFetching: state.realizacao.isFetching,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Prova)
