import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'material-ui/Switch';
import { X_PLANE_10, X_PLANE_11 } from '../actions';

class NavMenuSwitch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const newValue = this.props.value === X_PLANE_10 ? X_PLANE_11 : X_PLANE_10;
    this.props.onChange(newValue);
  }

  render() {
    return (
      <a className="nav-item nav-switch">
        <h3>{this.props.title}</h3>
        <p>
          X-Plane 11
          <Switch
            checked={this.props.value === X_PLANE_10}
            onChange={this.handleChange}
          />
          X-Plane 9-10
        </p>
      </a>
    );
  }
}

NavMenuSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default NavMenuSwitch;
