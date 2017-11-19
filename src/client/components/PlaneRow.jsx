import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableText from './EditableText';
import { ICONS } from '../constants';

class PlaneRow extends Component {
  constructor() {
    super();

    this.handleRadioClick = this.handleRadioClick.bind(this);
  }

  handleRadioClick() {
    this.props.onPlaneSelect(this.props.plane);
  }

  render() {
    return (
      <tr
        title="Click to change plane icon"
        className={this.props.isFollowed ? 'followed' : ''}
        onClick={this.handleRadioClick}
      >
        <td
          onClick={this.props.onPlaneIconChange}
        >
          <img src={ICONS[this.props.plane.icon]} alt="icon" />
        </td>
        <td title="Double-click to rename">
          <EditableText
            value={this.props.plane.name}
            onSubmit={this.props.onPlaneRename}
          />
          <div className="second-row">
            <span>{this.props.plane.altitude.toLocaleString('en-us', { maximumFractionDigits: 0 }) } ft</span>
            &nbsp; &middot; &nbsp;
            <span>{this.props.plane.heading.toLocaleString('en-us', { maximumFractionDigits: 0 }) }&deg;</span>
            &nbsp; &middot; &nbsp;
            <span>GS {this.props.plane.speed.toLocaleString('en-us', { maximumFractionDigits: 0 }) } kts</span>
          </div>
        </td>
        <td title="Click to show or hide trace.">
          <input
            type="checkbox"
            checked={this.props.plane.isTraceActive}
            onChange={this.props.onPlaneTraceToggle}
          />
        </td>
        <td title="Click to reset the plane\'s trace.">
          <button
            onClick={this.props.onPlaneTraceClear}
          >
            Clr
          </button>
        </td>
      </tr>
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
  }).isRequired,
};

export default PlaneRow;
