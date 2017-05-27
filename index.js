import React, { PureComponent } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
	ActivityIndicator,
	Picker
} from 'react-native'
import { connect } from 'react-redux'
import uuidV4 from 'uuid/v4'
import {
	initialiseForm,
	initialiseField,
	setFieldValue,
	setFieldError,
	setFieldErrors,
	setDirty,
	setSubmitting,
	submitSuccess,
	submitFailure,
	removeForm,
	selectOption,
	initialiseRadioButton,
} from './actions'
import { getFormValues, getFormErrors, isFormSubmitting, getError } from './selectors'
import styles from './styles'
import {
	TEXT_FIELD,
	RADIO_GROUP,
} from './constants'

export * from './actions'

@connect(
	(state, ownProps) => ({
		values: getFormValues(state, ownProps.formName),
		errors: getFormErrors(state, ownProps.formName),
		isSubmitting: isFormSubmitting(state, ownProps.formName),
	}),
	(dispatch, ownProps) => ({
		onLoad: (internalId) => dispatch(initialiseForm(ownProps.formName, internalId)),
		setDirty: () => dispatch(setDirty(ownProps.formName)),
		stopSubmitting: () => dispatch(setSubmitting(ownProps.formName, null)),
		removeForm: (internalId) => dispatch(removeForm(ownProps.formName, internalId)),
	})
)
export class Form extends PureComponent {
	constructor(props) {
		super(props)
		this.props.onLoad(this.props._internalId)
		this.submit = this.submit.bind(this)
		this._children = React.Children.map(this.props.children, child => {
			// TODO: this should probably detect whether they type is one of our field types or A DERIVITIVE THEREOF
			return React.cloneElement(child, {
				formName: this.props.formName
			})
		})
	}
	componentWillReceiveProps(nextProps) {
		if(!this.props.isSubmitting && nextProps.isSubmitting) {
			this.submit(nextProps)
		}
	}
	componentWillUnmount() {
		if(!this.props.persist) {
			this.props.removeForm(this.props._internalId)
		}
	}
	submit(nextProps) {
		this.props.setDirty()
		if(this.props.errors.filter(v => v).count() === 0) {
			this.props.onSubmit(this.props.values && this.props.values.toJS(), nextProps.isSubmitting)
		} else {
			this.props.stopSubmitting()
			if(this.props.onValidationFailure) this.props.onValidationFailure(this.props.errors)
		}
	}
	render() {
		return (
			<View {...this.props} style={[ styles.form, this.props.style ]} >
				{this._children}
			</View>
		)
	}
}

/**
* Text Input field
*/

@connect(
	(state, ownProps) => ({
		value: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.name, 'value' ]),
		error: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.name, 'error' ]),
		isDirty: state.getIn([ 'forms', ownProps.formName, '_meta', 'isDirty' ]),
		isSubmitting: state.getIn([ 'forms', ownProps.formName, '_meta', 'isSubmitting' ]),
	}),
	(dispatch, ownProps) => ({
		initialiseField: () => dispatch(initialiseField(ownProps.formName, ownProps.name, TEXT_FIELD)),
		setFieldValue: (val) => dispatch(setFieldValue(ownProps.formName, ownProps.name, val)),
		setFieldError: (err) => dispatch(setFieldError(ownProps.formName, ownProps.name, err)),
	})
)
export class TextField extends PureComponent {
	constructor(props) {
		super(props)
		this.props.initialiseField()
		this.setFieldValue = this.setFieldValue.bind(this)
		this.setFieldValue(this.props.value || this.props.defaultValue)
	}
	setFieldValue(val) {
		val = this.props.inflate ? this.props.inflate(val) : val
		this.props.setFieldValue(val)
		let err = null
      if(this.props.getValidationError) {
			err = this.props.getValidationError(val)
		}
		this.props.setFieldError(err)
	}
	render() {
		if(this.props.renderField) {
			return this.props.renderField({...this.props, setFieldValue: this.setFieldValue})
		}
		return (
			<View style={[ styles.textFieldWrapper, this.props.wrapperStyle ]}>
				<Text style={[ styles.textFieldLabel, this.props.labelStyle ]}>{this.props.label}</Text>
				<TextInput
					{...this.props}
					value={this.props.deflate && this.props.value ? this.props.deflate(this.props.value) : this.props.value}
					style={
						this.props.isSubmitting
							? [ styles.textField, styles.textFieldSubmitting, this.props.submittingStyle ]
							: this.props.isDirty && this.props.error
								? [ styles.textField, styles.textFieldError, this.props.errorStyle ]
								: [ styles.textField, this.props.style ]
					}
					defaultValue={this.props.defaultValue}
					onChangeText={this.setFieldValue}
					underlineColorAndroid="transparent"
				/>
				{ this.props.isDirty && this.props.error
					? <Text style={styles.textFieldErrorMessage}>{this.props.error}</Text>
					: null }
			</View>
		)
	}
}

