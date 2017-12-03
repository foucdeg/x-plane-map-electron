/* globals document */

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import xPlaneMapApp from './reducers';
import App from './components/App';
import { decodeConfig } from './helpers';

const store = createStore(
  xPlaneMapApp,
  applyMiddleware(thunk.withExtraArgument(decodeConfig())),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
