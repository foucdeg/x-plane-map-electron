/* eslint import/no-extraneous-dependencies: "off" */
import * as actionConstants from './actions';

const initialState = { loading: true, xPlaneVersion: actionConstants.X_PLANE_11 };

export default (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.SET_CONFIG:
      return {
        ...state,
        ...action.data,
        loading: false,
      };
    case actionConstants.SET_X_PLANE_VERSION:
      return {
        ...state,
        xPlaneVersion: action.xPlaneVersion,
      };
    default:
      return { ...state };
  }
};
