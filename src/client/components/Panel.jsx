/* globals document */

import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';

import PlaneRow from './PlaneRow';
import { PERIOD } from '../constants';
import { decodeConfig } from '../helpers';

class Panel extends Component {
  constructor() {
    super();

    const config = decodeConfig();
    this.qrCodeUrl = `http://${config.localIP}:${config.mapServerPort}/app.html${document.location.search}`;
  }

  componentDidMount() {
    this.planeFetchInterval = setInterval(() => {
      this.props.fetchPlanes();
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
              <th title="Click to change plane icon." />
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
                isFollowed={plane.ip === this.props.followedPlane}
                onPlaneSelect={this.props.onPlaneSelect}
                /* eslint-disable react/jsx-no-bind */
                onPlaneTraceToggle={this.props.onPlaneTraceToggle.bind(this, plane)}
                onPlaneTraceClear={this.props.onPlaneTraceClear.bind(this, plane)}
                onPlaneIconChange={this.props.onPlaneIconChange.bind(this, plane)}
                onPlaneRename={this.props.onPlaneRename.bind(this, plane)}
                /* eslint-enable react/jsx-no-bind */
              />
            ))}
            { this.props.planes.length === 0 && (
              <tr>
                <td />
                <td>No plane yet</td>
                <td />
                <td />
              </tr>
            )}
          </tbody>
        </table>
        <div id="bottom-qr-code">
          <QRCode value={this.qrCodeUrl} size={160} />
          <p>Scan this code from a mobile device to view mobile version</p>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  fetchPlanes: PropTypes.func.isRequired,
  followedPlane: PropTypes.string,
  planes: PropTypes.arrayOf(PropTypes.any).isRequired,
  onPlaneSelect: PropTypes.func.isRequired,
  onPlaneTraceClear: PropTypes.func.isRequired,
  onPlaneTraceToggle: PropTypes.func.isRequired,
  onPlaneIconChange: PropTypes.func.isRequired,
  onPlaneRename: PropTypes.func.isRequired,
};

Panel.defaultProps = {
  followedPlane: null,
};

export default Panel;
