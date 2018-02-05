/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';

import PortInputWithAvailabilityCheck from './PortInputWithAvailabilityCheck';
import ExternalLink from './ExternalLink';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

class ConfigSection extends React.Component {
  constructor(props) {
    super(props);

    const { xPlanePort, mapServerPort, mapTilesUrl } = props;
    this.state = {
      xPlanePort,
      mapServerPort,
      mapTilesUrl,
      isXPlanePortValid: false,
      isMapServerPortValid: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onMapTilesUrlChange = this.onMapTilesUrlChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { xPlanePort, mapServerPort, mapTilesUrl } = newProps;
    this.setState({ xPlanePort, mapServerPort, mapTilesUrl });
  }

  onPortChange(field, event) {
    this.setState({
      [field]: parseInt(event.target.value, 10),
    });
  }

  onPortAvailabilityChange(field, isAvailable) {
    const validKey = `is${capitalizeFirstLetter(field)}Valid`;
    this.setState({ [validKey]: isAvailable });
  }

  onMapTilesUrlChange(event) {
    this.setState({ mapTilesUrl: event.target.value });
  }

  isValid() {
    return this.state.isXPlanePortValid && this.state.isMapServerPortValid;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.isValid()) return;
    const { xPlanePort, mapServerPort, mapTilesUrl } = this.state;
    this.props.onSave({ xPlanePort, mapServerPort, mapTilesUrl });
  }

  render() {
    return (
      <section data-section-id="config">
        <h2>Advanced Configuration</h2>
        <form id="localConfigForm" onSubmit={this.handleSubmit}>
          {/* eslint-disable react/jsx-no-bind */}
          <label>
            X-Plane listening port: <PortInputWithAvailabilityCheck
              value={this.state.xPlanePort}
              onChange={this.onPortChange.bind(this, 'xPlanePort')}
              onAvailabilityResult={this.onPortAvailabilityChange.bind(this, 'xPlanePort')}
            />
          </label>
          <p>
            This is the port where we expect X-Plane to send data to.
            Change it if you can&apos;t use the default one (49003).
          </p>
          <label>
            Map server port: <PortInputWithAvailabilityCheck
              value={this.state.mapServerPort}
              onChange={this.onPortChange.bind(this, 'mapServerPort')}
              onAvailabilityResult={this.onPortAvailabilityChange.bind(this, 'mapServerPort')}
            />
          </label>
          {/* eslint-enable react/jsx-no-bind */}
          <p>
            This is the port where the map server on this computer will serve the map.
            Change it if you can&apos;t use the default one (8080).
          </p>
          <p>
            If you wish to access the map on a mobile device, this computer&apos;s firewall
            should accept inbound TCP traffic on this port.
          </p>
          <label>
            Navigation overlay URL:{' '}
            <input
              name="mapTilesUrl"
              type="text"
              size="35"
              value={this.state.mapTilesUrl}
              onChange={this.onMapTilesUrlChange}
            />
          </label>
          <p>
            This is the URL to get the navigation data overlay from.
            The default is my server (http://x-plane-map.fouc.net/nav.php),
            change this if you have your own. Learn how it works
            from <ExternalLink href="https://github.com/foucdeg/x-plane-map-server">Github</ExternalLink>.
          </p>
          { this.isValid() &&
            <input
              className="action"
              type="submit"
              value="Save"
            />
          }
        </form>
      </section>
    );
  }
}

ConfigSection.propTypes = {
  xPlanePort: PropTypes.number.isRequired,
  mapServerPort: PropTypes.number.isRequired,
  mapTilesUrl: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ConfigSection;

