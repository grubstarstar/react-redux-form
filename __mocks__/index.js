import React from 'react'

const MockedReactReduxForm = (props) => {
   return React.createElement('MockedReactReduxForm', props, props.children)
}

export const createForm = (formName) => (props) => <MockedReactReduxForm formName={formName} {...props}/>
