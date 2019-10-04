import { connect } from 'react-redux'
import {
	requestUsuario
} from '../action/usuario.action'

import Panel from '../component/Panel.component'

function mapDispatchToProps(dispatch) {
	return({
		requestUsuario: () => {
			dispatch(requestUsuario());
		}
	})
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.usuario.isFetching,
		didInvalidate: state.usuario.didInvalidate,
		error: state.usuario.error,
		modified: state.usuario.modified,
		usuario: state.usuario.usuario,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Panel)
