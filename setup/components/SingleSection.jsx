import React from 'react';
import PropTypes from 'prop-types';
import XPlaneSetupText from './XPlaneSetupText';

const SingleSectionCmp = props => (
  <section>
    { props.isConfigValid || (
      <p className="error">Please fix the port issue in the Advanced Setup tab first.</p>
    )}
    <h2>X-Plane Configuration</h2>
    <XPlaneSetupText port={props.xPlanePort} xPlaneVersion={props.xPlaneVersion} />
  </section>
);

SingleSectionCmp.propTypes = {
  xPlanePort: PropTypes.number.isRequired,
  isConfigValid: PropTypes.bool.isRequired,
  xPlaneVersion: PropTypes.number.isRequired,
};

export default SingleSectionCmp;

