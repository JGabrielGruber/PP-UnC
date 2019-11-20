import { Action } from "./action"
import { Realizacao, Realizacoes } from "../model/realizacao.model"

export const REQUEST = 'REQUEST_REALIZACAO'
export const RECEIVE = 'RECEIVE_REALIZACAO'
export const UPDATE = 'UPDATE_REALIZACAO'

class RealizacaoAction extends Action {
	constructor() {
		super(
			REQUEST,
			RECEIVE,
			UPDATE,
			'realizacao',
			"usuarios//materias//turmas//realizacoes",
			'realizacao',
			'realizacoes',
			Realizacao,
			Realizacoes)
	}

	setUrl(usuario_id, materia_id, turma_id, prova_id, realizacao_id=null) {
		super.url = "usuarios/" + usuario_id + "/materias/" + materia_id +
			"/turmas/" + turma_id + "/provas/" + prova_id + "/realizacoes/" + (realizacao_id ? realizacao_id : "")
	}
}

export { RealizacaoAction }