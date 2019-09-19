import { schema } from 'normalizr'

import Materia from './materia.model'

const Usuario = new schema.Entity('usuarios', {
	id: '',
	nome: '',
	email: '',
	materias: [Materia],
	timestamp: '',
	timeupdate: ''
})

export default Usuario