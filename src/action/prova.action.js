import { Action } from "./action"
import { Prova, Provas } from "../model/prova.model"

export const REQUEST = 'REQUEST_PROVA'
export const RECEIVE = 'RECEIVE_PROVA'
export const UPDATE = 'UPDATE_PROVA'

class ProvaAction extends Action {
	constructor() {
		super(
			REQUEST,
			RECEIVE,
			UPDATE,
			'prova',
			"usuarios//materias//turmas//provas",
			'prova',
			'provas',
			Prova,
			Provas)
	}

	setUrl(usuario_id, materia_id, turma_id, prova_id=null) {
		super.url = "usuarios/" + usuario_id + "/materias/" + materia_id +
			"/turmas/" + turma_id + "/provas/" + (prova_id ? prova_id : "")
	}
}

export { ProvaAction }