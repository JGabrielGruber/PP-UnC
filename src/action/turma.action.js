import { Action } from "./action"
import { Turma, Turmas } from "../model/turma.model"

export const REQUEST = 'REQUEST_TURMA'
export const RECEIVE = 'RECEIVE_TURMA'
export const UPDATE = 'UPDATE_TURMA'

class TurmaAction extends Action {
	constructor() {
		super(
			REQUEST,
			RECEIVE,
			UPDATE,
			'turma',
			"usuarios//materias//turmas",
			'turma',
			'turmas',
			Turma,
			Turmas)
	}

	setUrl(usuario_id, materia_id, turma_id=null) {
		super.url = "usuarios/" + usuario_id + "/materias/" + materia_id + "/turmas/" + (turma_id ? turma_id : "")
	}
}

export { TurmaAction }