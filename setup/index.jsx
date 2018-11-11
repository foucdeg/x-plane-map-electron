/* globals document */

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './style.less';

import reducer from './reducer';
import SetupApp from './containers/SetupApp';

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);

render(
  <Provider store={store}>
    <SetupApp />
  </Provider>,
  document.getElementById('root'),
);
