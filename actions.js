import { Map } from 'immutable'

import {
   SET_FIELD_VALUE,
   SET_FIELD_ERROR,
   INITIALISE_FORM,
   SET_DIRTY,
   SET_SUBMITTING,
   REMOVE_FORM,
   INITIALISE_FIELD,
   ENSURE_RADIO_BUTTON_INITIALISED,
   SELECT_OPTION,
   SET_RADIO_GROUP_OPTION_VALUE,
} from './constants'

export const initialiseForm = (formName, internalId) => ({
   type: INITIALISE_FORM,
   formName, internalId
})

export const initialiseField = (formName, fieldName, fieldType) => ({
   type: INITIALISE_FIELD,
   formName, fieldName, fieldType
})

export const setFieldValue = (formName, fieldName, fieldValue) => ({
   type: SET_FIELD_VALUE,
   formName,
   fieldName,
   fieldValue
})

export const setFieldError = (formName, fieldName, fieldError) => ({
   type: SET_FIELD_ERROR,
   formName,
   fieldName,
   fieldError
})

export const setFieldErrors = (formName, fieldErrors = []) => {
   return (dispatch) => {
      Map(fieldErrors).forEach((fieldError, fieldName) => {
         dispatch(setFieldError(formName, fieldName, fieldError))
      })
   }
}

export const setDirty = (formName) => ({
   type: SET_DIRTY,
   formName
})

export const setSubmitting = (formName, isSubmitting) => ({
   type: SET_SUBMITTING,
   formName,
   isSubmitting
})

export const submitSuccess = (formName) => {
   return (dispatch) => {
		dispatch(setSubmitting(formName, false))
	}
}

export const submitFailure = (formName, fieldErrors) => {
   return (dispatch) => {
      dispatch(setFieldErrors(formName, fieldErrors))
      dispatch(setSubmitting(formName, false))
   }
}

export const removeForm = (formName, internalId) => ({
   type: REMOVE_FORM,
   formName, internalId
})

/* for radio button groups */

export const initialiseRadioButton = (formName, optionName, radioGroup, optionValue) => ({
    type: ENSURE_RADIO_BUTTON_INITIALISED,
    formName, optionName, radioGroup, optionValue
})

export const selectOption = (formName, radioGroup, optionName) => ({
   type: SELECT_OPTION,
   formName, radioGroup, optionName
})

export const setRadioGroupOptionValue = (formName, radioGroup, optionName, optionValue) => ({
   type: SET_RADIO_GROUP_OPTION_VALUE,
   formName, radioGroup, optionName, optionValue
})
