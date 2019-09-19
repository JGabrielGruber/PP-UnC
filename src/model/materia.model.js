import { schema } from 'normalizr'

import ProvaBase from './provaBase.model'
import Turma from './turma.model'

const Materia = new schema.Entity('materias', {
	_id: '',
	titulo: '',
	descricao: '',
	turmas: [Turma],
	provasBases: [ProvaBase],
	timestamp: '',
	timeupdate: ''
})

export default Materia