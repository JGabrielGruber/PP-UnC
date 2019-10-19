import { Action } from "./action";
import { Materia, Materias } from "../model/materia.model";

export const REQUEST = 'REQUEST_MATERIA'
export const RECEIVE = 'RECEIVE_MATERIA'
export const UPDATE = 'UPDATE_MATERIA'

class MateriaAction extends Action {
	constructor() {
		super(
			REQUEST,
			RECEIVE,
			UPDATE,
			'matéria',
			"usuarios//materias/",
			'materia',
			'materias',
			Materia,
			Materias)
	}

	setUrl(usuario_id, materia_id=null) {
		super.url = "usuarios/" + usuario_id + "/materias/" + (materia_id ? materia_id : "")
	}
}

export { MateriaAction }