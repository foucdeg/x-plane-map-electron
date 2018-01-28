import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction } from 'material-ui/List';
import { IconButton, Avatar, Menu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import ShowChartsIcon from 'material-ui-icons/ShowChart';
import ClearIcon from 'material-ui-icons/Clear';

import EditableText from './EditableText';
import { ICONS } from '../constants';

const makeFloat = float => float.toLocaleString('en-us', { maximumFractionDigits: 0 });

const makeSubtext = (alt, heading, speed) => `${makeFloat(alt)} ft • ${makeFloat(heading)}° • GS ${makeFloat(speed)} kts`;

class PlaneRow extends Component {
  constructor() {
    super();

    this.state = {
      anchorEl: null,
    };

    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleTraceToggleClick = this.handleTraceToggleClick.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
  }

  handleRowClick() {
    this.props.onPlaneSelect(this.props.plane);
  }

  handleTraceToggleClick(e) {
    e.stopPropagation();
    this.props.onPlaneTraceToggle();
  }

  handleMenuOpen(e) {
    e.stopPropagation();
    this.setState({ anchorEl: e.currentTarget });
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { icon, altitude, heading, speed, name } = this.props.plane;
    return (
      <ListItem
        button
        onClick={this.handleRowClick}
        className={this.props.isFollowed ? 'followed' : ''}
      >
        <ListItemAvatar>
          <Avatar onClick={this.props.onPlaneIconChange} src={ICONS[icon]} />
        </ListItemAvatar>
        <ListItemText
          primary={<EditableText value={name} onSubmit={this.props.onPlaneRename} />}
          secondary={makeSubtext(altitude, heading, speed)}
        />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="More"
            aria-haspopup="true"
            onClick={this.handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleMenuClose}
            anchorEl={this.state.anchorEl}
          >
            <MenuItem
              dense
              onClick={() => { this.handleMenuClose(); this.props.onPlaneTraceToggle(); }}
            >
              <ListItemIcon>
                <ShowChartsIcon />
              </ListItemIcon>
              <ListItemText
                inset
                primary={`${this.props.plane.isTraceActive ? 'Hide' : 'Show'} Trace`}
              />
            </MenuItem>
            <MenuItem
              dense
              onClick={() => { this.handleMenuClose(); this.props.onPlaneTraceClear(); }}
            >
              <ListItemIcon>
                <ClearIcon />
              </ListItemIcon>
              <ListItemText
                inset
                primary="Clear Trace"
              />
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

PlaneRow.propTypes = {
  isFollowed: PropTypes.bool.isRequired,
  onPlaneSelect: PropTypes.func.isRequired,
  onPlaneIconChange: PropTypes.func.isRequired,
  onPlaneTraceToggle: PropTypes.func.isRequired,
  onPlaneTraceClear: PropTypes.func.isRequired,
  onPlaneRename: PropTypes.func.isRequired,
  plane: PropTypes.shape({
    isTraceActive: PropTypes.bool.isRequired,
    altitude: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default PlaneRow;
