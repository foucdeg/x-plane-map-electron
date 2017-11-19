import React, { Component } from 'react';
import EditableText from './EditableText';
import { ICONS } from '../constants';

export default class PlaneRow extends Component {
  handleRadioClick(e) {
    this.props.onPlaneSelect(this.props.plane);
  }

  render() {
    return (
      <tr
        title="Click to change plane icon"
        className={ this.props.isFollowed ? 'followed' : '' }
        onClick={this.handleRadioClick.bind(this)}
      >
        <td
          onClick={this.props.onPlaneIconChange.bind(this, this.props.plane)}
        >
          <img src={ICONS[this.props.plane.icon]} />
        </td>
        <td title="Double-click to rename">
          <EditableText
            value={ this.props.plane.name }
            onSubmit={ this.props.onPlaneRename }
          />
          <div className="second-row">
            <span>{ this.props.plane.altitude.toLocaleString('en-us', { maximumFractionDigits: 0 }) } ft</span>
            &nbsp; &middot; &nbsp;
            <span>{ this.props.plane.heading.toLocaleString('en-us', { maximumFractionDigits: 0 }) }&deg;</span>
            &nbsp; &middot; &nbsp;
            <span>GS { this.props.plane.speed.toLocaleString('en-us', { maximumFractionDigits: 0 }) } kts</span>
          </div>
        </td>
        <td title="Click to show or hide trace.">
          <input
            type="checkbox"
            checked={this.props.plane.isTraceActive}
            onChange={this.props.onPlaneTraceToggle.bind(this, this.props.plane)}
           />
        </td>
        <td title="Click to reset the plane\'s trace.">
          <button
            onClick={this.props.onPlaneTraceClear.bind(this, this.props.plane)}
          >Clr</button>
        </td>
      </tr>
    );
  }
}
