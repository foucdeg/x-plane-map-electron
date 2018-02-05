/* eslint import/no-extraneous-dependencies: "off" */
import * as actions from './actions';

const initialState = { loading: true };

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_CONFIG:
      return {
        ...state,
        ...action.data,
        loading: false,
      };
    default:
      return { ...state };
  }
};
