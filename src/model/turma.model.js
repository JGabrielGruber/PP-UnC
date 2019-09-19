import { schema } from 'normalizr'

import Aluno from './aluno.model'
import Curso from './curso.model'
import Prova from './prova.model'

const Turma = new schema.Entity('turmas', {
	_id: '',
	titulo: '',
	descricao: '',
	curso: Curso,
	ano: '',
	semestre: '',
	alunos: [Aluno],
	questoes: [Prova],
	timestamp: '',
	timeupdate: ''
})

export default Turma