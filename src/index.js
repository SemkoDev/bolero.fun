import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { takeEvery, put, all, call } from 'redux-saga/effects'
import { createStore, applyMiddleware } from 'redux'
import App from './components/App';

// API ====================================================

function getUpdate () {
  return new Promise(resolve => {
    fetch('/update')
      .then(function(response) {
        return response.json();
      })
      .then(resolve)
      .catch((e) => resolve({ error: e }));
  })
}

function postSettings (data) {
  return new Promise(resolve => {
    fetch('/settings', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    })
      .then(function(response) {
        return response.json();
      })
      .then(resolve)
      .catch((e) => resolve({ error: e }));
  })
}

// SAGAS ==================================================

// Worker saga that will do any sync or async work.
// Once done, "yield put" with a new action. This will dispatch
// the new action to the redux store:
function* requestSaga () {
    const response = yield call(getUpdate);
    if (response.error) {
      yield put({ type: 'UPDATE_FAILED', error: response.error })
    } else {
      yield put({ type: 'UPDATE_LOADED', result: response })
    }
}

function* postSettingsSaga (action) {
    const response = yield call(postSettings, action.settings);
    if (response.error) {
      yield put({ type: 'UPDATE_FAILED', error: response.error })
    } else {
      yield put({ type: 'SETTINGS_SAVED', settings: response })
    }
}

// "Root" watcher saga that will start specific saga when an action
// of a specific type is triggered:
function *watcherSaga () {
  yield all([
    takeEvery('REQUEST_UPDATE', requestSaga),
    takeEvery('UPDATE_SETTINGS', postSettingsSaga),
  ])
}

const sagaMiddleware = createSagaMiddleware();

// STORE ==================================================
const initialState = {
  state: {},
  messages: [],
  saving: false
};

// Actions:
const requestUpdate = () => ({ type: 'REQUEST_UPDATE' });
const updateSettings = (settings) => ({ type: 'UPDATE_SETTINGS', settings });

// Selector example:
const selectState = state => state.state ? state.state : null;
const selectMessages = state => state.messages ? state.messages : [];
const selectSettings = state => state.settings ? state.settings : {};
const selectError = state => state.error;

// Reducer example:
function reducer (state=initialState, action) {
  if (action.type === 'UPDATE_LOADED') {
    return Object.assign({}, state, {
      state: action.result.state,
      messages: action.result.messages,
      settings: action.result.settings,
      error: null
    })
  }
  else if (action.type === 'UPDATE_FAILED') {
    return Object.assign({}, state, {
      error: action.error,
      saving: false
    })
  }
  else if (action.type === 'UPDATE_SETTINGS') {
    return Object.assign({}, state, {
      saving: true
    })
  }
  else if (action.type === 'SETTINGS_SAVED') {
    return Object.assign({}, state, {
      settings: action.settings,
      saving: false
    })
  }
  return state
}

// Create store and start the "root" saga that will react to dispatched actions:
let store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watcherSaga);

// COMPONENT ==================================================

// create additional props from redux state that will be passed as props to the component:
const mapStateToProps = state => ({
  state: selectState(state),
  messages: selectMessages(state),
  settings: selectSettings(state),
  error: selectError(state),
  saving: state.saving
});

// Create additional props using the dispatcher that will be passed as props to the component:
const mapDispatchToProps = dispatch => ({
  requestUpdate: () => dispatch(requestUpdate()),
  updateSettings: (settings) => dispatch(updateSettings(settings))
});

// "Wrap" the component with injector that adds the additional props from running the two functions
// Into the component:
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Now we can render our application into it
render((
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
), document.getElementById('root'));
