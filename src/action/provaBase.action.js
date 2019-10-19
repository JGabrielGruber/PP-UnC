import { Action } from "./action"
import { ProvaBase, ProvasBases } from "../model/provaBase.model"

export const REQUEST = 'REQUEST_PROVABASE'
export const RECEIVE = 'RECEIVE_PROVABASE'
export const UPDATE = 'UPDATE_PROVABASE'

class ProvaBaseAction extends Action {
	constructor() {
		super(
			REQUEST,
			RECEIVE,
			UPDATE,
			'provaBase',
			"usuarios//materias//provas",
			'provaBase',
			'provasBases',
			ProvaBase,
			ProvasBases)
	}

	setUrl(usuario_id, materia_id, provaBase_id=null) {
		super.url = "usuarios/" + usuario_id + "/materias/" + materia_id + "/provas/" + (provaBase_id ? provaBase_id : "")
	}
}

export { ProvaBaseAction }