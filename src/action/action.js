import {
	loadLocal,
	updateLocal,
	request as requestItems
} from '../controller/controller'
import {
	addMensagem
} from './mensagem.action'

class Action {
	constructor() {
		this.REQUEST	= ''
		this.RECEIVE	= ''
		this.UPDATE		= ''
		this.nome		= ''
		this.url		= ''
		this.slug		= ''
		this.Model		= {}
	}

	requestAction = () => ({
		type: this.REQUEST
	})
	
	receiveAction = (status, items) => ({
		type: this.RECEIVE,
		status: status,
		items: items
	})
	
	updateAction = (items) => ({
		type: this.UPDATE,
		items: items
	})
	
	request() {
		return async function (dispatch, getState) {
			if (this.shouldRequest(getState, this.slug)) {
				dispatch(this.requestAction())
				await loadLocal().then((items) => {
					dispatch(this.receiveAction(true, items))
				})
				dispatch(this.requestAction())
				requestItems(this.url, this.slug, this.Model).then((items) => {
					if (items && isNaN(items)) {
						dispatch(this.receiveAction(true, items))
					} else {
						dispatch(this.receiveAction(false, {}))
						dispatch(addMensagem(items, this.nome))
					}
				})
			}
		}
	}
	
	shouldRequest(getState) {
		if (getState()[this.slug].isFetching || getState()[this.slug].modified) {
			return false
		} else {
			return true
		}
	}
	
	update(item) {
		return function (dispatch) {
			updateLocal(item, this.slug, this.Model)
				.then((items) => {
					dispatch(this.updateAction(items))
				})
		}
	}
}

export {
	Action
}