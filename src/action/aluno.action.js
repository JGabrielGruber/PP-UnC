import {
	loadLocalAlunos,
	updateLocalAluno,
	requestAlunos as request
} from '../controller/aluno.controller'

export const REQUEST	= 'REQUEST_ALUNO'
export const RECEIVE	= 'RECEIVE_ALUNO'
export const UPDATE		= 'UPDATE_ALUNO'

const requestAction = () => ({
	type: REQUEST
})

const receiveAction = (status, alunos) => ({
	type: RECEIVE,
	status: status,
	alunos: alunos
})

const updateAction = (alunos) => ({
	type: UPDATE,
	alunos: alunos
})

function requestAlunos(usuario_id, materia_id, turma_id) {
	return function(dispatch) {
		dispatch(requestAction())
		loadLocalAlunos().then((alunos) => {
			dispatch(receiveAction(true, alunos))
		})
		dispatch(requestAction())
		request(usuario_id, materia_id, turma_id).then((alunos) => {
			dispatch(receiveAction(alunos ? true : false, alunos ? alunos : []))
		})
	}
}

function updateAluno(aluno) {
	return function(dispatch) {
		updateLocalAluno(aluno)
		.then((alunos) => {
			dispatch(updateAction(alunos))
		})
	}
}

export {
	requestAlunos,
	updateAluno
}