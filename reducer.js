import { Map, fromJS } from 'immutable'
import {
	INITIALISE_FORM,
	SET_FIELD_VALUE,
	SET_FIELD_ERROR,
	SET_SUBMITTING,
	SET_DIRTY,
	REMOVE_FORM,
	SET_RADIO_GROUP_OPTION_VALUE,
	SELECT_OPTION,
	ENSURE_RADIO_BUTTON_INITIALISED,
	INITIALISE_FIELD
} from './constants'

const initialState = fromJS({})

export const reducer = (state = initialState, action) => {
	switch(action.type) {
		case INITIALISE_FORM:
			return state.set(
				action.formName,
				new Map({
					fields: state.getIn([ action.formName, 'fields' ]) || new Map(action.initialValues),
					_meta: new Map({
						isDirty: state.getIn([ action.formName, '_meta', 'isDirty' ]) || false,
						isSubmitting: state.getIn([ action.formName, '_meta', 'isSubmitting' ]) || false,
					})
				})
			)
		case INITIALISE_FIELD:
			return state
				.updateIn(
					[ action.formName, 'fields' ],
					new Map(),
					fields => fields.update(
						action.fieldName,
						new Map(),
						field => field.set('type', action.fieldType)
					),
				)
		case SET_FIELD_VALUE:
			return state.get(action.formName)
				? state.setIn([ action.formName, 'fields', action.fieldName, 'value' ], action.fieldValue)
				: state
		case SET_FIELD_ERROR:
			return state.get(action.formName)
				? state.setIn([ action.formName, 'fields', action.fieldName, 'error' ], action.fieldError)
				: state
		case SET_DIRTY:
			return state.get(action.formName)
				? state.setIn([ action.formName, '_meta', 'isDirty' ], true)
				: state
		case SET_SUBMITTING:
			return state.get(action.formName)
				? state.setIn([ action.formName, '_meta', 'isSubmitting' ], action.isSubmitting)
				: state
		case REMOVE_FORM:
			return state.delete(action.formName)
		case ENSURE_RADIO_BUTTON_INITIALISED:
			return state.updateIn([ action.formName, 'fields', action.radioGroup, 'options', action.optionName ], val => (val || action.optionValue))
		case SELECT_OPTION:
			return state.get(action.formName)
				? state.setIn([ action.formName, 'fields', action.radioGroup, 'selectedOption' ], action.optionName)
				: state
		case SET_RADIO_GROUP_OPTION_VALUE:
			if(state.get(action.formName)) {
				return state
					.setIn([ action.formName, 'fields', action.radioGroup, 'options', action.optionName ], action.optionValue)
			}
			return state
		default:
			return state
	}
}
