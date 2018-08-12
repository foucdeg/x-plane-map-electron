/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import PortInputWithAvailabilityCheck from './PortInputWithAvailabilityCheck';

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
      <section>
        <h2>Advanced Configuration</h2>
        <form onSubmit={this.handleSubmit}>
          {/* eslint-disable react/jsx-no-bind */}
          <PortInputWithAvailabilityCheck
            label="X-Plane listening port"
            value={this.state.xPlanePort}
            onChange={this.onPortChange.bind(this, 'xPlanePort')}
            onAvailabilityResult={this.onPortAvailabilityChange.bind(this, 'xPlanePort')}
          />
          <p>
            This is the port where we expect X-Plane to send data to (default is 49003).
          </p>
          <PortInputWithAvailabilityCheck
            value={this.state.mapServerPort}
            onChange={this.onPortChange.bind(this, 'mapServerPort')}
            label="Map server port"
            onAvailabilityResult={this.onPortAvailabilityChange.bind(this, 'mapServerPort')}
          />
          {/* eslint-enable react/jsx-no-bind */}
          <p>
            This is the port where the map server on this computer will serve the map
            (default is 8080).
          </p>
          <p>
            If you wish to access the map on a mobile device, this computer&apos;s firewall
            should accept inbound TCP traffic on this port.
          </p>
          <Button
            raised
            type="submit"
            color="primary"
            disabled={!this.isValid()}
          >
            Save
          </Button>
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

