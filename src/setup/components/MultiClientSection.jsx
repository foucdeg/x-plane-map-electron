/* globals fetch */
import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';

import IpAddressInput from './IpAddressInput';
import PortInput from './PortInput';
import ExternalLink from './ExternalLink';

const renderConnectionFailure = () => (
  <p id="mapServerConnectionFailure">
    The map server isn&apos;t responding.
    Please check the above information against the map server config.
    Maybe their firewall isn&apos;t letting you through.
  </p>
);


class MultiClientSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      connectionTestStatus: null,
    };

    this.onRemoteServerIPChange = this.onRemoteServerIPChange.bind(this);
    this.onRemoteMapServerPortChange = this.onRemoteMapServerPortChange.bind(this);
    this.onConnectionAttempt = this.onConnectionAttempt.bind(this);
    this.onConnectionSuccess = this.onConnectionSuccess.bind(this);
    this.onConnectionFailure = this.onConnectionFailure.bind(this);
  }

  onRemoteServerIPChange(e) {
    this.setState({ remoteServerIP: e.target.value });
  }

  onRemoteMapServerPortChange(e) {
    this.setState({ remoteMapServerPort: e.target.value });
  }

  onConnectionAttempt(e) {
    this.setState({ connectionTestStatus: 'PENDING' });
    e.preventDefault();
    fetch(`http://${this.state.remoteServerIP}:${this.state.remoteMapServerPort}/api/config`)
      .then(this.onConnectionSuccess)
      .catch(this.onConnectionFailure);
  }

  onConnectionSuccess(remoteConfig) {
    this.setState({ connectionTestStatus: 'SUCCESS' });
    this.props.onSave({
      remoteXPlanePort: remoteConfig.xPlanePort,
      remoteMapServerPort: this.state.remoteMapServerPort,
      remoteServerIP: this.state.remoteServerIP,
    });
  }

  onConnectionFailure() {
    this.setState({ connectionTestStatus: 'FAILURE' });
  }

  renderConnectionSuccess() {
    return (
      <div id="mapServerConnectionSuccess">
        <p>The map server is responding to us. It&apos;s looking good!</p>
        <h2>X-Plane Configuration</h2>
        <p>
          In Settings &gt; Data Input &amp; Output, under the Data Set tab,
          check data line 20 for UDP output (first checkbox).
        </p>
        <p>
          In Settings &gt; Net Connections, under the Data tab, enter
          <strong>{this.props.remoteServerIP}</strong> for the IP and
          <strong>{this.props.remoteXPlanePort}</strong> for the port.
        </p>
        <p><ExternalLink href="http://xmap.fouc.net/XPlaneConfig.html">These screenshots</ExternalLink> may help.</p>
      </div>
    );
  }

  render() {
    return (
      <section>
        <h2>Map Server</h2>
        <p>Please enter the map server address as displayed on their setup screen.</p>
        <form id="remoteConfigForm" onSubmit={this.onConnectionAttempt}>
          IP address : <IpAddressInput
            value={this.state.remoteServerIP}
            onChange={this.onRemoteServerIPChange}
          /> Port : <PortInput
            value={this.state.remoteMapServerPort}
            onChange={this.onRemoteMapServerPortChange}
          />
          { this.state.connectionTestStatus === 'PENDING' && <CircularProgress size={20} />}
          { this.state.connectionTestStatus !== 'PENDING' && (
            <input
              className="action"
              type="submit"
              value="Connect"
            />
          )}
        </form>
        { this.state.connectionTestStatus === 'FAILURE' && renderConnectionFailure() }
        { this.state.connectionTestStatus === 'SUCCESS' && this.renderConnectionSuccess() }
      </section>
    );
  }
}

MultiClientSection.propTypes = {
  remoteXPlanePort: PropTypes.number.isRequired,
  remoteServerIP: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default MultiClientSection;

