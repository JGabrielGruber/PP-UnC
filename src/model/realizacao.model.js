import { schema } from 'normalizr'

import Aluno from './aluno.model'
import Resposta from './resposta.model'

const Realizacao = new schema.Entity('realizacoes', {
	_id: '',
	aluno: Aluno,
	respostas: [Resposta],
	finalizada: false,
	total: '',
	timestamp: '',
	timeupdate: ''
})

export default Realizacao