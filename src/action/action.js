import {
	loadLocal,
	request as requestItems
} from '../controller/controller'
import {
	addMensagem
} from './mensagem.action'

class Action {

	constructor(REQUEST, RECEIVE, UPDATE, nome, url, reducer, slug, Model, ModelList=null) {
		this.REQUEST	= REQUEST
		this.RECEIVE	= RECEIVE
		this.UPDATE		= UPDATE
		this.nome		= nome
		this.url		= url
		this.reducer	= reducer
		this.slug		= slug
		this.Model		= Model
		this.ModelList	= ModelList
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
		var self = this;
		return async function (dispatch, getState) {
			if (self.shouldRequest(getState)) {
				dispatch(self.requestAction())
				await loadLocal(self.slug, self.ModelList ? self.ModelList : self.Model).then((items) => {
					dispatch(self.receiveAction(true, items))
				})
				dispatch(self.requestAction())
				return requestItems(self.url, self.slug, self.Model).then((items) => {
					if (items && isNaN(items)) {
						dispatch(self.receiveAction(true, items))
					} else {
						dispatch(self.receiveAction(false, {}))
						dispatch(addMensagem(items, self.nome))
					}
				})
			}
		}
	}
	
	shouldRequest(getState) {
		if (getState()[this.reducer].isFetching || getState()[this.reducer].modified) {
			return false
		} else {
			return true
		}
	}
	
	update(item) {
		var self = this
		return function (dispatch) {
			if (!item.hasOwnProperty('_id')) {
				requestItems(self.url, self.slug, self.Model, "POST", item, self.reducer)
				.then((items) => {
					self.receiveResponse(items, dispatch)
				})
			} else {
				requestItems(self.url + item._id, self.slug, self.Model, "PUT", item, self.reducer)
				.then((items) => {
					self.receiveResponse(items, dispatch)
				})
			}
		}
	}

	delete(item) {
		var self = this
		return function (dispatch) {
			requestItems(self.url + item._id, self.slug, self.Model, "DELETE", item, self.reducer)
			.then((items) => {
				self.receiveResponse(items, dispatch)
			})
		}
	}

	receiveResponse(items, dispatch) {
		var self = this
		if (items && isNaN(items)) {
			dispatch(self.updateAction(items))
		} else {
			dispatch(self.receiveAction(false, {}))
			dispatch(addMensagem(items, self.nome))
		}
	}
}

export {
	Action
}