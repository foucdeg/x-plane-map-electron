/* eslint import/no-extraneous-dependencies: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import PortInput from './PortInput';

class PortInputWithAvailabilityCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      isAvailable: null,
    };

    this.onAvailabilityResult = this.onAvailabilityResult.bind(this);
  }

  componentDidMount() {
    this.checkAvailability(this.props.value);

    ipcRenderer.on('checkPortResponse', this.onAvailabilityResult);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value === this.props.value) return;
    this.checkAvailability(newProps.value);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('checkPortResponse', this.onAvailabilityResult);
  }

  onAvailabilityResult(event, port, isAvailable) {
    if (port !== this.props.value) return;
    this.setState({
      isFetching: false,
      isAvailable,
    });
    this.props.onAvailabilityResult(isAvailable);
  }

  checkAvailability(port) {
    this.props.onAvailabilityResult(false);
    ipcRenderer.send('checkPort', port);
    this.setState({
      isFetching: true,
    });
  }

  render() {
    const { value, onChange, className } = this.props;
    const inputProps = { value, onChange, className };
    return (
      <React.Fragment>
        <PortInput {...inputProps} />
        {this.state.isFetching && (
          <span>Checking...</span>
        )}
        {!this.state.isFetching && this.state.isAvailable && (
          <span>Available!</span>
        )}
        {!this.state.isFetching && this.state.isAvailable === false && (
          <span>Unavailable.</span>
        )}
      </React.Fragment>
    );
  }
}

PortInputWithAvailabilityCheck.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  onAvailabilityResult: PropTypes.func,
};

PortInputWithAvailabilityCheck.defaultProps = {
  onAvailabilityResult: () => {},
  className: '',
};

export default PortInputWithAvailabilityCheck;
