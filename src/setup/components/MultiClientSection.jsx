/* globals fetch */
import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import IpAddressInput from './IpAddressInput';
import PortInput from './PortInput';
import XPlaneSetupText from './XPlaneSetupText';

const renderConnectionFailure = () => (
  <p>
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
      <React.Fragment>
        <p>The map server is responding to us. It&apos;s looking good!</p>
        <h2>X-Plane Configuration</h2>
        <XPlaneSetupText
          ip={this.props.remoteServerIP}
          port={this.props.remoteXPlanePort}
          xPlaneVersion={this.props.xPlaneVersion}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <section>
        <h2>Map Server</h2>
        <p>Please enter the map server address as displayed on their setup screen.</p>
        <form onSubmit={this.onConnectionAttempt}>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <IpAddressInput
                fullWidth
                label="IP address"
                value={this.state.remoteServerIP}
                onChange={this.onRemoteServerIPChange}
              />
            </Grid>
            <Grid item xs={4}>
              <PortInput
                label="Port"
                value={this.state.remoteMapServerPort}
                onChange={this.onRemoteMapServerPortChange}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                raised
                type="submit"
                color="primary"
                disabled={this.state.connectionTestStatus === 'PENDING'}
              >
                {this.state.connectionTestStatus !== 'PENDING' && 'Connect'}
                {this.state.connectionTestStatus === 'PENDING' && <CircularProgress size={14} />}
              </Button>
            </Grid>
          </Grid>
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
  xPlaneVersion: PropTypes.number.isRequired,
};

export default MultiClientSection;

