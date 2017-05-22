import { StyleSheet } from 'react-native'

const defaultFieldHeight = 40
const defaultFieldMargin = 10
const defaultFieldPadding = 10
const defaultBorderRadius = 2
export default StyleSheet.create({
   form: {
      flex: 1
   },
   textFieldWrapper: {
      marginHorizontal: defaultFieldMargin,
   },
   textField: {
      height: defaultFieldHeight,
      padding: defaultFieldPadding,
      backgroundColor: '#f1f1f1',
      borderRadius: defaultBorderRadius
   },
   textFieldError: {
      borderColor: 'red',
      borderWidth: StyleSheet.hairlineWidth,
      color: 'red'
   },
   textFieldSubmitting: {
      backgroundColor: '#ccc',
      color: '#bbb'
   },
   submit: {
      justifyContent: 'center',
      alignItems: 'center',
      height: defaultFieldHeight,
      marginTop: defaultFieldMargin,
      marginHorizontal: defaultFieldMargin,
      backgroundColor: 'rgb(20,70,190)',
      borderRadius: defaultBorderRadius
   },
   submitText: {
      color: 'white'
   },
   textFieldLabel: {
      color: 'black',
      paddingVertical: defaultFieldPadding,
   },
   textFieldErrorMessage: {
      color: 'red',
      paddingTop: defaultFieldPadding,
   },
})
