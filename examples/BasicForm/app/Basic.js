import React, { PureComponent } from 'react'
import { View, Text, Alert } from 'react-native'
import { Iterable, Map } from 'immutable'
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
			Alert.alert(
				'Form submitted...',
				JSON.stringify(fieldValues),
			)
			setTimeout(() => dispatch(BasicForm.submitSuccess()), 500)
		}
	})
)
class App extends PureComponent {
	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'flex-start' }}>
				<BasicForm
					style={{ flex: null }}
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
				<View style={{ flex: 1, marginTop: 20, alignSelf: 'center' }}>
					<Text style={{ fontWeight: 'bold' }}>Current field values</Text>
					{
						this.props.values.map((val, fieldName) => <Text key={fieldName}>{fieldName}: {val}</Text>).valueSeq().toArray()
					}
				</View>
			</View>
		)
	}
}

export default () => (
	<Provider store={store}>
		<App/>
	</Provider>
)