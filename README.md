# react-redux-form

provides react-native components for building fully functional forms with various field types and accomodates client and server validation neatly. Is extendable using renderField property and composition to create your own fields based on existing ones. Provides the necessary redux actions and reducers to use your existing redux store through react-redux.


install the example:

go to examples/Basic

First, we need to install this workaround.

npm install --save babel-plugin-transform-decorators-legacy

(in the example this is covered by just doing 'npm install')

Next, we need to create a .babelrc file in the root of our React Native application (where we have our index js files and package.json)

{
    "presets": [
        "react-native"
    ],
    "plugins": [
        "transform-decorators-legacy"
    ]
}

there are two peerDependencies so you will need to install these in your apps. 
"peerDependencies": {
    "react": "^15.4.2",
    "react-native": "^0.39.2",
    "react-redux": "^4.4.5"
  }
^ add redux-thunk to this

npm install react-redux
(in the example this is covered by just doing 'npm install')

