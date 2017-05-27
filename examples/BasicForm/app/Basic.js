import React, { PureComponent } from 'react'
import { Iterable } from 'immutable'
import { Provider, connect } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { combineReducers } from 'redux-immutable'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

const logger = createLogger({
	stateTransformer: (state) => {
		if (Iterable.isIterable(state)) return state.toJS();
		else return state;
	},
	actionTransformer: (state) => {
		if (Iterable.isIterable(state)) return state.toJS();
		else return state;
	},
})

import { reducer as formReducer } from '@grubstarstar/react-redux-form/reducer'
import { createForm, TextField, Submit } from '@grubstarstar/react-redux-form'

const rootReducer = combineReducers({
	forms: formReducer
})

const store = createStore(
  rootReducer,
  applyMiddleware(logger, thunk)
)

const BasicForm = createForm('basic')

@connect(
	state => ({
		values: BasicForm.getFormValues(state)
	}),
	dispatch => ({
		onSubmit: (fieldValues) => {
			console.log('fieldValues', fieldValues)
			setTimeout(() => dispatch(BasicForm.submitSuccess()), 500)
		}
	})
)
class App extends PureComponent {
	render() {
		return (
			<BasicForm
				onSubmit={this.props.onSubmit}>
				<TextField
					name="field-1"
					defaultValue="default value"
					getValidationError={val => (isNaN(val) || val < 5) && 'Must enter a number 5 or above'}
				/>
				<TextField
					name="field-2"
					defaultValue="some default"
				/>
				<Submit/>
			</BasicForm>
		)
	}
}

export default () => (
	<Provider store={store}>
		<App/>
	</Provider>
)