import {
	TEXT_FIELD,
	RADIO_GROUP,
} from './constants'

export const getError = (state, formName, fieldName) => (
   state.getIn([ 'forms', formName, 'isDirty' ])
   && state.getIn([ 'forms', formName, fieldName, 'error' ])
)
// ^ do we need this?

export const getFieldVal = (field) => {
	switch(field.get('type')) {
		case RADIO_GROUP:
			return field.getIn(['options', field.get('selectedOption')])
		default:
			return field.get('value')
	}
}

export const getFormsFields = (state, formName) => state.getIn(['forms', formName, 'fields'])
export const getField = (state, formName, fieldName) => getFormsFields(state, formName).get(fieldName)

export const isFormSubmitting = (state, formName) => state.getIn([ 'forms', formName, '_meta', 'isSubmitting' ])

export const getFormValues = (state, formName) => {
	const fields = getFormsFields(state, formName)
	return fields
		? fields.map(getFieldVal)
		: new Map()
}

export const getFormErrors = (state, formName) => {
	const fields = getFormsFields(state, formName)
	return fields
		? fields.map(x => x.get('error'))
		: new Map()
}
