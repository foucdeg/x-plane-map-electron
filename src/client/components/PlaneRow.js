import React, { Component } from 'react';

export default class PlaneRow extends Component {
  handleRadioClick(e) {
    this.props.onPlaneSelect(this.props.plane);
  }

  render() {
    return (
      <tr className={ this.props.isFollowed ? 'followed' : '' }>
        <td
          style={{ backgroundColor: this.props.plane.color }}
          title="Click to focus on this plane."
          onClick={this.handleRadioClick.bind(this)}
        >
          <label>
            <input type="radio" name="plane"/>
          </label>
        </td>
        <td title="Double-click to rename">
          <strong>{ this.props.plane.name }</strong>
          <br />
          <span>{ this.props.plane.altitude } ft</span>
          &nbsp; &middot; &nbsp;
          <span>{ this.props.plane.heading.toFixed() }&deg;</span>
          &nbsp; &middot; &nbsp;
          <span>GS { this.props.plane.speed.toFixed() } kts</span>
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
