import React from 'react';
import PropTypes from 'prop-types';
import some from 'lodash/_arraySome';
import TextField from 'material-ui/TextField/TextField';

const isValidPartOfIpAddress = (currentValue, newChar) => {
  // expect ints or dots
  if (!newChar.match(/[\d|\\.]/)) return false;

  // expect no longer than 15 chars
  const futureValue = currentValue + newChar;
  if (futureValue.length > 15) return false;

  const intBits = futureValue.split('.');
  // expect no more than 4 integer sections
  if (intBits.length > 4) return false;
  // expect each integer section to be < 256
  if (some(intBits, bit => parseInt(bit) > 255)) return false;
  // expect at least one int between each dot
  if (some(intBits.slice(0, -1), bit => bit.length === 0)) return false;
  return true;
};

class IpAddressInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    if (!isValidPartOfIpAddress(this.props.value, e.key)) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <TextField
        type="text"
        placeholder="e.g. 192.168.1.13"
        onKeyPress={this.handleKeyPress}
        {...this.props}
      />
    );
  }
}

IpAddressInput.propTypes = {
  value: PropTypes.string,
};

IpAddressInput.defaultProps = {
  value: '',
};

export default IpAddressInput;
