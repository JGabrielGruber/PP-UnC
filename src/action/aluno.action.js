import { Action } from "./action"
import { Aluno, Alunos } from "../model/aluno.model"

export const REQUEST = 'REQUEST_ALUNO'
export const RECEIVE = 'RECEIVE_ALUNO'
export const UPDATE = 'UPDATE_ALUNO'

class AlunoAction extends Action {
	constructor() {
		super(
			REQUEST,
			RECEIVE,
			UPDATE,
			'aluno',
			"usuarios//materias//turmas//alunos",
			'aluno',
			'alunos',
			Aluno,
			Alunos)
	}

	setUrl(usuario_id, materia_id, turma_id, aluno_id=null) {
		super.url = "usuarios/" + usuario_id + "/materias/" + materia_id +
			"/turmas/" + turma_id + "/alunos/" + (aluno_id ? aluno_id : "")
	}
}

export { AlunoAction }