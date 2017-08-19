import React, { Component } from 'react';
import PlaneRow from './PlaneRow';
import { PERIOD } from '../constants';
import { decodeConfig } from '../helpers';
import QRCode from 'qrcode.react';

export default class Panel extends Component {
  constructor() {
    super();

    const config = decodeConfig();
    this.qrCodeUrl = 'http://' + config.localIP + ':' + config.mapServerPort + '/app.html' + document.location.search;
  }

  componentDidMount() {
    this.planeFetchInterval = setInterval(() => {
      this.props.fetchPlanes()
    }, PERIOD);
  }

  componentWillUnmount() {
    clearInterval(this.planeFetchInterval);
  }

  render() {
    return (
      <div id="panel">
        <table id="planesTable">
          <thead>
            <tr>
              <th title="Click to focus on this plane.">
                <label>
                  <input type="radio" id="nofocus" name="plane" />
                </label>
              </th>
              <th title="Double-click to rename.">Name</th>
              <th title="Click to show or hide trace.">Trace</th>
              <th title="Click to reset the plane's trace.">Clear</th>
            </tr>
          </thead>
          <tbody>
            { this.props.planes.map(plane => (
              <PlaneRow
                plane={plane}
                key={plane.ip}
                isFollowed={plane.ip === this.props.followedPlane }
                onPlaneSelect={this.props.onPlaneSelect}
                onPlaneTraceToggle={this.props.onPlaneTraceToggle}
                onPlaneTraceClear={this.props.onPlaneTraceClear}
                onPlaneRename={this.props.onPlaneRename.bind(this, plane)}
              />
            ))}
            { this.props.planes.length === 0 && (
              <tr>
                <td></td>
                <td>No plane yet</td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
        <div id="bottom-qr-code">
          <QRCode value={this.qrCodeUrl} size={160}/>
          <p>Scan this code from a mobile device to view mobile version</p>
        </div>
      </div>
    );
  }
}
