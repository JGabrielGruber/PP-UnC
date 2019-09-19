import { schema } from 'normalizr'

const Curso = new schema.Entity('cursos', {
	_id: '',
	titulo: ''
})

export default Curso