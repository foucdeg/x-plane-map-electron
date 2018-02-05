import React from 'react';

const handleKeyPress = (event) => {
  if (!event.key.match(/\d/)) event.preventDefault();
};

const PortInput = props => (
  <input
    type="number"
    min={1024}
    max={65535}
    size={5}
    onKeyPress={handleKeyPress}
    {...props}
  />
);

export default PortInput;
