/* eslint no-underscore-dangle: ["error", { "allow": ["_zoom"] }] */

import React, { Component } from 'react';
import { Map as LeafletMap, Popup, Marker, LayersControl } from 'react-leaflet';
import PropTypes from 'prop-types';

import { POLYLINE_OPTIONS, BUILT_ICONS } from '../constants';
import { decodeConfig } from '../helpers';
import Trace from './Trace';
import GoogleMapLayer from './GoogleMapLayer';
import GoogleSatelliteLayer from './GoogleSatelliteLayer';

require('leaflet-rotatedmarker');
require('leaflet.gridlayer.googlemutant');

Marker.prototype.updateLeafletElement = function updateLeafletElement(fromProps, toProps) {
  if (toProps.position !== fromProps.position) {
    this.leafletElement.setLatLng(toProps.position);
  }
  if (toProps.icon !== fromProps.icon) {
    this.leafletElement.setIcon(toProps.icon);
  }
  if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
    this.leafletElement.setZIndexOffset(toProps.zIndexOffset);
  }
  if (toProps.opacity !== fromProps.opacity) {
    this.leafletElement.setOpacity(toProps.opacity);
  }
  if (toProps.draggable !== fromProps.draggable) {
    if (toProps.draggable === true) {
      this.leafletElement.dragging.enable();
    } else {
      this.leafletElement.dragging.disable();
    }
  }
  if (toProps.rotationAngle !== fromProps.rotationAngle) {
    this.leafletElement.setRotationAngle(toProps.rotationAngle);
  }
};

class Map extends Component {
  constructor() {
    super();
    this.state = {
      currentPosition: [0, 0],
      zoom: 8,
    };
    this.mapTilesUrl = decodeConfig().mapTilesUrl;
    this.handleZoom = this.handleZoom.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.followedPlane) return;
    const plane = nextProps.planes.find(aPlane => aPlane.ip === nextProps.followedPlane);
    if (!plane) return;
    this.setState({
      currentPosition: plane.position,
    });
  }

  //
  handleZoom(e) {
    this.setState({
      zoom: e.target._zoom,
    });
  }

  render() {
    return (
      <LeafletMap
        center={this.state.currentPosition}
        zoom={this.state.zoom}
        onDragstart={this.props.onPlaneLeave}
        onZoomend={this.handleZoom}
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer name="Roads" checked>
            <GoogleMapLayer />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <GoogleSatelliteLayer />
          </LayersControl.BaseLayer>
          {/* <LayersControl.Overlay name='Navaids'>
            <NavLayer />
          </LayersControl.Overlay> */}
        </LayersControl>
        { this.props.planes.map(plane => (
          <Marker
            key={plane.ip}
            position={plane.position}
            icon={BUILT_ICONS[plane.icon]}
            rotationAngle={plane.heading - 90}
            rotationOrigin="initial"
          >
            <Popup>
              <div className="info-window">
                <strong>{ plane.name }</strong><br />
                { plane.altitude.toLocaleString('en-us', { maximumFractionDigits: 0 }) } ft &middot; &nbsp;
                { plane.heading.toLocaleString('en-us', { maximumFractionDigits: 0 }) } &deg; <br />
                GS { plane.speed.toLocaleString('en-us', { maximumFractionDigits: 0 })} kts
              </div>
            </Popup>
          </Marker>
        ))}
        { this.props.planes
          .filter(plane => plane.isTraceActive)
          .map(plane => (
            <Trace
              {...POLYLINE_OPTIONS}
              key={plane.ip}
              positions={plane.path}
            />
          ))
        }
      </LeafletMap>
    );
  }
}

Map.propTypes = {
  followedPlane: PropTypes.string,
  planes: PropTypes.arrayOf(PropTypes.any).isRequired,
  onPlaneLeave: PropTypes.func.isRequired,
};

Map.defaultProps = {
  followedPlane: null,
};

export default Map;
