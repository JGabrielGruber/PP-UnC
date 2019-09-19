import { schema } from 'normalizr'

import Questao from './questao.model'

const ProvaBase = new schema.Entity('provasBases', {
	_id: '',
	titulo: '',
	descricao: '',
	questoes: [Questao],
	timestamp: '',
	timeupdate: ''
})

export default ProvaBase