import React from 'react';
import PropTypes from 'prop-types';

import ExternalLink from './ExternalLink';

const MultiServerSection = props => (
  <section>
    {props.isConfigValid || (
      <p className="error">Please fix the port issue in the Advanced Setup tab first.</p>
    )}
    <h2>Map Configuration for Other Players</h2>
    <p>
      Tell your fellow pilots to connect their X-Plane-Map to your map server at
      the IP <strong>{props.localIP}</strong> and port <strong>{props.mapServerPort}</strong>.
    </p>
    <h2>X-Plane Configuration for Everybody</h2>
    <p>
      In Settings &gt; Data Input & Output, under the Data Set tab, check data line 20 for
      UDP output (first checkbox).
    </p>
    <p>
      In Settings &gt; Net Connections, under the Data tab,
      enter <strong>{props.localIP}</strong> for the IP
      and <strong>{props.xPlanePort}</strong> for the port.
    </p>
    <p><ExternalLink href="http://xmap.fouc.net/XPlaneConfig.html">These screenshots</ExternalLink> may help.</p>
  </section>
);

MultiServerSection.propTypes = {
  xPlanePort: PropTypes.number.isRequired,
  localIP: PropTypes.string.isRequired,
  mapServerPort: PropTypes.number.isRequired,
  isConfigValid: PropTypes.bool.isRequired,
};

export default MultiServerSection;

