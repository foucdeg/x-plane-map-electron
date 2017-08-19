import React, { Component } from 'react';
import PlaneRow from './PlaneRow';
import { PERIOD } from '../constants';
import { decodeConfig } from '../helpers';
import QRCode from 'qrcode.react';
console.log(QRCode);

export default class Panel extends Component {
  constructor() {
    super();

    const config = decodeConfig();
    this.qrCodeUrl = 'http://' + config.localIP + ':' + config.mapServerPort + '/app.html' + document.location.search;
    console.dir(this.qrCodeUrl.toString());
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
              />
            ))}
            { this.props.planes.length === 0 && (
              <tr>
                <td colSpan="5" className="full-width-cell">No plane yet</td>
              </tr>
            )}
          </tbody>
        </table>
        <div id="bottom-qr-code">
          Scan this code from a mobile device to view mobile version
          <QRCode value={this.qrCodeUrl} />
        </div>
        <span id="bottom-note">
          External Moving Map v2.0
          <br />
          Developed by <a className="js-external-link" href="mailto:foucauld.degeorges@gmail.com">Foucauld Degeorges</a> and released for free on <a className="js-external-link" href="http://forums.x-plane.org/index.php?app=downloads&showfile=25569">x-plane.org</a>
          <br />
          App icon made by <a className="js-external-link" href="http://www.freepik.com" title="Freepik">Freepik</a> from <a className="js-external-link" href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a>, licensed by <a className="js-external-link" href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
        </span>
      </div>
    );
  }
}
