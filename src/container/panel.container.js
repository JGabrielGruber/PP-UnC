import { connect } from 'react-redux'
import {
	requestUsuario
} from '../action/usuario.action'
import {
	addMensagem,
	delMensagem
} from '../action/mensagem.action'

import Panel from '../component/Panel.component'

function mapDispatchToProps(dispatch) {
	return({
		requestUsuario: () => {
			dispatch(requestUsuario())
		},
		addMensagem: (mensagem) => {
			dispatch(addMensagem(mensagem))
		},
		delMensagem: (index) => {
			dispatch(delMensagem(index))
		},
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.usuario.isFetching,
		didInvalidate: state.usuario.didInvalidate,
		error: state.usuario.error,
		modified: state.usuario.modified,
		usuario: state.usuario.usuario,
		mensagens: state.mensagem.mensagens
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Panel)
