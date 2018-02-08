import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from './ExternalLink';

const SingleSectionCmp = props => (
  <section>
    { props.isConfigValid || (
      <p className="error">Please fix the port issue in the Advanced Setup tab first.</p>
    )}
    <h2>X-Plane Configuration</h2>
    <p>
      In Settings &gt; Data Input & Output, under the Data Set tab,
      check data line 20 for UDP output (first checkbox).
    </p>
    <p>
      In Settings &gt; Net Connections, under the Data tab,
      enter <strong>127.0.0.1</strong> for the IP
      and <strong>{props.xPlanePort}</strong> for the port.
    </p>
    <p><ExternalLink href="http://xmap.fouc.net/XPlaneConfig.html">These screenshots</ExternalLink> may help.</p>
  </section>
);

SingleSectionCmp.propTypes = {
  xPlanePort: PropTypes.number.isRequired,
  isConfigValid: PropTypes.bool.isRequired,
};

export default SingleSectionCmp;