/**
 * Email Address field
 */
export class EmailAddress extends PureComponent {
	constructor(props) {
		super(props)
	}
	static emailAddressRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	getValidationError(value) {
		return value && EmailAddress.emailAddressRegex.test(value)
			? null
			: 'Email address is invalid'
	}
	render() {
		return (
			<TextField
				name="email"
				label="Email Address"
				getValidationError={this.getValidationError}
				autoCapitalize="none"
				autoCorrect={false}
				keyboardType="email-address"
				{...this.props}
			/>
		)
	}
}

/**
 * Password field
 */
export class Password extends PureComponent {
	constructor(props) {
		super(props)
	}
	getValidationError(value) {
		return value && value.length >= 6
			? null
			: 'Password should be 6 characters or more'
	}
	render() {
		return (
			<TextField
				name="password"
				label="Password"
				getValidationError={this.getValidationError}
				autoCapitalize="none"
				autoCorrect={false}
				secureTextEntry={true}
				{...this.props}
			/>
		)
	}
}

/**
 * Picker
 */
@connect(
	(state, ownProps) => ({
		value: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.name, 'value' ]),
		error: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.name, 'error' ]),
		isDirty: state.getIn([ 'forms', ownProps.formName, '_meta', 'isDirty' ]),
		isSubmitting: state.getIn([ 'forms', ownProps.formName, '_meta', 'isSubmitting' ]),
	}),
	(dispatch, ownProps) => ({
		setFieldValue: (val) => dispatch(setFieldValue(ownProps.formName, ownProps.name, val)),
		setFieldError: (err) => dispatch(setFieldError(ownProps.formName, ownProps.name, err)),
	})
)
export class PickerField extends PureComponent {
	constructor(props) {
		super(props)
		this.setFieldValue = this.setFieldValue.bind(this)
		this.getValidationError = this.getValidationError.bind(this)
		this.setFieldValue(this.props.value || this.props.defaultValue)
	}
	getValidationError(value) {
		return null
	}
	setFieldValue(val) {
		this.props.setFieldValue(val)
		let err = this.getValidationError(val)
		this.props.setFieldError(err)
	}
	render() {
		// if(this.props.renderField) {
		//    return this.props.renderField({...this.props, setFieldValue: this.setFieldValue})
		// }
		return (
			<Picker
				selectedValue="js"
				onValueChange={(lang) => this.setState({language: lang})}>
				<Picker.Item label="Java" value="java" />
				<Picker.Item label="JavaScript" value="js" />
			</Picker>
		)
	}
}

/**
 * Radio buttons
 */
