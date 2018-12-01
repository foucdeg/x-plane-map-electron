import React from 'react';
import PropTypes from 'prop-types';
import XPlaneSetupText from './XPlaneSetupText';

const MultiServerSection = props => (
  <section>
    {props.isConfigValid || (
      <p className="error">Please fix the port issue in the Advanced Setup tab first.</p>
    )}
    <h2>Map Configuration for Other Players</h2>
    <p>
      Tell your fellow pilots to connect their Airspace app to your map server at
      the IP <strong>{props.localIP}</strong> and port <strong>{props.mapServerPort}</strong>.
    </p>
    <h2>X-Plane Configuration for Everybody</h2>
    <XPlaneSetupText
      ip={props.localIP}
      port={props.xPlanePort}
      xPlaneVersion={props.xPlaneVersion}
    />
  </section>
);

MultiServerSection.propTypes = {
  xPlanePort: PropTypes.number.isRequired,
  localIP: PropTypes.string.isRequired,
  mapServerPort: PropTypes.number.isRequired,
  isConfigValid: PropTypes.bool.isRequired,
  xPlaneVersion: PropTypes.number.isRequired,
};

export default MultiServerSection;

