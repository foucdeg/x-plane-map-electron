import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const handleKeyPress = (event) => {
  if (!event.key.match(/\d/)) event.preventDefault();
};

const PortInput = props => (
  <TextField
    {...props}
    fullWidth
    inputProps={{
      type: 'number',
      min: 1024,
      max: 65535,
    }}
    onKeyPress={handleKeyPress}
  />

);

PortInput.propTypes = {
  label: PropTypes.string.isRequired,
};

export default PortInput;