@connect(
	(state, ownProps) => ({
		selectedOption: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.name, 'selectedOption' ]),
		error: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.name, 'error' ]),
		isDirty: state.getIn([ 'forms', ownProps.formName, '_meta', 'isDirty' ]),
		isSubmitting: state.getIn([ 'forms', ownProps.formName, '_meta', 'isSubmitting' ]),
	}),
	(dispatch, ownProps) => ({
		initialiseField: () => dispatch(initialiseField(ownProps.formName, ownProps.name, RADIO_GROUP)),
		selectOption: (optionKey) => dispatch(selectOption(ownProps.formName, ownProps.name, optionKey)),
		setFieldError: (err) => dispatch(setFieldError(ownProps.formName, ownProps.name, err)),
	})
)
export class RadioButtons extends PureComponent {
	constructor(props) {
		super(props)
		this.props.initialiseField()
		this.selectOption = this.selectOption.bind(this)
		this.getValidationError = this.getValidationError.bind(this)
		this.selectOption(this.props.selectedOption)
	}
	getValidationError(optionName) {
		return null
	}
	selectOption(optionName) {
		this.props.selectOption(optionName)
		let err = this.getValidationError(optionName)
		this.props.setFieldError(err)
	}
	render() {
		// if(this.props.renderField) {
		//    return this.props.renderField({...this.props, selectOption: this.selectOption})
		// }
		return (
			<View style={[{ flexDirection: 'row' }, this.props.style, this.props.isDirty && this.props.error && this.props.errorStyle ]}>
				{ React.Children.map(this.props.children, child => {
					return React.cloneElement(child, {
						formName: this.props.formName,
						radioGroup: this.props.name,
						onSelect: () => this.selectOption(child.props.name),
						isSelected: this.props.selectedOption === child.props.name
					})
				}) }
			</View>
		)
	}
}

/**
 * Radio button option
 */
@connect(
	(state, ownProps) => ({
		value: state.getIn([ 'forms', ownProps.formName, 'fields', ownProps.radioGroup, 'options', ownProps.name ]),
	}),
	(dispatch, ownProps) => ({
		initialise: () => dispatch(initialiseRadioButton(ownProps.formName, ownProps.name, ownProps.radioGroup, ownProps.value))
	})
)
export class RadioOption extends PureComponent {
	componentWillMount() {
		this.props.initialise()
	}
	render() {
		if(this.props.renderField) {
			return this.props.renderField(this.props)
		}
		<TouchableHighlight
			activeOpacity={0.7}
			underlayColor="black"
			onPress={onSelect}
			style={[{ flex: 1, height: 40, justifyContent: 'center', alignItems: 'stretch' }]}
		>
			<View
				style={[{ flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }, isSelected ? { backgroundColor: 'red' } : null ]}
			>
				<Text>{this.props.label}</Text>
			</View>
		</TouchableHighlight>
	}
}

RadioButtons.Option = RadioOption

/**
 * Submit button
 */
@connect(
	(state, ownProps) => ({
		isSubmitting: state.getIn([ 'forms', ownProps.formName, '_meta', 'isSubmitting' ]),
	}),
	(dispatch, ownProps) => ({
		submit: () => dispatch(setSubmitting(ownProps.formName, ownProps.name || 'submit')),
	})
)
export class Submit extends PureComponent {
	render() {
		if(this.props.renderField) {
			return this.props.renderField(this.props)
		}
		return (
			<TouchableOpacity
				style={[ styles.submit, this.props.style ]}
				onPress={this.props.submit}
				>
				{ this.props.isSubmitting
					? <ActivityIndicator color={this.props.color}/>
					: <Text style={[ styles.submitText, this.props.textStyle ]}>{ this.props.title || 'Submit' }</Text> }
			</TouchableOpacity>
		)
	}
}

/**
 * Creates a form and ties to a key for use in the store.
 */
export function createForm(formName) {
	const _internalId = uuidV4()
	class FormWrapper extends PureComponent {
		constructor(props) {
			super(props)
			// this is used in removeForm to ensure we don't remove the state
			// of a new form of the same name which could have been mounted before
			// the previous instance has had chance to call it's removeForm.
			this._internalId = uuidV4()
		}
		render() {
			return <Form {...this.props} _internalId={_internalId} formName={formName}/>
		}
	}
	FormWrapper.submit = (submitButtonName) => setSubmitting(formName, submitButtonName || 'submit')
	FormWrapper.submitSuccess = (...args) => submitSuccess(formName, ...args)
	FormWrapper.submitFailure = (...args) => submitFailure(formName, ...args)
	FormWrapper.setFieldError = (...args) => setFieldError(formName, ...args)
	FormWrapper.setFieldErrors = (...args) => setFieldErrors(formName, ...args)
	FormWrapper.getError = (state, fieldName) => getError(state, formName, fieldName)
	FormWrapper.remove = () => removeForm(formName, _internalId)
	return FormWrapper
}
