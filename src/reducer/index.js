import { combineReducers } from 'redux'

import aluno from './aluno.reducer'
import curso from './curso.reducer'
import materia from './materia.reducer'
import mensagem from './mensagem.reducer'
import prova from './prova.reducer'
import provaBase from './provaBase.reducer'
import realizacao from './realizacao.reducer'
import turma from './turma.reducer'
import usuario from './usuario.reducer'

export default combineReducers({
	aluno,
	curso,
	materia,
	mensagem,
	prova,
	provaBase,
	realizacao,
	turma,
	usuario
})