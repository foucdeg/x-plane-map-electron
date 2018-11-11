import React from 'react';
import PropTypes from 'prop-types';

import ExternalLink from './ExternalLink';
import { X_PLANE_11 } from '../actions';

const XPlaneSetupText = (props) => {
  if (props.xPlaneVersion === X_PLANE_11) {
    return (
      <React.Fragment>
        <p>
          In Settings &gt; Data Input & Output, under the Data Set tab,
          check data line 20 for UDP output (first checkbox).
        </p>
        <p>
          In Settings &gt; Net Connections, under the Data tab,
          enter <strong>{props.ip}</strong> for the IP
          and <strong>{props.port}</strong> for the port.
        </p>
        <p><ExternalLink href="http://xmap.fouc.net/XPlaneConfig.html">These screenshots</ExternalLink> may help.</p>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <p>
        In Settings &gt; Data Output, under the General Data Output tap,
        check data line 20 for UDP output (last checkbox).
      </p>
      <p>
        On the bottom right side, enter <strong>{props.ip}</strong> for the IP
        and <strong>{props.port}</strong> for the port,
        and check the &quot;Send network data output&quot; checkbox.
      </p>
      <p><ExternalLink href="http://xmap.fouc.net/XPlaneConfig.html">These screenshots</ExternalLink> may help.</p>
    </React.Fragment>
  );
};

XPlaneSetupText.propTypes = {
  port: PropTypes.number.isRequired,
  ip: PropTypes.string,
  xPlaneVersion: PropTypes.number.isRequired,
};

XPlaneSetupText.defaultProps = {
  ip: '127.0.0.1',
};

export default XPlaneSetupText;
