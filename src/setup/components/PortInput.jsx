import React from 'react';

const PortInput = props => (
  <input
    type="number"
    min={1024}
    max={65535}
    {...props}
  />
);

export default PortInput;
