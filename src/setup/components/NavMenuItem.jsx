import React from 'react';
import PropTypes from 'prop-types';
import WarningIcon from '@material-ui/icons/Warning';

const NavMenuItem = props => (
  <a className={`nav-item${props.active ? ' active' : ''}`} onClick={props.onClick}>
    <h3>{props.title}</h3>
    { props.subtext && (
      <p className="nav-subtext">{props.subtext}</p>
    )}
    { props.hasWarning && <WarningIcon className="nav-warning" />}
  </a>
);

NavMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  active: PropTypes.bool,
  hasWarning: PropTypes.bool,
};

NavMenuItem.defaultProps = {
  subtext: '',
  active: false,
  hasWarning: false,
};

export default NavMenuItem;
