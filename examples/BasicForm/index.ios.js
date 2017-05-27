/**
 * Example @grubstarstar/react-redux-form
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
	AppRegistry,
	StyleSheet,
	Text,
	View
} from 'react-native'

import Basic from './app/Basic'

export default class BasicForm extends Component {
	render() {
		return (
			<Basic/>
		)
	}
}

AppRegistry.registerComponent('BasicForm', () => BasicForm)
